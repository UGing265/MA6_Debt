using FluentValidation;

namespace Application.Features.Wallets.CreateWallet
{
    public class CreateWalletValidator : AbstractValidator<CreateWalletCommand>
    {
        public CreateWalletValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required");
        }
    }
}
