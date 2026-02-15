namespace Application.Features.DebtPartners
{
    public class DebtPartnerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }
}
