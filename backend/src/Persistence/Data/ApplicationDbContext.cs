using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<DebtPartner> DebtPartners { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Transfer> Transfers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - Wallet Relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.Wallets)
                .WithOne(w => w.User)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting user deletes their wallets

            // User - DebtPartner Relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.DebtPartners)
                .WithOne(dp => dp.User)
                .HasForeignKey(dp => dp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Wallet - Self Referencing (Parent/Child)
            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.ChildWallets)
                .WithOne(w => w.ParentWallet)
                .HasForeignKey(w => w.ParentWalletId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete for self-ref to avoid cycles

            // Wallet - Transaction Relationship
            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.Transactions)
                .WithOne(t => t.Wallet)
                .HasForeignKey(t => t.WalletId)
                .OnDelete(DeleteBehavior.Cascade);

            // Transaction - DebtPartner Relationship
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Partner)
                .WithMany(dp => dp.Transactions)
                .HasForeignKey(t => t.PartnerId)
                .OnDelete(DeleteBehavior.SetNull); // Keeping transaction even if partner is deleted (soft delete preferred usually, but simple SetNull here)

            // Transfer - FromWallet
            modelBuilder.Entity<Transfer>()
                .HasOne(t => t.FromWallet)
                .WithMany(w => w.SentTransfers)
                .HasForeignKey(t => t.FromWalletId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict to avoid multiple cascade paths

            // Transfer - ToWallet
            modelBuilder.Entity<Transfer>()
                .HasOne(t => t.ToWallet)
                .WithMany(w => w.ReceivedTransfers)
                .HasForeignKey(t => t.ToWalletId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // DebtPartner - Soft Delete Filter
             modelBuilder.Entity<DebtPartner>().HasQueryFilter(dp => !dp.IsDeleted);
        }
    }
}
