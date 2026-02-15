using MediatR;

namespace Application.Features.Wallets.UpdateWallet
{
    public class UpdateWalletCommand : IRequest<WalletDto>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
