using MediatR;

namespace Application.Features.Transactions.CashAdjustment
{
    /// <summary>
    /// Command to create a cash adjustment transaction (add/subtract wallet balance).
    /// Personal-only flow: no partner, no debt tagging, reason required.
    /// </summary>
    public class CreateCashAdjustmentCommand : IRequest<TransactionDto>
    {
        /// <summary>
        /// User ID (set from JWT claim).
        /// </summary>
        public Guid UserId { get; set; }
        
        /// <summary>
        /// Wallet ID to adjust. Required.
        /// </summary>
        public Guid WalletId { get; set; }
        
        /// <summary>
        /// Adjustment direction: credit (add money) or debit (subtract money).
        /// </summary>
        public AdjustmentDirection Direction { get; set; }
        
        /// <summary>
        /// Adjustment amount (always positive).
        /// </summary>
        public decimal Amount { get; set; }
        
        /// <summary>
        /// Required reason/description for audit trail.
        /// </summary>
        public string Reason { get; set; } = string.Empty;
        
        /// <summary>
        /// Optional transaction date (defaults to UtcNow).
        /// </summary>
        public DateTime? TransactionDate { get; set; }
    }
    
    /// <summary>
    /// Direction for cash adjustment.
    /// </summary>
    public enum AdjustmentDirection
    {
        /// <summary>
        /// Add money to wallet (positive amount).
        /// </summary>
        Credit = 0,
        
        /// <summary>
        /// Subtract money from wallet (negative amount).
        /// </summary>
        Debit = 1
    }
}
