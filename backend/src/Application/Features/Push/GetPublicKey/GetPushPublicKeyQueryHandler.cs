using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Push.GetPublicKey;

public class GetPushPublicKeyQueryHandler : IRequestHandler<GetPushPublicKeyQuery, string>
{
    private readonly IPushNotificationService _pushNotificationService;

    public GetPushPublicKeyQueryHandler(IPushNotificationService pushNotificationService)
    {
        _pushNotificationService = pushNotificationService;
    }

    public Task<string> Handle(GetPushPublicKeyQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(_pushNotificationService.GetPublicKey());
    }
}
