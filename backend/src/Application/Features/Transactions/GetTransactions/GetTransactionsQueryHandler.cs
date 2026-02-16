using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Locking;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.GetTransactions
{
    /// <summary>
    /// Handler for GetTransactionsQuery returning user-scoped transaction list.
    /// </summary>
    public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, IReadOnlyList<TransactionDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetTransactionsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
        {
            var nowUtc = DateTimeOffset.UtcNow;

            var query = _context.Transactions
                .AsNoTracking()
                .Where(t => t.Wallet.UserId == request.UserId);

            // Filter by wallet if specified
            if (request.WalletId.HasValue)
            {
                query = query.Where(t => t.WalletId == request.WalletId.Value);
            }

            // Optional keyword search across Note and Partner.Name (case-insensitive).
            // DebtPartner has a global soft-delete filter; ignore it for search so deleted partners
            // don't prevent matching historical transactions.
            var searchTerm = request.SearchTerm?.Trim();
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var keyword = searchTerm.ToLower();
                var partners = _context.DebtPartners.IgnoreQueryFilters();

                query = query.Where(t =>
                    (t.Note != null && t.Note.ToLower().Contains(keyword))
                    || (t.PartnerId != null
                        && partners.Any(dp => dp.Id == t.PartnerId.Value
                                           && dp.UserId == request.UserId
                                           && dp.Name != null
                                           && dp.Name.ToLower().Contains(keyword))));
            }

            var transactions = await query
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.CreatedAt)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    WalletId = t.WalletId,
                    PartnerId = t.PartnerId,
                    PartnerName = t.Partner != null ? t.Partner.Name : null,
                    Amount = t.Amount,
                    Note = t.Note,
                    TransactionDate = t.TransactionDate,
                    CreatedAt = t.CreatedAt,
                    PayerMode = (PayerMode?)t.PayerMode,
                    TotalAmount = t.TotalAmount,
                    DebtAmount = t.DebtAmount
                })
                .ToListAsync(cancellationToken);

            foreach (var transaction in transactions)
            {
                transaction.IsLocked = MonthLockPolicy.IsLocked(transaction.TransactionDate, nowUtc);
            }

            return transactions;
        }
    }
}
