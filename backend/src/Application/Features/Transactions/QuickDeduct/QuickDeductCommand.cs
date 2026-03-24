using MediatR;
using System.Text.Json.Serialization;

namespace Application.Features.Transactions.QuickDeduct
{
    /// <summary>
    /// Command to create a quick deduct transaction with hybrid debt-tagging.
    /// Implements US-03 Quick Deduct and US-04 Debt Notification.
    /// </summary>
    public class QuickDeductCommand : IRequest<QuickDeductResponse>
    {
        /// <summary>
        /// User ID (set from JWT claim).
        /// </summary>
        [JsonIgnore]
        public Guid UserId { get; set; }
        
        /// <summary>
        /// Wallet ID to deduct from. Uses User.DefaultWalletId if not provided.
        /// </summary>
        public Guid? WalletId { get; set; }
        
        /// <summary>
        /// Partner ID for debt tagging. Optional.
        /// Uses User.DefaultPartnerId if not provided.
        /// </summary>
        public Guid? PartnerId { get; set; }
        
        /// <summary>
        /// Payer mode: ToiTra (user pays) or PartnerTra (partner pays).
        /// </summary>
        public PayerMode PayerMode { get; set; }
        
        /// <summary>
        /// Total bill amount (always positive).
        /// </summary>
        public decimal Total { get; set; }
        
        /// <summary>
        /// Amount partner consumed (for ToiTra) or amount user consumed (for PartnerTra).
        /// Must be less than or equal to Total.
        /// </summary>
        public decimal? DebtAmount { get; set; }
        
        /// <summary>
        /// Optional note/description.
        /// </summary>
        public string? Note { get; set; }
        
        /// <summary>
        /// Optional transaction date (defaults to UtcNow).
        /// </summary>
        public DateTime? TransactionDate { get; set; }
    }
}
