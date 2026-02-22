using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == request.Id && w.UserId == request.UserId, cancellationToken);

            if (wallet is null)
            {
                throw new NotFoundException("Wallet", request.Id);
            }

            wallet.Name = request.Name;
            wallet.Description = request.Description;
            
            if (request.ParentWalletId.HasValue)
            {
                wallet.ParentWalletId = request.ParentWalletId.Value;
            }
            else
            {
                wallet.ParentWalletId = null;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new WalletDto
            {
                Id = wallet.Id,
                Name = wallet.Name,
                Description = wallet.Description,
                ParentWalletId = wallet.ParentWalletId,
                Balance = 0m
            };
        }
    }
}
