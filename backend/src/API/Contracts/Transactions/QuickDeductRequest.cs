using Application.Features.Transactions;

namespace API.Contracts.Transactions
{
    public class QuickDeductRequest
    {
        public Guid? WalletId { get; set; }

        public Guid? PartnerId { get; set; }

        public PayerMode PayerMode { get; set; }

        public decimal Total { get; set; }

        public decimal? DebtAmount { get; set; }

        public string? Note { get; set; }

        public DateTime? TransactionDate { get; set; }
    }
}
