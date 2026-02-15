using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.QuickDeduct
{
    /// <summary>
    /// Handler for QuickDeductCommand implementing US-03 hybrid debt-tagging logic and US-04 notification.
    /// </summary>
    public class QuickDeductCommandHandler : IRequestHandler<QuickDeductCommand, QuickDeductResponse>
    {
        private readonly IApplicationDbContext _context;

        public QuickDeductCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<QuickDeductResponse> Handle(QuickDeductCommand request, CancellationToken cancellationToken)
        {
            // Resolve wallet ID (use default if not provided)
            var walletId = request.WalletId ?? await GetDefaultWalletId(request.UserId, cancellationToken);
            if (walletId == Guid.Empty)
            {
                throw new NotFoundException("DefaultWallet", "User has no default wallet configured");
            }

            // Resolve partner ID (use default if not provided and debt amount is specified)
            Guid? partnerId = request.PartnerId;
            if (request.DebtAmount.HasValue && request.DebtAmount.Value > 0 && !partnerId.HasValue)
            {
                partnerId = await GetDefaultPartnerId(request.UserId, cancellationToken);
            }

            // Get wallet and verify ownership
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == walletId && w.UserId == request.UserId, cancellationToken);
            
            if (wallet == null)
            {
                throw new NotFoundException("Wallet", walletId);
            }

            // Get partner if specified
            DebtPartner? partner = null;
            decimal partnerBalanceBefore = 0;
            if (partnerId.HasValue)
            {
                partner = await _context.DebtPartners
                    .FirstOrDefaultAsync(dp => dp.Id == partnerId.Value 
                        && dp.UserId == request.UserId 
                        && !dp.IsDeleted, cancellationToken);
                
                if (partner == null)
                {
                    throw new NotFoundException("DebtPartner", partnerId.Value);
                }
                
                partnerBalanceBefore = partner.Balance;
            }

            // Calculate amounts based on payer mode (US-03.3 formulas)
            decimal walletDelta;
            decimal partnerDelta;
            decimal? debtAmount = request.DebtAmount ?? 0;

            switch (request.PayerMode)
            {
                case PayerMode.ToiTra:
                    // User pays: wallet decreases by Total, partner increases by DebtAmount
                    walletDelta = -request.Total;
                    partnerDelta = debtAmount.Value;
                    break;

                case PayerMode.PartnerTra:
                    // Partner pays: wallet unchanged, partner decreases by (Total - DebtAmount)
                    // Where DebtAmount in this case is what user consumed
                    walletDelta = 0;
                    partnerDelta = -(request.Total - debtAmount.Value);
                    break;

                default:
                    throw new InvalidOperationException($"Invalid PayerMode: {request.PayerMode}");
            }

            // Create transaction
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                WalletId = walletId,
                PartnerId = partnerId,
                Amount = walletDelta,
                Note = request.Note,
                TransactionDate = request.TransactionDate ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                // US-03 audit fields
                PayerMode = (int)request.PayerMode,
                TotalAmount = request.Total,
                DebtAmount = request.DebtAmount,
                PartnerBalanceBefore = partnerId.HasValue ? partnerBalanceBefore : null,
                PartnerBalanceAfter = partnerId.HasValue ? partnerBalanceBefore + partnerDelta : null
            };

            _context.Transactions.Add(transaction);

            // Update partner balance if applicable
            decimal partnerBalanceAfter = partnerBalanceBefore;
            if (partner != null && partnerDelta != 0)
            {
                partner.Balance += partnerDelta;
                partnerBalanceAfter = partner.Balance;
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Build response with US-04 debt notification
            var transactionDto = new TransactionDto
            {
                Id = transaction.Id,
                WalletId = transaction.WalletId,
                PartnerId = transaction.PartnerId,
                PartnerName = partner?.Name,
                Amount = transaction.Amount,
                Note = transaction.Note,
                TransactionDate = transaction.TransactionDate,
                CreatedAt = transaction.CreatedAt,
                PayerMode = (PayerMode?)transaction.PayerMode,
                TotalAmount = transaction.TotalAmount,
                DebtAmount = transaction.DebtAmount
            };

            var notification = partner != null 
                ? BuildDebtNotification(partner, partnerBalanceAfter)
                : null;

            return new QuickDeductResponse
            {
                Transaction = transactionDto,
                Notification = notification!
            };
        }

        private async Task<Guid> GetDefaultWalletId(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            
            return user?.DefaultWalletId ?? Guid.Empty;
        }

        private async Task<Guid?> GetDefaultPartnerId(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            
            return user?.DefaultPartnerId;
        }

        private DebtNotification BuildDebtNotification(DebtPartner partner, decimal balance)
        {
            var direction = balance switch
            {
                > 0 => DebtDirection.PartnerOwesUser,
                < 0 => DebtDirection.UserOwesPartner,
                _ => DebtDirection.Settled
            };

            var message = balance switch
            {
                > 0 => $"{partner.Name} đang nợ bạn {balance:N0} đ",
                < 0 => $"Bạn đang nợ {partner.Name} {Math.Abs(balance):N0} đ",
                _ => $"Bạn và {partner.Name} đã hết nợ"
            };

            return new DebtNotification
            {
                PartnerId = partner.Id,
                PartnerName = partner.Name,
                RemainingBalance = balance,
                Message = message,
                Direction = direction
            };
        }
    }
}
