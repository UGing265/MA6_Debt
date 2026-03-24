using FluentValidation;

namespace Application.Features.Transactions.UpdateTransaction
{
    public class UpdateTransactionValidator : AbstractValidator<UpdateTransactionCommand>
    {
        public UpdateTransactionValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Total)
                .GreaterThan(0).WithMessage("Total must be greater than 0");

            RuleFor(x => x.DebtAmount)
                .Must((cmd, debtAmount) => !debtAmount.HasValue || debtAmount.Value >= 0)
                .WithMessage("DebtAmount cannot be negative");

            RuleFor(x => x.DebtAmount)
                .Must((cmd, debtAmount) => !debtAmount.HasValue || debtAmount.Value <= cmd.Total)
                .WithMessage("DebtAmount cannot exceed Total amount");

            RuleFor(x => x.PayerMode)
                .IsInEnum().WithMessage("PayerMode must be ToiTra or PartnerTra");

            RuleFor(x => x.Note)
                .MaximumLength(255).WithMessage("Note cannot exceed 255 characters");
        }
    }
}
