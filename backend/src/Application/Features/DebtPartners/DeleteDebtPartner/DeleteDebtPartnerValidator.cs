using FluentValidation;

namespace Application.Features.DebtPartners.DeleteDebtPartner
{
    public class DeleteDebtPartnerValidator : AbstractValidator<DeleteDebtPartnerCommand>
    {
        public DeleteDebtPartnerValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
