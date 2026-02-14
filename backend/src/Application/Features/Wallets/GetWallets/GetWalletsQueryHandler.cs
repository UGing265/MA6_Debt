using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Wallets.GetWallets
{
    public class GetWalletsQueryHandler : IRequestHandler<GetWalletsQuery, IReadOnlyList<WalletDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetWalletsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<WalletDto>> Handle(GetWalletsQuery request, CancellationToken cancellationToken)
        {
            var wallets = await _context.Wallets
                .AsNoTracking()
                .Where(w => w.UserId == request.UserId)
                .Select(w => new WalletDto
                {
                    Id = w.Id,
                    Name = w.Name,
                    Description = w.Description,
                    ParentWalletId = w.ParentWalletId,
                    Balance = w.Transactions.Select(t => (decimal?)t.Amount).Sum() ?? 0m
                })
                .OrderBy(w => w.Name)
                .ToListAsync(cancellationToken);

            return wallets;
        }
    }
}
