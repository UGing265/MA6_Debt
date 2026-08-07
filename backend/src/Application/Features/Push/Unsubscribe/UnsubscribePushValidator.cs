using FluentValidation;

namespace Application.Features.Push.Unsubscribe;

public class UnsubscribePushValidator : AbstractValidator<UnsubscribePushCommand>
{
    public UnsubscribePushValidator()
    {
        RuleFor(command => command.UserId).NotEmpty();
        RuleFor(command => command.Endpoint).NotEmpty().MaximumLength(2048);
    }
}
