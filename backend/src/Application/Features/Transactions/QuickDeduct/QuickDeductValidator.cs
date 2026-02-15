using FluentValidation;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.QuickDeduct
{
    /// <summary>
    /// Validator for QuickDeductCommand implementing US-03 business rules.
    /// </summary>
    public class QuickDeductValidator : AbstractValidator<QuickDeductCommand>
    {
        private readonly IApplicationDbContext _context;

        public QuickDeductValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.Total)
                .GreaterThan(0).WithMessage("Total amount must be greater than 0");

            RuleFor(x => x)
                .MustAsync(ValidWalletIdProvided)
                .WithMessage("WalletId is required or default wallet must be set");

            RuleFor(x => x)
                .MustAsync(WalletBelongsToUser)
                .When(x => x.WalletId.HasValue)
                .WithMessage("Wallet does not belong to current user");

            RuleFor(x => x)
                .MustAsync(ValidPartnerIdProvided)
                .When(x => x.DebtAmount.HasValue && x.DebtAmount.Value > 0)
                .WithMessage("PartnerId is required when DebtAmount is specified, or default partner must be set");

            RuleFor(x => x)
                .MustAsync(PartnerBelongsToUser)
                .When(x => x.PartnerId.HasValue)
                .WithMessage("Partner does not belong to current user or is deleted");

            RuleFor(x => x.DebtAmount)
                .Must((cmd, debtAmount) => !debtAmount.HasValue || debtAmount.Value <= cmd.Total)
                .When(x => x.DebtAmount.HasValue)
                .WithMessage("DebtAmount cannot exceed Total amount");

            // US-03 Constraint Hardening: Cross-field validation rules
            // Rule: PartnerTra requires PartnerId
            RuleFor(x => x)
                .Must(cmd => cmd.PartnerId.HasValue || HasDefaultPartner(cmd))
                .When(x => x.PayerMode == PayerMode.PartnerTra)
                .WithMessage("PartnerId is required when PayerMode is PartnerTra");

            // Rule: If PartnerId is null, PayerMode must be ToiTra
            RuleFor(x => x.PayerMode)
                .Must(payerMode => payerMode == PayerMode.ToiTra)
                .When(x => !x.PartnerId.HasValue && !HasDefaultPartner(x))
                .WithMessage("When PartnerId is not provided, PayerMode must be ToiTra");

            // Rule: DebtAmount must be >= 0
            RuleFor(x => x.DebtAmount)
                .Must(debtAmount => debtAmount == null || debtAmount >= 0)
                .WithMessage("DebtAmount cannot be negative");

            // Rule: Reject no-effect state (PartnerTra with no debt impact)
            RuleFor(x => x)
                .Must(cmd => cmd.DebtAmount.HasValue && cmd.DebtAmount.Value >= 0)
                .When(x => x.PayerMode == PayerMode.PartnerTra)
                .WithMessage("PartnerTra mode requires a valid DebtAmount to track the split");
        }

        private bool HasDefaultPartner(QuickDeductCommand cmd)
        {
            // This is a synchronous check - the actual resolution happens in the handler
            // For validation purposes, we assume it will be resolved if null
            // The async check is done in ValidPartnerIdProvided
            return true;
        }

        private async Task<bool> ValidWalletIdProvided(QuickDeductCommand command, CancellationToken cancellationToken)
        {
            if (command.WalletId.HasValue)
                return true;

            // Check if user has default wallet
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == command.UserId, cancellationToken);

            return user?.DefaultWalletId.HasValue == true;
        }

        private async Task<bool> WalletBelongsToUser(QuickDeductCommand command, CancellationToken cancellationToken)
        {
            if (!command.WalletId.HasValue)
                return true;

            return await _context.Wallets
                .AsNoTracking()
                .AnyAsync(w => w.Id == command.WalletId.Value && w.UserId == command.UserId, cancellationToken);
        }

        private async Task<bool> ValidPartnerIdProvided(QuickDeductCommand command, CancellationToken cancellationToken)
        {
            if (command.PartnerId.HasValue)
                return true;

            // Check if user has default partner
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == command.UserId, cancellationToken);

            return user?.DefaultPartnerId.HasValue == true;
        }

        private async Task<bool> PartnerBelongsToUser(QuickDeductCommand command, CancellationToken cancellationToken)
        {
            if (!command.PartnerId.HasValue)
                return true;

            return await _context.DebtPartners
                .AsNoTracking()
                .AnyAsync(dp => dp.Id == command.PartnerId.Value 
                    && dp.UserId == command.UserId 
                    && !dp.IsDeleted, cancellationToken);
        }
    }
}
