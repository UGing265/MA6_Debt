using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.UpdateDailySpendingLimit
{
    public class UpdateDailySpendingLimitCommandHandler : IRequestHandler<UpdateDailySpendingLimitCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDailySpendingLimitCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateDailySpendingLimitCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException("User", request.UserId);
            }

            if (request.Enabled && (!request.Amount.HasValue || request.Amount.Value <= 0))
            {
                throw new ValidationException(new[] { new ValidationFailure("Amount", "Daily spending limit amount must be greater than 0") });
            }

            user.DailySpendingLimitEnabled = request.Enabled;
            user.DailySpendingLimitAmount = request.Enabled ? request.Amount : null;

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
