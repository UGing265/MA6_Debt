using FluentValidation;

namespace Application.Features.Transactions.UpdateTransactionNote
{
    public class UpdateTransactionNoteValidator : AbstractValidator<UpdateTransactionNoteCommand>
    {
        public UpdateTransactionNoteValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Note)
                .MaximumLength(255).WithMessage("Note cannot exceed 255 characters");
        }
    }
}
