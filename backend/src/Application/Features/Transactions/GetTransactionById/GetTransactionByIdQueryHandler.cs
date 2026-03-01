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

            var transaction = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.Id == request.Id && t.Wallet.UserId == request.UserId)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    WalletId = t.WalletId,
                    WalletName = t.WalletName ?? t.Wallet.Name,
                    ParentWalletName = t.Wallet.ParentWallet != null ? t.Wallet.ParentWallet.Name : null,
                    PartnerId = t.PartnerId,
                    PartnerName = t.PartnerName ?? (t.Partner != null ? t.Partner.Name : null),
                    Amount = t.Amount,
                    Note = t.Note,
                    TransactionDate = t.TransactionDate,
                    CreatedAt = t.CreatedAt,
                    PayerMode = (PayerMode?)t.PayerMode,
                    TotalAmount = t.TotalAmount,
                    DebtAmount = t.DebtAmount
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (transaction == null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

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
                var transferWalletNames = await _context.Wallets
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
