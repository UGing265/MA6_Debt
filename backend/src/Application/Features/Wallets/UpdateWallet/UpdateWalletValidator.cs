using FluentValidation;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Wallets.UpdateWallet
{
    public class UpdateWalletValidator : AbstractValidator<UpdateWalletCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateWalletValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required");

            RuleFor(x => x)
                .MustAsync(ValidateSelfParent)
                .WithMessage("Wallet cannot be its own parent");

            RuleFor(x => x)
                .MustAsync(ValidateParentWalletBelongsToUser)
                .WithMessage("Parent wallet must belong to current user");

            RuleFor(x => x)
                .MustAsync(ValidateNoCircularReference)
                .WithMessage("Parent wallet cannot create a circular reference");
        }

        private async Task<bool> ValidateSelfParent(UpdateWalletCommand command, CancellationToken cancellationToken)
        {
            if (!command.ParentWalletId.HasValue)
            {
                return true;
            }

            return command.ParentWalletId.Value != command.Id;
        }

        private async Task<bool> ValidateParentWalletBelongsToUser(UpdateWalletCommand command, CancellationToken cancellationToken)
        {
            if (!command.ParentWalletId.HasValue)
            {
                return true;
            }

            return await _context.Wallets.AnyAsync(
                w => w.Id == command.ParentWalletId.Value && w.UserId == command.UserId,
                cancellationToken);
        }

        private async Task<bool> ValidateNoCircularReference(UpdateWalletCommand command, CancellationToken cancellationToken)
        {
            if (!command.ParentWalletId.HasValue)
            {
                return true;
            }

            // Check if the proposed parent wallet already has the current wallet as an ancestor
            var parentWallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == command.ParentWalletId.Value, cancellationToken);

            if (parentWallet is null)
            {
                return true;
            }

            // Traverse up the parent chain of the proposed parent to check for circular reference
            var currentWallet = parentWallet;
            var visited = new HashSet<Guid>();

            while (currentWallet?.ParentWalletId.HasValue == true)
            {
                if (currentWallet.ParentWalletId.Value == command.Id)
                {
                    // The proposed parent is a descendant of the current wallet
                    return false;
                }

                if (!visited.Add(currentWallet.ParentWalletId.Value))
                {
                    // Already visited this wallet, prevent infinite loop
                    break;
                }

                currentWallet = await _context.Wallets
                    .FirstOrDefaultAsync(w => w.Id == currentWallet.ParentWalletId.Value, cancellationToken);
            }

            return true;
        }
    }
}
