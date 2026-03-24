using MediatR;

namespace Application.Features.Wallets.GetWallets
{
    public class GetWalletsQuery : IRequest<IReadOnlyList<WalletDto>>
    {
        public Guid UserId { get; set; }
    }
}
