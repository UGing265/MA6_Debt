using MediatR;

namespace Application.Features.Transfers.GetTransferById
{
    /// <summary>
    /// Query to get a specific transfer by ID.
    /// </summary>
    public class GetTransferByIdQuery : IRequest<TransferDto>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }
}
