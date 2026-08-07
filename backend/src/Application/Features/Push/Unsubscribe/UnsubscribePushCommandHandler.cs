using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Push.Unsubscribe;

public class UnsubscribePushCommandHandler : IRequestHandler<UnsubscribePushCommand>
{
    private readonly IApplicationDbContext _context;

    public UnsubscribePushCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UnsubscribePushCommand request, CancellationToken cancellationToken)
    {
        var subscription = await _context.PushSubscriptions
            .FirstOrDefaultAsync(item => item.UserId == request.UserId && item.Endpoint == request.Endpoint, cancellationToken);

        if (subscription is null)
        {
            return;
        }

        _context.PushSubscriptions.Remove(subscription);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
