using MediatR;

namespace Application.Features.Push.SendTest;

public class SendTestPushCommand : IRequest
{
    public Guid UserId { get; set; }
}
