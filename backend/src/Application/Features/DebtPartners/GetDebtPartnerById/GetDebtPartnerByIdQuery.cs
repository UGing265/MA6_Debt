using MediatR;

namespace Application.Features.DebtPartners.GetDebtPartnerById
{
    public class GetDebtPartnerByIdQuery : IRequest<DebtPartnerDto>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
    }
}
