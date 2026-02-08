using Application.Common.Interfaces;
using Domain.Entities;

namespace Persistence.Data
{
    /// <summary>
    /// Initializes the database with seed data for testing.
    /// </summary>
    public static class DbInitializer
    {
        /// <summary>
        /// Initializes the database with default test users if empty.
        /// </summary>
        /// <param name="context">The application database context</param>
        /// <param name="passwordHasher">The password hasher service</param>
        public static void Initialize(ApplicationDbContext context, IPasswordHasher passwordHasher)
        {
            // Check if Users table is empty
            if (context.Users.Any())
            {
                return; // Database has already been seeded
            }

            // Create admin user for testing
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                PasswordHash = passwordHasher.HashPassword("Password123!"),
                Name = "Administrator",
                Email = "admin@example.com",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            context.SaveChanges();
        }
    }
}
