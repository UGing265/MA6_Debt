using FluentValidation;

namespace Application.Features.Push.Subscribe;

public class SubscribePushValidator : AbstractValidator<SubscribePushCommand>
{
    public SubscribePushValidator()
    {
        RuleFor(command => command.UserId).NotEmpty();
        RuleFor(command => command.Endpoint).NotEmpty().MaximumLength(2048);
        RuleFor(command => command.P256dh).NotEmpty().MaximumLength(512);
        RuleFor(command => command.Auth).NotEmpty().MaximumLength(256);
    }
}
