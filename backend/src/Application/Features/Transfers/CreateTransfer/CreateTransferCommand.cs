using System.Text.Json.Serialization;
using MediatR;
using Domain.Entities;

namespace Application.Features.Transfers.CreateTransfer
{
    // CQRS Command to create a new transfer with audit trail
    public class CreateTransferCommand : IRequest<TransferDto>
    {
        [JsonIgnore]
        public Guid UserId { get; set; }

        public Guid FromWalletId { get; set; }
        public Guid ToWalletId { get; set; }
        public decimal Amount { get; set; }

        // Optional: allow pre-linked transactions as audit trail references
        public Guid? SourceTransactionId { get; set; }
        public Guid? DestinationTransactionId { get; set; }
    }
}
