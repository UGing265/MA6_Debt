using Application.Features.Transactions.CashAdjustment;

namespace API.Contracts.Transactions
{
    public class CashAdjustmentRequest
    {
        /// <summary>
        /// Wallet that receives the adjustment transaction.
        /// </summary>
        public Guid WalletId { get; set; }

        /// <summary>
        /// Adjustment direction (`Increase` or `Decrease`).
        /// </summary>
        public AdjustmentDirection Direction { get; set; }

        /// <summary>
        /// Absolute adjustment amount.
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Required note for audit trail.
        /// </summary>
        public string Note { get; set; } = string.Empty;

        /// <summary>
        /// Optional transaction date. Uses current server date/time when omitted.
        /// </summary>
        public DateTime? TransactionDate { get; set; }
    }
}
