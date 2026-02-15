using MediatR;
using System.Text.Json.Serialization;

namespace Application.Features.Wallets.CreateWallet
{
    public class CreateWalletCommand : IRequest<WalletDto>
    {
        [JsonIgnore]
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ParentWalletId { get; set; }
    }
}
