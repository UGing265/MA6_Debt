namespace Application.Features.Wallets
{
    public class WalletDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ParentWalletId { get; set; }
    }
}
