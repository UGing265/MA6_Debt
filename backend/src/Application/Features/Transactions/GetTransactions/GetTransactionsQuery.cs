using MediatR;

namespace Application.Features.Transactions.GetTransactions
{
    /// <summary>
    /// Query to get all transactions for the current user, optionally filtered by wallet.
    /// </summary>
    public class GetTransactionsQuery : IRequest<IReadOnlyList<TransactionDto>>
    {
        public Guid UserId { get; set; }
        
        /// <summary>
        /// Optional wallet filter. If null, returns transactions from all user wallets.
        /// </summary>
        public Guid? WalletId { get; set; }

        /// <summary>
        /// Optional keyword search (case-insensitive). Filters by transaction note OR partner name.
        /// </summary>
        public string? SearchTerm { get; set; }
    }
}
