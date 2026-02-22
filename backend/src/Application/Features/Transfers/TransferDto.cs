// DTO representing a Transfer in the application layer
// Mirrors the Transfer entity with audit trail references
// and timestamps suitable for client consumption.
namespace Application.Features.Transfers
{
    public class TransferDto
    {
        public Guid Id { get; set; }
        public Guid FromWalletId { get; set; }
        public Guid ToWalletId { get; set; }
        public decimal Amount { get; set; }

        // Audit trail references to link to underlying transactions
        public Guid? SourceTransactionId { get; set; }
        public Guid? DestinationTransactionId { get; set; }

        // Optional timestamp for when the transfer was created
        public DateTime? CreatedAt { get; set; }
    }
}
