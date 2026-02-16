using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Locking;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.DeleteTransaction
{
    public class DeleteTransactionCommandHandler : IRequestHandler<DeleteTransactionCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public DeleteTransactionCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == request.Id && t.Wallet.UserId == request.UserId, cancellationToken);

            if (transaction is null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

            var nowUtc = DateTimeOffset.UtcNow;
            if (MonthLockPolicy.IsLocked(transaction.TransactionDate, nowUtc))
            {
                throw new InvalidOperationException("Cannot delete a locked transaction");
            }

            if (transaction.PartnerId.HasValue)
            {
                var originalPartnerDelta = DeriveOriginalPartnerDelta(transaction);

                var partner = await _context.DebtPartners
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(dp => dp.Id == transaction.PartnerId.Value && dp.UserId == request.UserId, cancellationToken);

                if (partner is null)
                {
                    throw new InvalidOperationException("Cannot rollback partner balance: partner not found");
                }

                if (originalPartnerDelta != 0)
                {
                    partner.Balance -= originalPartnerDelta;
                }
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }

        private static decimal DeriveOriginalPartnerDelta(Transaction transaction)
        {
            if (transaction.PartnerBalanceAfter.HasValue && transaction.PartnerBalanceBefore.HasValue)
            {
                return transaction.PartnerBalanceAfter.Value - transaction.PartnerBalanceBefore.Value;
            }

            if (!transaction.PayerMode.HasValue || !transaction.TotalAmount.HasValue)
            {
                throw new InvalidOperationException("Cannot rollback partner balance: original partner delta is not derivable");
            }

            var payerMode = (Application.Features.Transactions.PayerMode)transaction.PayerMode.Value;
            var total = transaction.TotalAmount.Value;

            if (total < 0)
            {
                throw new InvalidOperationException("Cannot rollback partner balance: total amount is invalid");
            }

            switch (payerMode)
            {
                case Application.Features.Transactions.PayerMode.ToiTra:
                    return transaction.DebtAmount ?? 0m;

                case Application.Features.Transactions.PayerMode.PartnerTra:
                    if (!transaction.DebtAmount.HasValue)
                    {
                        throw new InvalidOperationException("Cannot rollback partner balance: debt amount is missing");
                    }

                    return -(total - transaction.DebtAmount.Value);

                default:
                    throw new InvalidOperationException($"Cannot rollback partner balance: invalid payer mode '{transaction.PayerMode}'");
            }
        }
    }
}
