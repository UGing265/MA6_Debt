using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUs03TransactionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "debt_amount",
                table: "transactions",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "partner_balance_after",
                table: "transactions",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "partner_balance_before",
                table: "transactions",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "payer_mode",
                table: "transactions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "total_amount",
                table: "transactions",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "debt_amount",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "partner_balance_after",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "partner_balance_before",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "payer_mode",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "total_amount",
                table: "transactions");
        }
    }
}
