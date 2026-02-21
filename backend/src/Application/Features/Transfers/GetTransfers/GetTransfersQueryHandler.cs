using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transfers.GetTransfers
{
    /// <summary>
    /// Handler for GetTransfersQuery returning user-scoped transfer history with filters.
    /// </summary>
    public class GetTransfersQueryHandler : IRequestHandler<GetTransfersQuery, IReadOnlyList<TransferDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetTransfersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<TransferDto>> Handle(GetTransfersQuery request, CancellationToken cancellationToken)
        {
            // Base query scoped to the current user
            var query = _context.Transfers
                .AsNoTracking()
                .Where(t => t.UserId == request.UserId);

            // Wallet filter: either FromWallet or ToWallet matches
            if (request.WalletId.HasValue)
            {
                query = query.Where(t => t.FromWalletId == request.WalletId.Value
                                        || t.ToWalletId == request.WalletId.Value);
            }

            // Date range filtering
            if (request.StartDate.HasValue)
            {
                query = query.Where(t => t.TransferDate >= request.StartDate.Value);
            }
            if (request.EndDate.HasValue)
            {
                query = query.Where(t => t.TransferDate <= request.EndDate.Value);
            }

            // Pagination defaults
            var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
            var pageSize = request.PageSize < 1 ? 20 : request.PageSize;

            var transfers = await query
                .OrderByDescending(t => t.TransferDate)
                .ThenByDescending(t => t.CreatedAt)
                .Select(t => new TransferDto
                {
                    Id = t.Id,
                    FromWalletId = t.FromWalletId,
                    ToWalletId = t.ToWalletId,
                    Amount = t.Amount,
                    CreatedAt = t.CreatedAt,
                    SourceTransactionId = t.SourceTransactionId,
                    DestinationTransactionId = t.DestinationTransactionId
                })
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return transfers;
        }
    }
}
