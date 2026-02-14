using MediatR;

namespace Application.Features.DebtPartners.CreateDebtPartner
{
    public class CreateDebtPartnerCommand : IRequest<DebtPartnerDto>
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }
}
