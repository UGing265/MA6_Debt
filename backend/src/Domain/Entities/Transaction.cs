namespace Domain.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid WalletId { get; set; }
        public Wallet Wallet { get; set; } = null!;

        public Guid? PartnerId { get; set; }
        public DebtPartner? Partner { get; set; }

        public decimal Amount { get; set; } // Negative: Expense, Positive: Income

        public string? Note { get; set; }

        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
