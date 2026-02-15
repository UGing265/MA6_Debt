using MediatR;

namespace Application.Features.Wallets.GetWalletById
{
    public class GetWalletByIdQuery : IRequest<WalletDto>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
    }
}
