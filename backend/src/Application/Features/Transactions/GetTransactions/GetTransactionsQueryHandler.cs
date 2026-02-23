using Application.Common;
using Application.Common.Interfaces;
using Application.Common.Locking;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.GetTransactions
{
    /// <summary>
    /// Handler for GetTransactionsQuery returning user-scoped transaction list.
    /// </summary>
    public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, PagedResult<TransactionDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetTransactionsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
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

            // Get total count before pagination
            var totalCount = await query.CountAsync(cancellationToken);

            // Validate and apply pagination
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Max(1, Math.Min(100, request.PageSize)); // Max 100 items per page

            var transactions = await query
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    WalletId = t.WalletId,
                    WalletName = t.Wallet.Name,
                    ParentWalletName = t.Wallet.ParentWallet != null ? t.Wallet.ParentWallet.Name : null,
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

            if (transactions.Count > 0)
            {
                var transfers = await _context.Transfers
                    .AsNoTracking()
                    .Where(tr => tr.UserId == request.UserId
                                 && (tr.SourceTransactionId != null || tr.DestinationTransactionId != null))
                    .Select(tr => new
                    {
                        tr.Id,
                        tr.FromWalletId,
                        tr.ToWalletId,
                        tr.SourceTransactionId,
                        tr.DestinationTransactionId
                    })
                    .ToListAsync(cancellationToken);

                if (transfers.Count > 0)
                {
                    // Collect transfer wallet IDs
                    var transferWalletIds = transfers
                        .SelectMany(tr => new[] { tr.FromWalletId, tr.ToWalletId })
                        .ToHashSet();

                    var transferWalletNames = await _context.Wallets
                        .AsNoTracking()
                        .Where(w => transferWalletIds.Contains(w.Id))
                        .Select(w => new { w.Id, w.Name })
                        .ToDictionaryAsync(w => w.Id, w => w.Name, cancellationToken);

                    var transferByTransactionId = new Dictionary<Guid, (Guid TransferId, Guid FromWalletId, Guid ToWalletId, string? FromWalletName, string? ToWalletName, TransferDirection Direction)>();
                    foreach (var transfer in transfers)
                    {
                        transferWalletNames.TryGetValue(transfer.FromWalletId, out var fromWalletName);
                        transferWalletNames.TryGetValue(transfer.ToWalletId, out var toWalletName);

                        if (transfer.SourceTransactionId.HasValue)
                        {
                            transferByTransactionId[transfer.SourceTransactionId.Value] = (transfer.Id, transfer.FromWalletId, transfer.ToWalletId, fromWalletName, toWalletName, TransferDirection.Outgoing);
                        }

                        if (transfer.DestinationTransactionId.HasValue)
                        {
                            transferByTransactionId[transfer.DestinationTransactionId.Value] = (transfer.Id, transfer.FromWalletId, transfer.ToWalletId, fromWalletName, toWalletName, TransferDirection.Incoming);
                        }
                    }

                    foreach (var transaction in transactions)
                    {
                        if (transferByTransactionId.TryGetValue(transaction.Id, out var transferContext))
                        {
                            transaction.TransferId = transferContext.TransferId;
                            transaction.TransferFromWalletId = transferContext.FromWalletId;
                            transaction.TransferToWalletId = transferContext.ToWalletId;
                            transaction.TransferFromWalletName = transferContext.FromWalletName;
                            transaction.TransferToWalletName = transferContext.ToWalletName;
                            transaction.TransferDirection = transferContext.Direction;
                        }
                    }
                }
            }

            foreach (var transaction in transactions)
            {
                transaction.IsLocked = MonthLockPolicy.IsLocked(transaction.TransactionDate, nowUtc);
            }

            return new PagedResult<TransactionDto>
            {
                Items = transactions,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}
