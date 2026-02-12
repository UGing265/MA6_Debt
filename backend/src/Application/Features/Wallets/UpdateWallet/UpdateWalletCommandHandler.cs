using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Wallets.UpdateWallet
{
    public class UpdateWalletCommandHandler : IRequestHandler<UpdateWalletCommand, WalletDto>
    {
        private readonly IApplicationDbContext _context;

        public UpdateWalletCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<WalletDto> Handle(UpdateWalletCommand request, CancellationToken cancellationToken)
        {
            var wallet = await _context.Wallets.FindAsync(new object[] { request.Id }, cancellationToken);
            if (wallet is null)
            {
                throw new NotFoundException("Wallet", request.Id);
            }

            wallet.Name = request.Name;
            wallet.Description = request.Description;

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

namespace Application.Common.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string name, object key)
            : base($"{name} ({key}) was not found.")
        {
        }
    }
}
