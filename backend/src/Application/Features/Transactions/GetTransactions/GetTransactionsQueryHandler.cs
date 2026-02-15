using Application.Common.Exceptions;
using Application.Common.Interfaces;
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
            var query = _context.Transactions
                .AsNoTracking()
                .Where(t => t.Wallet.UserId == request.UserId);

            // Filter by wallet if specified
            if (request.WalletId.HasValue)
            {
                query = query.Where(t => t.WalletId == request.WalletId.Value);
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

            return transactions;
        }
    }
}
