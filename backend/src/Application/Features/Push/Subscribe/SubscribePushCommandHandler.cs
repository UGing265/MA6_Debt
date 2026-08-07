using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Push.Subscribe;

public class SubscribePushCommandHandler : IRequestHandler<SubscribePushCommand>
{
    private readonly IApplicationDbContext _context;

    public SubscribePushCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(SubscribePushCommand request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var subscription = await _context.PushSubscriptions
            .FirstOrDefaultAsync(item => item.Endpoint == request.Endpoint, cancellationToken);

        if (subscription is null)
        {
            subscription = new PushSubscription
            {
                UserId = request.UserId,
                Endpoint = request.Endpoint,
                P256dh = request.P256dh,
                Auth = request.Auth,
                CreatedAt = now,
                LastSeenAt = now
            };
            _context.PushSubscriptions.Add(subscription);
        }
        else
        {
            subscription.UserId = request.UserId;
            subscription.P256dh = request.P256dh;
            subscription.Auth = request.Auth;
            subscription.LastSeenAt = now;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
