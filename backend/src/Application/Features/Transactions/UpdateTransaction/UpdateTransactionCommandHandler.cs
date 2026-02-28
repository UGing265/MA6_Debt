using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Locking;
using Application.Features.Transactions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.UpdateTransaction
{
    public class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand, TransactionDto>
    {
        private readonly IApplicationDbContext _context;

        public UpdateTransactionCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransactionDto> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
        {
            var nowUtc = DateTimeOffset.UtcNow;

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == request.Id && t.Wallet.UserId == request.UserId, cancellationToken);

            if (transaction is null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

            if (MonthLockPolicy.IsLocked(transaction.TransactionDate, nowUtc))
            {
                throw new InvalidOperationException("Transaction is locked and cannot be edited.");
            }

            var originalPayerMode = transaction.PayerMode;
            var originalTotalAmount = transaction.TotalAmount;
            var originalDebtAmount = transaction.DebtAmount;
            var originalPartnerBalanceBefore = transaction.PartnerBalanceBefore;
            var originalPartnerBalanceAfter = transaction.PartnerBalanceAfter;
            var originalPartnerId = transaction.PartnerId;

            // Determine the effective partner ID (new or existing)
            var effectivePartnerId = request.PartnerId ?? transaction.PartnerId;
            var isAddingNewPartner = !transaction.PartnerId.HasValue && request.PartnerId.HasValue;
            var isRemovingPartner = transaction.PartnerId.HasValue && !request.PartnerId.HasValue;

            // Handle removing partner (clear debt info)
            if (isRemovingPartner && originalPartnerId.HasValue)
            {
                // Rollback original partner balance
                var originalPartnerDelta = DeriveOriginalPartnerDelta(
                    payerMode: originalPayerMode,
                    totalAmount: originalTotalAmount,
                    debtAmount: originalDebtAmount,
                    partnerBalanceBefore: originalPartnerBalanceBefore,
                    partnerBalanceAfter: originalPartnerBalanceAfter);

                var originalPartner = await _context.DebtPartners
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(dp => dp.Id == originalPartnerId.Value && dp.UserId == request.UserId, cancellationToken);

                if (originalPartner is not null && originalPartnerDelta != 0m)
                {
                    originalPartner.Balance -= originalPartnerDelta;
                }

                transaction.PartnerId = null;
                transaction.PartnerBalanceBefore = null;
                transaction.PartnerBalanceAfter = null;
                transaction.DebtAmount = null;
            }
            // Handle adding new partner or updating existing partner debt
            else if (effectivePartnerId.HasValue)
            {
                var shouldRecomputePartnerBalance = isAddingNewPartner
                    || (originalPartnerId.HasValue &&
                        (originalPayerMode != (int)request.PayerMode
                         || originalTotalAmount != request.Total
                         || originalDebtAmount != request.DebtAmount));

                if (shouldRecomputePartnerBalance)
                {
                    // Rollback original partner balance if exists
                    if (originalPartnerId.HasValue && !isAddingNewPartner)
                    {
                        var originalPartnerDelta = DeriveOriginalPartnerDelta(
                            payerMode: originalPayerMode,
                            totalAmount: originalTotalAmount,
                            debtAmount: originalDebtAmount,
                            partnerBalanceBefore: originalPartnerBalanceBefore,
                            partnerBalanceAfter: originalPartnerBalanceAfter);

                        var originalPartner = await _context.DebtPartners
                            .IgnoreQueryFilters()
                            .FirstOrDefaultAsync(dp => dp.Id == originalPartnerId.Value && dp.UserId == request.UserId, cancellationToken);

                        if (originalPartner is not null && originalPartnerDelta != 0m)
                        {
                            originalPartner.Balance -= originalPartnerDelta;
                        }
                    }

                    // Get the effective partner (new or existing)
                    var partner = await _context.DebtPartners
                        .IgnoreQueryFilters()
                        .FirstOrDefaultAsync(dp => dp.Id == effectivePartnerId.Value && dp.UserId == request.UserId, cancellationToken);

                    if (partner is null)
                    {
                        throw new NotFoundException("DebtPartner", effectivePartnerId.Value);
                    }

                    var newPartnerDelta = ComputePartnerDelta(request.PayerMode, request.Total, request.DebtAmount);
                    var partnerBalanceBefore = partner.Balance;

                    transaction.PartnerId = effectivePartnerId;
                    transaction.PartnerBalanceBefore = partnerBalanceBefore;
                    transaction.PartnerBalanceAfter = partnerBalanceBefore + newPartnerDelta;

                    if (newPartnerDelta != 0m)
                    {
                        partner.Balance += newPartnerDelta;
                    }
                }
            }

            transaction.PayerMode = (int)request.PayerMode;
            transaction.TotalAmount = request.Total;
            transaction.DebtAmount = request.DebtAmount;
            transaction.Amount = ComputeWalletDelta(request.PayerMode, request.Total);

            var trimmedNote = request.Note?.Trim();
            transaction.Note = string.IsNullOrEmpty(trimmedNote) ? null : trimmedNote;

            if (request.TransactionDate.HasValue)
            {
                transaction.TransactionDate = request.TransactionDate.Value;
            }

            if (!effectivePartnerId.HasValue && !isRemovingPartner)
            {
                transaction.PartnerBalanceBefore = null;
                transaction.PartnerBalanceAfter = null;
            }
            await _context.SaveChangesAsync(cancellationToken);

            var dto = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.Id == request.Id && t.Wallet.UserId == request.UserId)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (dto is null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

            dto.IsLocked = MonthLockPolicy.IsLocked(dto.TransactionDate, nowUtc);
            return dto;
        }

        private static decimal ComputeWalletDelta(PayerMode payerMode, decimal total)
        {
            return payerMode switch
            {
                PayerMode.ToiTra => -total,
                PayerMode.PartnerTra => 0m,
                _ => throw new InvalidOperationException($"Invalid PayerMode: {payerMode}")
            };
        }

        private static decimal ComputePartnerDelta(PayerMode payerMode, decimal total, decimal? debtAmount)
        {
            switch (payerMode)
            {
                case PayerMode.ToiTra:
                    return debtAmount ?? 0m;

                case PayerMode.PartnerTra:
                    if (!debtAmount.HasValue)
                    {
                        throw new InvalidOperationException("DebtAmount is missing. This should have been caught by validation.");
                    }

                    // DebtAmount = what user consumed, so user owes that to partner
                    return -debtAmount.Value;

                default:
                    throw new InvalidOperationException($"Invalid PayerMode: {payerMode}");
            }
        }

        private static decimal DeriveOriginalPartnerDelta(
            int? payerMode,
            decimal? totalAmount,
            decimal? debtAmount,
            decimal? partnerBalanceBefore,
            decimal? partnerBalanceAfter)
        {
            if (partnerBalanceAfter.HasValue && partnerBalanceBefore.HasValue)
            {
                return partnerBalanceAfter.Value - partnerBalanceBefore.Value;
            }

            if (!payerMode.HasValue || !totalAmount.HasValue)
            {
                throw new InvalidOperationException("Cannot rollback partner balance: original partner delta is not derivable");
            }

            var originalPayerMode = (PayerMode)payerMode.Value;
            var total = totalAmount.Value;

            if (total < 0)
            {
                throw new InvalidOperationException("Cannot rollback partner balance: total amount is invalid");
            }

            switch (originalPayerMode)
            {
                case PayerMode.ToiTra:
                    return debtAmount ?? 0m;

                case PayerMode.PartnerTra:
                    if (!debtAmount.HasValue)
                    {
                        throw new InvalidOperationException("Cannot rollback partner balance: debt amount is missing");
                    }

                    // DebtAmount = what user consumed, so user owed that to partner
                    return -debtAmount.Value;

                default:
                    throw new InvalidOperationException($"Cannot rollback partner balance: invalid payer mode '{payerMode}'");
            }
        }
    }
}
