using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.CashAdjustment
{
    /// <summary>
    /// Handler for CreateCashAdjustmentCommand.
    /// Creates personal-only adjustment transaction without partner/debt.
    /// </summary>
    public class CreateCashAdjustmentCommandHandler : IRequestHandler<CreateCashAdjustmentCommand, TransactionDto>
    {
        private readonly IApplicationDbContext _context;

        public CreateCashAdjustmentCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransactionDto> Handle(CreateCashAdjustmentCommand request, CancellationToken cancellationToken)
        {
            // Verify wallet ownership
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == request.WalletId && w.UserId == request.UserId, cancellationToken);
            
            if (wallet == null)
            {
                throw new NotFoundException("Wallet", request.WalletId);
            }

            // Anti-bypass: Ensure no partner/debt fields are present
            // This is a personal-only adjustment flow
            if (request.Amount <= 0)
            {
                throw new InvalidOperationException("Amount must be positive. Use Direction to specify credit/debit.");
            }

            // Calculate signed amount based on direction
            decimal signedAmount = request.Direction switch
            {
                AdjustmentDirection.Credit => request.Amount,   // Add money: positive
                AdjustmentDirection.Debit => -request.Amount,   // Subtract money: negative
                _ => throw new InvalidOperationException($"Invalid adjustment direction: {request.Direction}")
            };

            // Create transaction
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                WalletId = request.WalletId,
                PartnerId = null, // Personal-only: no partner
                Amount = signedAmount,
                Note = request.Note,
                TransactionDate = request.TransactionDate ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                // Cash adjustment fields (no US-03 specific fields)
                PayerMode = null,
                TotalAmount = null,
                DebtAmount = null,
                PartnerBalanceBefore = null,
                PartnerBalanceAfter = null
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            // Return transaction DTO
            return new TransactionDto
            {
                Id = transaction.Id,
                WalletId = transaction.WalletId,
                PartnerId = null,
                PartnerName = null,
                Amount = transaction.Amount,
                Note = transaction.Note,
                TransactionDate = transaction.TransactionDate,
                CreatedAt = transaction.CreatedAt,
                PayerMode = null,
                TotalAmount = null,
                DebtAmount = null
            };
        }
    }
}
