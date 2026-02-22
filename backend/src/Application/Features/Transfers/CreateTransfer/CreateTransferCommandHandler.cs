using System;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using MediatR;
using Application.Common.Interfaces;

namespace Application.Features.Transfers.CreateTransfer
{
    public class CreateTransferCommandHandler : IRequestHandler<CreateTransferCommand, TransferDto>
    {
        private readonly IApplicationDbContext _context;

        public CreateTransferCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransferDto> Handle(CreateTransferCommand request, CancellationToken cancellationToken)
        {
            // Build the Transfer and associated Transactions in a single SaveChanges transaction
            var now = DateTime.UtcNow;

            var transfer = new Transfer
            {
                UserId = request.UserId,
                FromWalletId = request.FromWalletId,
                ToWalletId = request.ToWalletId,
                Amount = request.Amount,
                TransferDate = now
            };

            var debitTx = new Transaction
            {
                WalletId = request.FromWalletId,
                Amount = -request.Amount,
                TransactionDate = now,
                Note = $"Transfer to wallet {request.ToWalletId}"
            };

            var creditTx = new Transaction
            {
                WalletId = request.ToWalletId,
                Amount = request.Amount,
                TransactionDate = now,
                Note = $"Transfer from wallet {request.FromWalletId}"
            };

            transfer.SourceTransactionId = debitTx.Id;
            transfer.DestinationTransactionId = creditTx.Id;

            _context.Transfers.Add(transfer);
            _context.Transactions.AddRange(debitTx, creditTx);

            // Persist in a single database transaction
            await _context.SaveChangesAsync(cancellationToken);

            // Return DTO with audit trail transaction IDs
            var dto = new TransferDto
            {
                Id = transfer.Id,
                FromWalletId = transfer.FromWalletId,
                ToWalletId = transfer.ToWalletId,
                Amount = transfer.Amount,
                CreatedAt = transfer.CreatedAt,
                SourceTransactionId = transfer.SourceTransactionId,
                DestinationTransactionId = transfer.DestinationTransactionId
            };

            return dto;
        }
    }
}
