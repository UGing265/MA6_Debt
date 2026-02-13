using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Auth.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGenerator _tokenGenerator;

    public LoginCommandHandler(
        IApplicationDbContext dbContext,
        IPasswordHasher passwordHasher,
        ITokenGenerator tokenGenerator)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
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

        var token = _tokenGenerator.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddHours(24)
        };
    }
}
