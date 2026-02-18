using Application.Features.Transactions.CashAdjustment;
using System.ComponentModel.DataAnnotations;

namespace API.Contracts.Transactions
{
    public class CashAdjustmentRequest
    {
        [Required]
        public Guid WalletId { get; set; }

        [Required]
        [EnumDataType(typeof(AdjustmentDirection))]
        public AdjustmentDirection Direction { get; set; }

        public decimal Amount { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(255)]
        public string Note { get; set; } = string.Empty;

        public DateTime? TransactionDate { get; set; }
    }
}
