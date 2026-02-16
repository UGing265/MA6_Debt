using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Locking;
using Application.Features.Transactions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.UpdateTransactionNote
{
    public class UpdateTransactionNoteCommandHandler : IRequestHandler<UpdateTransactionNoteCommand, TransactionDto>
    {
        private readonly IApplicationDbContext _context;

        public UpdateTransactionNoteCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransactionDto> Handle(UpdateTransactionNoteCommand request, CancellationToken cancellationToken)
        {
            var nowUtc = DateTimeOffset.UtcNow;

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == request.Id && t.Wallet.UserId == request.UserId, cancellationToken);

            if (transaction == null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

            if (MonthLockPolicy.IsLocked(transaction.TransactionDate, nowUtc))
            {
                throw new InvalidOperationException("Transaction is locked and cannot be edited.");
            }

            var trimmedNote = request.Note?.Trim();
            transaction.Note = string.IsNullOrEmpty(trimmedNote) ? null : trimmedNote;

            await _context.SaveChangesAsync(cancellationToken);

            var dto = await _context.Transactions
                .AsNoTracking()
                .Where(t => t.Id == request.Id && t.Wallet.UserId == request.UserId)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    WalletId = t.WalletId,
                    PartnerId = t.PartnerId,
                    PartnerName = t.Partner != null ? t.Partner.Name : null,
                    Amount = t.Amount,
                    Note = t.Note,
                    TransactionDate = t.TransactionDate,
                    CreatedAt = t.CreatedAt,
                    PayerMode = (PayerMode?)t.PayerMode,
                    TotalAmount = t.TotalAmount,
                    DebtAmount = t.DebtAmount
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (dto == null)
            {
                throw new NotFoundException("Transaction", request.Id);
            }

            dto.IsLocked = MonthLockPolicy.IsLocked(dto.TransactionDate, nowUtc);
            return dto;
        }
    }
}
