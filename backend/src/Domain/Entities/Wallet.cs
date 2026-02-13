namespace Domain.Entities
{
    public class Wallet
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public Guid? ParentWalletId { get; set; }
        public Wallet? ParentWallet { get; set; }
        public ICollection<Wallet> ChildWallets { get; set; } = new List<Wallet>();

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<Transfer> SentTransfers { get; set; } = new List<Transfer>();
        public ICollection<Transfer> ReceivedTransfers { get; set; } = new List<Transfer>();
    }
}
