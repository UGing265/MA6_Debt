using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.UpdateProfile
{
    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateProfileCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException("User", request.UserId);
            }

            // Check if username is taken by another user
            if (request.Username != user.Username)
            {
                var usernameExists = await _context.Users
                    .AnyAsync(u => u.Username == request.Username && u.Id != request.UserId, cancellationToken);

                if (usernameExists)
                {
                    throw new ValidationException(new[] { new ValidationFailure("Username", "Username already exists") });
                }
            }

            // Check if email is taken by another user
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Email == request.Email && u.Id != request.UserId, cancellationToken);

                if (emailExists)
                {
                    throw new ValidationException(new[] { new ValidationFailure("Email", "Email already exists") });
                }
            }

            user.Username = request.Username;
            user.Email = request.Email;

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
