using Domain.Entities;
using Microsoft.EntityFrameworkCore;

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
    /// Saves changes asynchronously.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The number of entities saved</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
