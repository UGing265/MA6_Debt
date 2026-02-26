using Application.Common;
using MediatR;

namespace Application.Features.Transactions.GetTransactions
{
    /// <summary>
    /// Query to get all transactions for the current user, optionally filtered by wallet or partner.
    /// </summary>
    public class GetTransactionsQuery : IRequest<PagedResult<TransactionDto>>
    {
        public Guid UserId { get; set; }
        
        /// <summary>
        /// Optional wallet filter. If null, returns transactions from all user wallets.
        /// </summary>
        public Guid? WalletId { get; set; }

        /// <summary>
        /// Optional partner filter. If provided, returns only transactions involving this partner.
        /// </summary>
        public Guid? PartnerId { get; set; }

        /// <summary>
        /// Optional keyword search (case-insensitive). Filters by transaction note OR partner name.
        /// </summary>
        public string? SearchTerm { get; set; }

        /// <summary>
        /// Page number (1-based). Default is 1.
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// Number of items per page. Default is 10.
        /// </summary>
        public int PageSize { get; set; } = 10;
    }
}
