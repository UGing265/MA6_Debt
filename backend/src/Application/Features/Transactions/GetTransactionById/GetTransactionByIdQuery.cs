using MediatR;

namespace Application.Features.Transactions.GetTransactionById
{
    /// <summary>
    /// Query to get a specific transaction by ID.
    /// </summary>
    public class GetTransactionByIdQuery : IRequest<TransactionDto>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }
}
