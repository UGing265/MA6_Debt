namespace Application.Features.Transactions.QuickDeduct
{
    /// <summary>
    /// Response from Quick Deduct command including transaction details and debt notification (US-04).
    /// </summary>
    public class QuickDeductResponse
    {
        /// <summary>
        /// Created transaction details.
        /// </summary>
        public TransactionDto Transaction { get; set; } = null!;
        
        /// <summary>
        /// US-04: Debt notification message showing remaining balance.
        /// </summary>
        public DebtNotification Notification { get; set; } = null!;
    }
    
    /// <summary>
    /// US-04: Debt notification payload showing current partner balance after transaction.
    /// </summary>
    public class DebtNotification
    {
        /// <summary>
        /// Partner ID.
        /// </summary>
        public Guid PartnerId { get; set; }
        
        /// <summary>
        /// Partner name.
        /// </summary>
        public string PartnerName { get; set; } = string.Empty;
        
        /// <summary>
        /// Remaining balance after transaction (signed).
        /// Positive: partner owes user.
        /// Negative: user owes partner.
        /// Zero: settled.
        /// </summary>
        public decimal RemainingBalance { get; set; }
        
        /// <summary>
        /// Human-readable message describing the debt state.
        /// </summary>
        public string Message { get; set; } = string.Empty;
        
        /// <summary>
        /// Direction indicator for UI coloring/icons.
        /// </summary>
        public DebtDirection Direction { get; set; }
    }
    
    /// <summary>
    /// Debt direction indicator derived from signed balance.
    /// </summary>
    public enum DebtDirection
    {
        /// <summary>
        /// Partner owes user (RemainingBalance > 0).
        /// </summary>
        PartnerOwesUser = 0,
        
        /// <summary>
        /// User owes partner (RemainingBalance < 0).
        /// </summary>
        UserOwesPartner = 1,
        
        /// <summary>
        /// Settled (RemainingBalance = 0).
        /// </summary>
        Settled = 2
    }
}
