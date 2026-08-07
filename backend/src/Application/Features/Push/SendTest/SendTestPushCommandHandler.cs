using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Push.SendTest;

public class SendTestPushCommandHandler : IRequestHandler<SendTestPushCommand>
{
    private readonly IPushNotificationService _pushNotificationService;

    public SendTestPushCommandHandler(IPushNotificationService pushNotificationService)
    {
        _pushNotificationService = pushNotificationService;
    }

    public async Task Handle(SendTestPushCommand request, CancellationToken cancellationToken)
    {
        await _pushNotificationService.SendTestNotificationAsync(request.UserId, cancellationToken);
    }
}
