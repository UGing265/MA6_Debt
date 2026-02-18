using Application.Features.Transactions;
using System.ComponentModel.DataAnnotations;

namespace API.Contracts.Transactions
{
    public class QuickDeductRequest
    {
        public Guid? WalletId { get; set; }

        public Guid? PartnerId { get; set; }

        [Required]
        [EnumDataType(typeof(PayerMode))]
        public PayerMode PayerMode { get; set; }

        public decimal Total { get; set; }

        public decimal? DebtAmount { get; set; }

        public string? Note { get; set; }

        public DateTime? TransactionDate { get; set; }
    }
}
