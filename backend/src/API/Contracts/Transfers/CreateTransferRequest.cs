namespace API.Contracts.Transfers
{
    /// <summary>
    /// API contract for creating an internal transfer between two wallets.
    /// </summary>
    public class CreateTransferRequest
    {
        /// <summary>
        /// Source wallet identifier.
        /// </summary>
        public Guid FromWalletId { get; set; }

        /// <summary>
        /// Destination wallet identifier.
        /// </summary>
        public Guid ToWalletId { get; set; }

        /// <summary>
        /// Amount to transfer.
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Optional audit trail reference to the debit-side transaction.
        /// </summary>
        public Guid? SourceTransactionId { get; set; }

        /// <summary>
        /// Optional audit trail reference to the credit-side transaction.
        /// </summary>
        public Guid? DestinationTransactionId { get; set; }
    }
}
