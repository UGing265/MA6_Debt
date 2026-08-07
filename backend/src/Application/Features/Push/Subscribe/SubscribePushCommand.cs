using MediatR;

namespace Application.Features.Push.Subscribe;

public class SubscribePushCommand : IRequest
{
    public Guid UserId { get; set; }
    public string Endpoint { get; set; } = string.Empty;
    public string P256dh { get; set; } = string.Empty;
    public string Auth { get; set; } = string.Empty;
}
