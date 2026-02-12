using MediatR;

namespace Application.Features.Wallets.CreateWallet
{
    public class CreateWalletCommand : IRequest<WalletDto>
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ParentWalletId { get; set; }
    }
}
