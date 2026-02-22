using MediatR;

namespace Application.Features.Wallets.DeleteWallet
{
    public class DeleteWalletCommand : IRequest<Unit>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
    }
}
