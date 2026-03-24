using FluentValidation;

namespace Application.Features.Wallets.DeleteWallet
{
    public class DeleteWalletValidator : AbstractValidator<DeleteWalletCommand>
    {
        public DeleteWalletValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
