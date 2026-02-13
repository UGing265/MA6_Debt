using FluentValidation;

namespace Application.Features.Auth.Login;

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .NotNull().WithMessage("Username cannot be null");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .NotNull().WithMessage("Password cannot be null");
    }
}
