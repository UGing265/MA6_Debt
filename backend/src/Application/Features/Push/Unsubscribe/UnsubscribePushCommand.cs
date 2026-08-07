using MediatR;

namespace Application.Features.Push.Unsubscribe;

public class UnsubscribePushCommand : IRequest
{
    public Guid UserId { get; set; }
    public string Endpoint { get; set; } = string.Empty;
}
