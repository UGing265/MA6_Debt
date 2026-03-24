using MediatR;

namespace Application.Features.DebtPartners.GetDebtPartners
{
    public class GetDebtPartnersQuery : IRequest<IReadOnlyList<DebtPartnerDto>>
    {
        public Guid UserId { get; set; }
    }
}
