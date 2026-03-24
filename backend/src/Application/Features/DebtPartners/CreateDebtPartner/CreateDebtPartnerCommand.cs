using MediatR;
using System.Text.Json.Serialization;

namespace Application.Features.DebtPartners.CreateDebtPartner
{
    public class CreateDebtPartnerCommand : IRequest<DebtPartnerDto>
    {
        [JsonIgnore]
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }
}
