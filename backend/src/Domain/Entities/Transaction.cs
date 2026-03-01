namespace Domain.Entities
{
    /// <summary>
    /// Transaction entity supporting US-03 Quick Deduct with hybrid debt-tagging.
    /// </summary>
    public class Transaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid WalletId { get; set; }
        public Wallet Wallet { get; set; } = null!;

        public Guid? PartnerId { get; set; }
        public DebtPartner? Partner { get; set; }

        /// <summary>
        /// Final signed amount applied to wallet.
        /// Negative: Expense (deduction from wallet).
        /// Positive: Income (rare for US-03, which focuses on expenses).
        /// </summary>
        public decimal Amount { get; set; }

        public string? Note { get; set; }

        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // US-03 specific fields for auditability and reconstructing debt impact

        /// <summary>
        /// Payer mode: 0 = ToiTra (user pays), 1 = PartnerTra (partner pays).
        /// Nullable for backward compatibility with existing transactions.
        /// </summary>
        public int? PayerMode { get; set; }

        /// <summary>
        /// Original total bill amount (always positive).
        /// Used to reconstruct how Amount was calculated.
        /// </summary>
        public decimal? TotalAmount { get; set; }

        /// <summary>
        /// Amount partner consumed (ToiTra) or amount user consumed (PartnerTra).
        /// This is the "debt" portion that affects partner balance.
        /// </summary>
        public decimal? DebtAmount { get; set; }

        /// <summary>
        /// Partner balance before this transaction was applied.
        /// Enables audit trail for debt calculations.
        /// </summary>
        public decimal? PartnerBalanceBefore { get; set; }

        /// <summary>
        /// Partner balance after this transaction was applied.
        /// Enables verification of US-04 notification accuracy.
        /// </summary>
        public decimal? PartnerBalanceAfter { get; set; }
    }
}
