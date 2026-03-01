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

            // Filter by partner if specified
            if (request.PartnerId.HasValue)
            {
                query = query.Where(t => t.PartnerId == request.PartnerId.Value);
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

            // Fetch raw transaction data
            var rawTransactions = await query
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new
                {
                    t.Id,
                    t.WalletId,
                    t.PartnerId,
                    t.Amount,
                    t.Note,
                    t.TransactionDate,
                    t.CreatedAt,
                    t.PayerMode,
                    t.TotalAmount,
                    t.DebtAmount
                })
                .ToListAsync(cancellationToken);

            // Collect wallet and partner IDs
            var walletIds = rawTransactions.Select(t => t.WalletId).ToHashSet();
            var partnerIds = rawTransactions.Where(t => t.PartnerId.HasValue).Select(t => t.PartnerId!.Value).ToHashSet();

            // Fetch wallet names (including soft-deleted)
            var walletData = await _context.Wallets
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Where(w => walletIds.Contains(w.Id))
                .Select(w => new { w.Id, w.Name, w.ParentWalletId })
                .ToDictionaryAsync(w => w.Id, cancellationToken);

            // Get parent wallet IDs
            var parentWalletIds = walletData.Values.Where(w => w.ParentWalletId.HasValue).Select(w => w.ParentWalletId!.Value).ToHashSet();
            var parentWalletNames = await _context.Wallets
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Where(w => parentWalletIds.Contains(w.Id))
                .Select(w => new { w.Id, w.Name })
                .ToDictionaryAsync(w => w.Id, cancellationToken);

            // Fetch partner names (including soft-deleted)
            var partnerNames = await _context.DebtPartners
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Where(p => partnerIds.Contains(p.Id))
                .Select(p => new { p.Id, p.Name })
                .ToDictionaryAsync(p => p.Id, cancellationToken);

            // Build DTOs
            var transactions = rawTransactions.Select(t =>
            {
                walletData.TryGetValue(t.WalletId, out var wallet);
                string? parentWalletName = null;
                if (wallet?.ParentWalletId.HasValue == true)
                {
                    parentWalletNames.TryGetValue(wallet.ParentWalletId.Value, out var parent);
                    parentWalletName = parent?.Name;
                }

                string? partnerName = null;
                if (t.PartnerId.HasValue)
                {
                    partnerNames.TryGetValue(t.PartnerId.Value, out var partner);
                    partnerName = partner?.Name;
                }

                return new TransactionDto
                {
                    Id = t.Id,
                    WalletId = t.WalletId,
                    WalletName = wallet?.Name,
                    ParentWalletName = parentWalletName,
                    PartnerId = t.PartnerId,
                    PartnerName = partnerName,
                    Amount = t.Amount,
                    Note = t.Note,
                    TransactionDate = t.TransactionDate,
                    CreatedAt = t.CreatedAt,
                    PayerMode = (PayerMode?)t.PayerMode,
                    TotalAmount = t.TotalAmount,
                    DebtAmount = t.DebtAmount
                };
            }).ToList();

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

                    // Use IgnoreQueryFilters to include soft-deleted wallets
                    var transferWalletNames = await _context.Wallets
                        .IgnoreQueryFilters()
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
