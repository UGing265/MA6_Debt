using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Auth.ResetPassword;

public class ResetPasswordRequest
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class ResetPasswordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ResetPasswordCommand : IRequest<ResetPasswordResponse>
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;

    public ResetPasswordCommandHandler(IApplicationDbContext dbContext, IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public async Task<ResetPasswordResponse> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "Invalid verification token or new password."
            };
        }

        var resetToken = await _dbContext.PasswordResetTokens
            .Include(prt => prt.User)
            .FirstOrDefaultAsync(prt => prt.Token == request.Token, cancellationToken);

        if (resetToken == null || resetToken.IsUsed || resetToken.ExpiresAt < DateTime.UtcNow)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "The password reset link is invalid, already used, or expired."
            };
        }

        if (request.NewPassword.Length < 6)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "New password must be at least 6 characters long."
            };
        }

        // Hash new password and update user
        resetToken.User.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        resetToken.IsUsed = true;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResetPasswordResponse
        {
            Success = true,
            Message = "Password reset successfully! You can now sign in with your new password."
        };
    }
}
