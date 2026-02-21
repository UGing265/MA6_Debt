using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transfers.GetTransferById
{
    /// <summary>
    /// Handler for GetTransferByIdQuery returning a user-scoped single transfer.
    /// </summary>
    public class GetTransferByIdQueryHandler : IRequestHandler<GetTransferByIdQuery, TransferDto>
    {
        private readonly IApplicationDbContext _context;

        public GetTransferByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransferDto> Handle(GetTransferByIdQuery request, CancellationToken cancellationToken)
        {
            var transfer = await _context.Transfers
                .AsNoTracking()
                .Where(t => t.Id == request.Id && t.UserId == request.UserId)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (transfer == null)
            {
                throw new NotFoundException("Transfer", request.Id);
            }

            return transfer;
        }
    }
}
