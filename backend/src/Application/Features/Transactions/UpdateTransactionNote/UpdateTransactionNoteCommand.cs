using MediatR;
using Application.Features.Transactions;
using System.Text.Json.Serialization;

namespace Application.Features.Transactions.UpdateTransactionNote
{
    public class UpdateTransactionNoteCommand : IRequest<TransactionDto>
    {
        [JsonIgnore]
        public Guid UserId { get; set; }

        public Guid Id { get; set; }

        public string? Note { get; set; }
    }
}
