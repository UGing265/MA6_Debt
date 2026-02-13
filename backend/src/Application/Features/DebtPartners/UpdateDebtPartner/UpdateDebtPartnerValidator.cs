using FluentValidation;

namespace Application.Features.DebtPartners.UpdateDebtPartner
{
    public class UpdateDebtPartnerValidator : AbstractValidator<UpdateDebtPartnerCommand>
    {
        public UpdateDebtPartnerValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Type is required")
                .Must(t => t == "Receivable" || t == "Payable")
                .WithMessage("Type must be either 'Receivable' or 'Payable'");
        }
    }
}
