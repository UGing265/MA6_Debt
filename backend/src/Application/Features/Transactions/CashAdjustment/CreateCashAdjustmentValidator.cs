using FluentValidation;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.CashAdjustment
{
    /// <summary>
    /// Validator for CreateCashAdjustmentCommand.
    /// Enforces: personal-only, note required, no partner/debt fields.
    /// </summary>
    public class CreateCashAdjustmentValidator : AbstractValidator<CreateCashAdjustmentCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateCashAdjustmentValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.WalletId)
                .NotEmpty().WithMessage("WalletId is required");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than 0");

            RuleFor(x => x.Note)
                .NotEmpty().WithMessage("Note is required for audit trail")
                .MinimumLength(3).WithMessage("Note must be at least 3 characters")
                .MaximumLength(255).WithMessage("Note cannot exceed 255 characters");

            RuleFor(x => x)
                .MustAsync(WalletBelongsToUser)
                .WithMessage("Wallet does not belong to current user or is deleted");
        }

        private async Task<bool> WalletBelongsToUser(CreateCashAdjustmentCommand command, CancellationToken cancellationToken)
        {
            return await _context.Wallets
                .AsNoTracking()
                .AnyAsync(w => w.Id == command.WalletId && w.UserId == command.UserId, cancellationToken);
        }
    }
}
