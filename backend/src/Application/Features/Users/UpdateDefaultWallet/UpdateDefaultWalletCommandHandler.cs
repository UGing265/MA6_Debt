using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.UpdateDefaultWallet
{
    public class UpdateDefaultWalletCommandHandler : IRequestHandler<UpdateDefaultWalletCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDefaultWalletCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateDefaultWalletCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException("User", request.UserId);
            }

            // If setting a wallet, verify it exists and belongs to user
            if (request.WalletId.HasValue)
            {
                var walletExists = await _context.Wallets
                    .AnyAsync(w => w.Id == request.WalletId.Value && w.UserId == request.UserId, cancellationToken);

                if (!walletExists)
                {
                    throw new NotFoundException("Wallet", request.WalletId.Value);
                }
            }

            user.DefaultWalletId = request.WalletId;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
