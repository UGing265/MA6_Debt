using FluentValidation;

namespace Application.Features.Transactions.DeleteTransaction
{
    public class DeleteTransactionValidator : AbstractValidator<DeleteTransactionCommand>
    {
        public DeleteTransactionValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
