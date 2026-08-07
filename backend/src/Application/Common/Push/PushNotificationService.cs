using System.Text.Json;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebPush;

namespace Application.Common.Push;

public class PushNotificationService : IPushNotificationService
{
    private readonly IApplicationDbContext _context;
    private readonly string _publicKey;
    private readonly string _privateKey;
    private readonly string _subject;

    public PushNotificationService(IApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _publicKey = configuration["Vapid:PublicKey"] ?? string.Empty;
        _privateKey = configuration["Vapid:PrivateKey"] ?? string.Empty;
        _subject = configuration["Vapid:Subject"] ?? "mailto:admin@example.com";
    }

    public string GetPublicKey()
    {
        if (string.IsNullOrWhiteSpace(_publicKey))
        {
            throw new InvalidOperationException("VAPID public key is not configured.");
        }

        return _publicKey;
    }

    public async Task SendTestNotificationAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_publicKey) || string.IsNullOrWhiteSpace(_privateKey))
        {
            throw new InvalidOperationException("VAPID keys are not configured.");
        }

        var subscriptions = await _context.PushSubscriptions
            .Where(subscription => subscription.UserId == userId)
            .ToListAsync(cancellationToken);

        if (subscriptions.Count == 0)
        {
            throw new InvalidOperationException("No push subscription is registered for this user.");
        }

        var payload = JsonSerializer.Serialize(new
        {
            title = "Test notification",
            body = "Push is working",
            type = "test",
            tag = "test",
            url = "/dashboard"
        });

        var vapidDetails = new VapidDetails(_subject, _publicKey, _privateKey);
        using var client = new WebPushClient();

        foreach (var savedSubscription in subscriptions)
        {
            var subscription = new WebPush.PushSubscription(
                savedSubscription.Endpoint,
                savedSubscription.P256dh,
                savedSubscription.Auth);

            await client.SendNotificationAsync(subscription, payload, vapidDetails, cancellationToken);
        }
    }
}
