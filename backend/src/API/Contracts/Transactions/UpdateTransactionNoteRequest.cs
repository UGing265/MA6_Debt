using System.ComponentModel.DataAnnotations;

namespace API.Contracts.Transactions
{
    public class UpdateTransactionNoteRequest
    {
        [MaxLength(255)]
        public string? Note { get; set; }
    }
}
