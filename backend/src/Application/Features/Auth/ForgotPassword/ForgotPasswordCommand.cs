using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Auth.ForgotPassword;

public class ForgotPasswordRequest
{
    public string EmailOrUsername { get; set; } = string.Empty;
}

public class ForgotPasswordResponse
{
    public string Message { get; set; } = string.Empty;
}

public class ForgotPasswordCommand : IRequest<ForgotPasswordResponse>
{
    public string EmailOrUsername { get; set; } = string.Empty;
}

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public ForgotPasswordCommandHandler(
        IApplicationDbContext dbContext,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _emailService = emailService;
        _configuration = configuration;
    }

    public async Task<ForgotPasswordResponse> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var genericResponseMessage = "If an account with that information exists, a password reset link has been sent to your email address.";

        if (string.IsNullOrWhiteSpace(request.EmailOrUsername))
        {
            return new ForgotPasswordResponse { Message = genericResponseMessage };
        }

        var normalizedInput = request.EmailOrUsername.Trim().ToLower();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == normalizedInput || (u.Email != null && u.Email.ToLower() == normalizedInput), cancellationToken);

        if (user == null || string.IsNullOrWhiteSpace(user.Email))
        {
            return new ForgotPasswordResponse { Message = genericResponseMessage };
        }

        // Generate random secure token
        var rawToken = Convert.ToHexString(Guid.NewGuid().ToByteArray()) + Convert.ToHexString(Guid.NewGuid().ToByteArray());

        var passwordResetToken = new PasswordResetToken
        {
            UserId = user.Id,
            Token = rawToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.PasswordResetTokens.Add(passwordResetToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Build reset link URL
        var frontendUrl = _configuration["Cors:Origins"]?.Split(',').FirstOrDefault()?.Trim() ?? "http://localhost:3000";
        var resetLink = $"{frontendUrl.TrimEnd('/')}/reset-password?token={rawToken}";

        await _emailService.SendPasswordResetEmailAsync(user.Email, user.Name ?? user.Username, resetLink, cancellationToken);

        return new ForgotPasswordResponse { Message = genericResponseMessage };
    }
}
