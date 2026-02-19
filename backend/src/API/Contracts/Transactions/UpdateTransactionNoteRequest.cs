namespace API.Contracts.Transactions
{
    public class UpdateTransactionNoteRequest
    {
        /// <summary>
        /// Optional note content. Max length is enforced by validator rules.
        /// </summary>
        public string? Note { get; set; }
    }
}
