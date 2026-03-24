using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Locking;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.GetTransactionById
{
    /// <summary>
    /// Handler for GetTransactionByIdQuery returning user-scoped single transaction.
    /// </summary>
    public class GetTransactionByIdQueryHandler : IRequestHandler<GetTransactionByIdQuery, TransactionDto>
    {
        private readonly IApplicationDbContext _context;

        public GetTransactionByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransactionDto> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
        {
            var nowUtc = DateTimeOffset.UtcNow;

            // Fetch raw transaction data
            var rawData = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.Id == request.Id && t.Wallet.UserId == request.UserId)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (rawData == null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

            // Fetch wallet info (including soft-deleted)
            var wallet = await _context.Wallets
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Where(w => w.Id == rawData.WalletId)
                .Select(w => new { w.Id, w.Name, w.ParentWalletId })
                .FirstOrDefaultAsync(cancellationToken);

            // Fetch parent wallet name if exists
            string? parentWalletName = null;
            if (wallet?.ParentWalletId.HasValue == true)
            {
                var parentWallet = await _context.Wallets
                    .IgnoreQueryFilters()
                    .AsNoTracking()
                    .Where(w => w.Id == wallet.ParentWalletId.Value)
                    .Select(w => w.Name)
                    .FirstOrDefaultAsync(cancellationToken);
                parentWalletName = parentWallet;
            }

            // Fetch partner name (including soft-deleted)
            string? partnerName = null;
            if (rawData.PartnerId.HasValue)
            {
                var partner = await _context.DebtPartners
                    .IgnoreQueryFilters()
                    .AsNoTracking()
                    .Where(p => p.Id == rawData.PartnerId.Value)
                    .Select(p => p.Name)
                    .FirstOrDefaultAsync(cancellationToken);
                partnerName = partner;
            }

            // Build DTO
            var transaction = new TransactionDto
            {
                Id = rawData.Id,
                WalletId = rawData.WalletId,
                WalletName = wallet?.Name,
                ParentWalletName = parentWalletName,
                PartnerId = rawData.PartnerId,
                PartnerName = partnerName,
                Amount = rawData.Amount,
                Note = rawData.Note,
                TransactionDate = rawData.TransactionDate,
                CreatedAt = rawData.CreatedAt,
                PayerMode = (PayerMode?)rawData.PayerMode,
                TotalAmount = rawData.TotalAmount,
                DebtAmount = rawData.DebtAmount
            };

            // Check for transfer
            var transfer = await _context.Transfers
                .AsNoTracking()
                .Where(tr => tr.UserId == request.UserId
                             && (tr.SourceTransactionId == request.Id || tr.DestinationTransactionId == request.Id))
                .Select(tr => new
                {
                    tr.Id,
                    tr.FromWalletId,
                    tr.ToWalletId,
                    tr.SourceTransactionId,
                    tr.DestinationTransactionId
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (transfer != null)
            {
                var transferWalletIds = new[] { transfer.FromWalletId, transfer.ToWalletId }.ToHashSet();
                // Use IgnoreQueryFilters to include soft-deleted wallets
                var transferWalletNames = await _context.Wallets
                    .IgnoreQueryFilters()
                    .AsNoTracking()
                    .Where(w => transferWalletIds.Contains(w.Id))
                    .Select(w => new { w.Id, w.Name })
                    .ToDictionaryAsync(w => w.Id, w => w.Name, cancellationToken);

                transferWalletNames.TryGetValue(transfer.FromWalletId, out var fromWalletName);
                transferWalletNames.TryGetValue(transfer.ToWalletId, out var toWalletName);

                transaction.TransferId = transfer.Id;
                transaction.TransferFromWalletId = transfer.FromWalletId;
                transaction.TransferToWalletId = transfer.ToWalletId;
                transaction.TransferFromWalletName = fromWalletName;
                transaction.TransferToWalletName = toWalletName;
                transaction.TransferDirection = transfer.SourceTransactionId == request.Id
                    ? TransferDirection.Outgoing
                    : TransferDirection.Incoming;
            }

            transaction.IsLocked = MonthLockPolicy.IsLocked(transaction.TransactionDate, nowUtc);

            return transaction;
        }
    }
}
