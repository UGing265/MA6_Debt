using Domain.Entities;
using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Wallets.CreateWallet
{
    public class CreateWalletCommandHandler : IRequestHandler<CreateWalletCommand, WalletDto>
    {
        private readonly IApplicationDbContext _context;

        public CreateWalletCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<WalletDto> Handle(CreateWalletCommand request, CancellationToken cancellationToken)
        {
            var wallet = new Wallet
            {
                Name = request.Name,
                Description = request.Description,
                ParentWalletId = request.ParentWalletId,
                UserId = Guid.Empty // TODO: Get from auth context
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync(cancellationToken);

            return new WalletDto
            {
                Id = wallet.Id,
                Name = wallet.Name,
                Description = wallet.Description,
                ParentWalletId = wallet.ParentWalletId
            };
        }
    }
}
