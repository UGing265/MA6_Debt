using FluentValidation;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transfers.CreateTransfer
{
    public class CreateTransferValidator : AbstractValidator<CreateTransferCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateTransferValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required");

            RuleFor(x => x.FromWalletId)
                .NotEmpty().WithMessage("FromWalletId is required");

            RuleFor(x => x.ToWalletId)
                .NotEmpty().WithMessage("ToWalletId is required");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero");

            RuleFor(x => x.ToWalletId)
                .NotEqual(x => x.FromWalletId)
                .WithMessage("FromWalletId and ToWalletId must be different");

            When(x => x.UserId != Guid.Empty && x.FromWalletId != Guid.Empty && x.ToWalletId != Guid.Empty, () =>
            {
                RuleFor(x => x)
                    .CustomAsync(EnsureWalletsExistForUser);
            });

            When(x => x.UserId != Guid.Empty && x.FromWalletId != Guid.Empty && x.ToWalletId != Guid.Empty && x.FromWalletId != x.ToWalletId, () =>
            {
                RuleFor(x => x.Amount)
                    .MustAsync(SourceWalletHasSufficientBalance)
                    .WithMessage("Insufficient balance in source wallet")
                    .When(x => x.Amount > 0);
            });

            RuleFor(x => x.SourceTransactionId)
                .MustAsync(SourceTransactionBelongsToFromWallet)
                .WithMessage("SourceTransactionId must belong to the FromWallet");

            RuleFor(x => x.DestinationTransactionId)
                .MustAsync(DestinationTransactionBelongsToToWallet)
                .WithMessage("DestinationTransactionId must belong to the ToWallet");
        }

        private async Task EnsureWalletsExistForUser(CreateTransferCommand cmd, ValidationContext<CreateTransferCommand> context, CancellationToken cancellationToken)
        {
            var walletIds = new[] { cmd.FromWalletId, cmd.ToWalletId };

            var existingWalletIds = await _context.Wallets
                .Where(w => walletIds.Contains(w.Id) && w.UserId == cmd.UserId)
                .Select(w => w.Id)
                .ToListAsync(cancellationToken);

            if (!existingWalletIds.Contains(cmd.FromWalletId))
            {
                throw new NotFoundException("Wallet", cmd.FromWalletId);
            }

            if (!existingWalletIds.Contains(cmd.ToWalletId))
            {
                throw new NotFoundException("Wallet", cmd.ToWalletId);
            }
        }

        private async Task EnsureWalletsShareSameParent(CreateTransferCommand cmd, ValidationContext<CreateTransferCommand> context, CancellationToken cancellationToken)
        {
            var wallets = await _context.Wallets
                .Where(w => (w.Id == cmd.FromWalletId || w.Id == cmd.ToWalletId) && w.UserId == cmd.UserId)
                .Select(w => new { w.Id, w.ParentWalletId })
                .ToListAsync(cancellationToken);

            if (!wallets.Any(w => w.Id == cmd.FromWalletId))
            {
                throw new NotFoundException("Wallet", cmd.FromWalletId);
            }

            if (!wallets.Any(w => w.Id == cmd.ToWalletId))
            {
                throw new NotFoundException("Wallet", cmd.ToWalletId);
            }

            var fromParentWalletId = wallets.First(w => w.Id == cmd.FromWalletId).ParentWalletId;
            var toParentWalletId = wallets.First(w => w.Id == cmd.ToWalletId).ParentWalletId;

            if (fromParentWalletId != toParentWalletId)
            {
                context.AddFailure(nameof(CreateTransferCommand.ToWalletId), "Both wallets must share the same parent wallet");
            }
        }

        private async Task<bool> SourceWalletHasSufficientBalance(CreateTransferCommand cmd, decimal amount, CancellationToken cancellationToken)
        {
            var sourceWalletExists = await _context.Wallets.AnyAsync(
                w => w.Id == cmd.FromWalletId && w.UserId == cmd.UserId,
                cancellationToken);

            if (!sourceWalletExists)
            {
                throw new NotFoundException("Wallet", cmd.FromWalletId);
            }

            var sourceBalance = await _context.Transactions
                .Where(t => t.WalletId == cmd.FromWalletId)
                .Select(t => (decimal?)t.Amount)
                .SumAsync(cancellationToken) ?? 0m;

            return sourceBalance >= amount;
        }

        private async Task<bool> SourceTransactionBelongsToFromWallet(CreateTransferCommand cmd, Guid? sourceTransactionId, CancellationToken cancellationToken)
        {
            if (!sourceTransactionId.HasValue) return true;
            if (cmd.FromWalletId == Guid.Empty) return true;

            return await _context.Transactions.AnyAsync(
                t => t.Id == sourceTransactionId.Value && t.WalletId == cmd.FromWalletId,
                cancellationToken);
        }

        private async Task<bool> DestinationTransactionBelongsToToWallet(CreateTransferCommand cmd, Guid? destinationTransactionId, CancellationToken cancellationToken)
        {
            if (!destinationTransactionId.HasValue) return true;
            if (cmd.ToWalletId == Guid.Empty) return true;

            return await _context.Transactions.AnyAsync(
                t => t.Id == destinationTransactionId.Value && t.WalletId == cmd.ToWalletId,
                cancellationToken);
        }
    }
}
