namespace Domain.Entities
{
    public class DebtPartner
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public string Name { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
