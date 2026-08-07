using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Data
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<DebtPartner> DebtPartners { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Transfer> Transfers { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<PushSubscription> PushSubscriptions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder
                .UseSnakeCaseNamingConvention()
                .ConfigureWarnings(w =>
                    w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Wallets)
                .WithOne(w => w.User)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.DebtPartners)
                .WithOne(dp => dp.User)
                .HasForeignKey(dp => dp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.PushSubscriptions)
                .WithOne(ps => ps.User)
                .HasForeignKey(ps => ps.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.ChildWallets)
                .WithOne(w => w.ParentWallet)
                .HasForeignKey(w => w.ParentWalletId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.Transactions)
                .WithOne(t => t.Wallet)
                .HasForeignKey(t => t.WalletId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Partner)
                .WithMany(dp => dp.Transactions)
                .HasForeignKey(t => t.PartnerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Transfer>()
                .HasOne(t => t.FromWallet)
                .WithMany(w => w.SentTransfers)
                .HasForeignKey(t => t.FromWalletId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transfer>()
                .HasOne(t => t.ToWallet)
                .WithMany(w => w.ReceivedTransfers)
                .HasForeignKey(t => t.ToWalletId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany()
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.TokenHash)
                .IsUnique();

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.UserId);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.FamilyId);

            modelBuilder.Entity<PasswordResetToken>()
                .HasOne(prt => prt.User)
                .WithMany()
                .HasForeignKey(prt => prt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PasswordResetToken>()
                .HasIndex(prt => prt.Token)
                .IsUnique();

            modelBuilder.Entity<PasswordResetToken>()
                .HasIndex(prt => prt.UserId);

            modelBuilder.Entity<PushSubscription>()
                .HasIndex(ps => ps.Endpoint)
                .IsUnique();

            modelBuilder.Entity<PushSubscription>()
                .HasIndex(ps => ps.UserId);

            modelBuilder.Entity<DebtPartner>().HasQueryFilter(dp => !dp.IsDeleted);
        }
    }
}

