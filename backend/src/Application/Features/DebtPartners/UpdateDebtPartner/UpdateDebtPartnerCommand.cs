using MediatR;

namespace Application.Features.DebtPartners.UpdateDebtPartner
{
    public class UpdateDebtPartnerCommand : IRequest<DebtPartnerDto>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }
}
