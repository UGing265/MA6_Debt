using Application.Features.Transactions;

namespace API.Contracts.Transactions
{
    public class QuickDeductRequest
    {
        /// <summary>
        /// Optional wallet identifier. If omitted, backend resolves user's default wallet.
        /// </summary>
        public Guid? WalletId { get; set; }

        /// <summary>
        /// Optional debt partner identifier for debt-tagging flows.
        /// </summary>
        public Guid? PartnerId { get; set; }

        /// <summary>
        /// Who paid for the bill (`ToiTra` or `PartnerTra`).
        /// </summary>
        public PayerMode PayerMode { get; set; }

        /// <summary>
        /// Total bill amount (must be greater than 0 by validator rules).
        /// </summary>
        public decimal Total { get; set; }

        /// <summary>
        /// Portion of total attributed to partner (must be non-negative and not exceed total by validator rules).
        /// </summary>
        public decimal? DebtAmount { get; set; }

        /// <summary>
        /// Optional quick note for the transaction.
        /// </summary>
        public string? Note { get; set; }

        /// <summary>
        /// Optional transaction date. Uses current server date/time when omitted.
        /// </summary>
        public DateTime? TransactionDate { get; set; }
    }
}
