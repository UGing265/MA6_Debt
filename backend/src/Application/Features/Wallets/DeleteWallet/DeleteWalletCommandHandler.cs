using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Wallets.DeleteWallet
{
    public class DeleteWalletCommandHandler : IRequestHandler<DeleteWalletCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public DeleteWalletCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteWalletCommand request, CancellationToken cancellationToken)
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == request.Id && w.UserId == request.UserId, cancellationToken);

            if (wallet is null)
            {
                throw new NotFoundException("Wallet", request.Id);
            }

            var hasChildren = await _context.Wallets
                .AnyAsync(w => w.ParentWalletId == request.Id && w.UserId == request.UserId, cancellationToken);
            if (hasChildren)
            {
                throw new InvalidOperationException("Cannot delete wallet with sub-wallets");
            }

            var hasTransactions = await _context.Transactions
                .AnyAsync(t => t.WalletId == request.Id, cancellationToken);
            if (hasTransactions)
            {
                throw new InvalidOperationException("Cannot delete wallet with transactions");
            }

            _context.Wallets.Remove(wallet);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
