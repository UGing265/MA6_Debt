using Application.Common.Interfaces;
using Domain.Entities;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Auth.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterCommandHandler(
        IApplicationDbContext dbContext,
        IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if username already exists
        var usernameExists = await _dbContext.Users
            .AnyAsync(u => u.Username == request.Username, cancellationToken);
        
        if (usernameExists)
        {
            throw new ValidationException(new[] { new ValidationFailure("Username", "Username already exists") });
        }

        // Check if email already exists (if provided)
        if (!string.IsNullOrEmpty(request.Email))
        {
            var emailExists = await _dbContext.Users
                .AnyAsync(u => u.Email == request.Email, cancellationToken);
            
            if (emailExists)
            {
                throw new ValidationException(new[] { new ValidationFailure("Email", "Email already exists") });
            }
        }

        // Hash password
        var passwordHash = _passwordHasher.HashPassword(request.Password);

        // Create user entity
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = passwordHash,
            Email = request.Email,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        // Add user to database
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Return response
        return new RegisterResponse
        {
            SuccessMessage = "User registered successfully",
            UserId = user.Id
        };
    }
}
