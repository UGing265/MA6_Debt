namespace Application.Common.Interfaces;

public interface IPushNotificationService
{
    string GetPublicKey();

    Task SendTestNotificationAsync(Guid userId, CancellationToken cancellationToken = default);
}
