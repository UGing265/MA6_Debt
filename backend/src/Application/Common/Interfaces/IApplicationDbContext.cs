using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Common.Interfaces;

/// <summary>
/// Interface for application database context.
/// </summary>
public interface IApplicationDbContext
{
    /// <summary>
    /// Gets the DbSet for Users.
    /// </summary>
    DbSet<User> Users { get; }

    /// <summary>
    /// Gets the DbSet for Wallets.
    /// </summary>
    DbSet<Wallet> Wallets { get; }

    /// <summary>
    /// Gets the DbSet for DebtPartners.
    /// </summary>
    DbSet<DebtPartner> DebtPartners { get; }

    /// <summary>
    /// Gets the DbSet for Transactions.
    /// </summary>
    DbSet<Transaction> Transactions { get; }

    /// <summary>
    /// Gets the DbSet for Transfers.
    /// </summary>
    DbSet<Transfer> Transfers { get; }

    /// <summary>
    /// Gets the DbSet for RefreshTokens.
    /// </summary>
    DbSet<RefreshToken> RefreshTokens { get; }

    /// <summary>
    /// Gets the DbSet for PasswordResetTokens.
    /// </summary>
    DbSet<PasswordResetToken> PasswordResetTokens { get; }

    /// <summary>
    /// Gets the DbSet for browser push subscriptions.
    /// </summary>
    DbSet<PushSubscription> PushSubscriptions { get; }

    DatabaseFacade Database { get; }

    /// <summary>
    /// Saves changes asynchronously.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The number of entities saved</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
