using System;
using System.Text.Json.Serialization;
using MediatR;

namespace Application.Features.Transactions.UpdateTransaction
{
    public class UpdateTransactionCommand : IRequest<TransactionDto>
    {
        public Guid Id { get; set; }

        [JsonIgnore]
        public Guid UserId { get; set; }

        public PayerMode PayerMode { get; set; }

        public decimal Total { get; set; }

        public decimal? DebtAmount { get; set; }

        public string? Note { get; set; }

        public DateTime? TransactionDate { get; set; }
    }
}
