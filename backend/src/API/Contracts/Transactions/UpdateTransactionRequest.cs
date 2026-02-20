using System;
using Application.Features.Transactions;

namespace API.Contracts.Transactions
{
    public class UpdateTransactionRequest
    {
        /// <summary>
        /// Payer mode (enum defined in Application.Features.Transactions).
        /// </summary>
        public PayerMode PayerMode { get; set; }

        /// <summary>
        /// Total amount of the transaction. Validation is enforced elsewhere.
        /// </summary>
        public decimal Total { get; set; }

        /// <summary>
        /// Optional portion of the total attributed to the partner.
        /// </summary>
        public decimal? DebtAmount { get; set; }

        /// <summary>
        /// Optional note for the transaction.
        /// </summary>
        public string? Note { get; set; }

        /// <summary>
        /// Optional transaction date. If omitted, server date/time will be used.
        /// </summary>
        public DateTime? TransactionDate { get; set; }
    }
}
