using FluentValidation;

namespace Application.Features.DebtPartners.CreateDebtPartner
{
    public class CreateDebtPartnerValidator : AbstractValidator<CreateDebtPartnerCommand>
    {
        public CreateDebtPartnerValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Type is required")
                .Must(t => t == "Receivable" || t == "Payable")
                .WithMessage("Type must be either 'Receivable' or 'Payable'");
        }
    }
}
