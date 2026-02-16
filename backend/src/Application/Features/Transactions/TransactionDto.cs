namespace Application.Features.Transactions
{
    /// <summary>
    /// Data transfer object for transaction responses.
    /// </summary>
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public Guid WalletId { get; set; }
        public Guid? PartnerId { get; set; }
        public string? PartnerName { get; set; }
        public decimal Amount { get; set; }
        public string? Note { get; set; }
        public DateTime TransactionDate { get; set; }
        public DateTime CreatedAt { get; set; }

        public bool IsLocked { get; set; }
        
        // US-03 specific fields for auditability
        public PayerMode? PayerMode { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? DebtAmount { get; set; }
    }
    
    /// <summary>
    /// Payer mode for hybrid debt-tagging logic (US-03.3).
    /// </summary>
    public enum PayerMode
    {
        /// <summary>
        /// User pays the bill (Toi tra).
        /// Wallet: -Total, Partner: +DebtAmount
        /// </summary>
        ToiTra = 0,
        
        /// <summary>
        /// Partner pays the bill (Partner tra).
        /// Wallet: 0, Partner: -(Total - DebtAmount)
        /// </summary>
        PartnerTra = 1
    }
}
