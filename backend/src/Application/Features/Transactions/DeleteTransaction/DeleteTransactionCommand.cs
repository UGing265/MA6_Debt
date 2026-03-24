using MediatR;

namespace Application.Features.Transactions.DeleteTransaction
{
    public class DeleteTransactionCommand : IRequest<Unit>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
    }
}
