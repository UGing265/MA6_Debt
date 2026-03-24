using Domain.Entities;
using MediatR;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

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
            if (request.ParentWalletId.HasValue)
            {
                var parentExists = await _context.Wallets.AnyAsync(
                    w => w.Id == request.ParentWalletId.Value && w.UserId == request.UserId,
                    cancellationToken);

                if (!parentExists)
                {
                    throw new InvalidOperationException("Parent wallet not found for current user");
                }
            }

            var wallet = new Wallet
            {
                Name = request.Name,
                Description = request.Description,
                ParentWalletId = request.ParentWalletId,
                UserId = request.UserId
            };

            _context.Wallets.Add(wallet);
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
