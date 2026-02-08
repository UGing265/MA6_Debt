namespace Domain.Entities
{
    public class Transfer
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid FromWalletId { get; set; }
        public Wallet FromWallet { get; set; } = null!;

        public Guid ToWalletId { get; set; }
        public Wallet ToWallet { get; set; } = null!;

        public decimal Amount { get; set; }

        public DateTime TransferDate { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
