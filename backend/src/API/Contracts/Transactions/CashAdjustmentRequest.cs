using Application.Features.Transactions.CashAdjustment;

namespace API.Contracts.Transactions
{
    public class CashAdjustmentRequest
    {
        public Guid WalletId { get; set; }

        public AdjustmentDirection Direction { get; set; }

        public decimal Amount { get; set; }

        public string Note { get; set; } = string.Empty;

        public DateTime? TransactionDate { get; set; }
    }
}
