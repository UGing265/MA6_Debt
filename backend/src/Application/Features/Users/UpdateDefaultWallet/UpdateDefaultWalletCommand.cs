using MediatR;

namespace Application.Features.Users.UpdateDefaultWallet
{
    public class UpdateDefaultWalletCommand : IRequest
    {
        public Guid UserId { get; set; }
        public Guid? WalletId { get; set; }
    }
}
