namespace Application.Features.DebtPartners
{
    public class DebtPartnerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal InitialBalance { get; set; }
        public string Type { get; set; } = string.Empty;
    }
}
