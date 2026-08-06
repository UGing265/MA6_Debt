using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddDailySpendingLimitToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "daily_spending_limit_amount",
                table: "users",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "daily_spending_limit_enabled",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "daily_spending_limit_amount",
                table: "users");

            migrationBuilder.DropColumn(
                name: "daily_spending_limit_enabled",
                table: "users");
        }
    }
}
