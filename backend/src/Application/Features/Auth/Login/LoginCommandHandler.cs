using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Auth.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly IConfiguration _configuration;

    public LoginCommandHandler(
        IApplicationDbContext dbContext,
        IPasswordHasher passwordHasher,
        ITokenGenerator tokenGenerator,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
        _configuration = configuration;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid username or password");

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        var now = DateTime.UtcNow;
        var accessToken = _tokenGenerator.GenerateAccessToken(user);
        var refreshToken = _tokenGenerator.GenerateRefreshToken();
        var refreshTokenHash = _tokenGenerator.HashRefreshToken(refreshToken);
        var refreshTokenExpirationDays = GetConfiguredInt("Jwt:RefreshTokenExpirationDays", 7);

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            FamilyId = Guid.NewGuid(),
            ExpiresAt = now.AddDays(refreshTokenExpirationDays),
            CreatedAt = now
        });

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            Token = accessToken,
            Expiration = now.AddMinutes(GetConfiguredInt("Jwt:AccessTokenExpirationMinutes", GetConfiguredInt("Jwt:ExpirationMinutes", 60))),
            RefreshToken = refreshToken
        };
    }

    private int GetConfiguredInt(string key, int fallback) =>
        int.TryParse(_configuration[key], out var value) ? value : fallback;
}
