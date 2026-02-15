using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Wallets.GetWalletById
{
    public class GetWalletByIdQueryHandler : IRequestHandler<GetWalletByIdQuery, WalletDto>
    {
        private readonly IApplicationDbContext _context;

        public GetWalletByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<WalletDto> Handle(GetWalletByIdQuery request, CancellationToken cancellationToken)
        {
            var wallet = await _context.Wallets
                .AsNoTracking()
                .Where(w => w.Id == request.Id && w.UserId == request.UserId)
                .Select(w => new WalletDto
                {
                    Id = w.Id,
                    Name = w.Name,
                    Description = w.Description,
                    ParentWalletId = w.ParentWalletId,
                    Balance = w.Transactions.Select(t => (decimal?)t.Amount).Sum() ?? 0m
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (wallet is null)
            {
                throw new NotFoundException("Wallet", request.Id);
            }

            return wallet;
        }
    }
}
