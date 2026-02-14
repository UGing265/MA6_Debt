using FluentValidation;

namespace Application.Features.Wallets.UpdateWallet
{
    public class UpdateWalletValidator : AbstractValidator<UpdateWalletCommand>
    {
        public UpdateWalletValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required");
        }
    }
}
