using FluentValidation;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Wallets.CreateWallet
{
    public class CreateWalletValidator : AbstractValidator<CreateWalletCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateWalletValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required");

            RuleFor(x => x)
                .MustAsync(ParentWalletBelongsToUser)
                .WithMessage("Parent wallet must belong to current user");
        }

        private async Task<bool> ParentWalletBelongsToUser(CreateWalletCommand command, CancellationToken cancellationToken)
        {
            if (!command.ParentWalletId.HasValue)
            {
                return true;
            }

            return await _context.Wallets.AnyAsync(
                w => w.Id == command.ParentWalletId.Value && w.UserId == command.UserId,
                cancellationToken);
        }
    }
}
