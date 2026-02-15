using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DebtPartnersSignedInitialBalanceDropType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE "DebtPartners" 
                SET "InitialBalance" = CASE 
                    WHEN "Type" = 'Receivable' THEN ABS("InitialBalance")
                    WHEN "Type" = 'Payable' THEN -ABS("InitialBalance")
                    ELSE "InitialBalance"  -- zero or null stays as-is
                END;
                """);

            migrationBuilder.DropColumn(
                name: "Type",
                table: "DebtPartners");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "DebtPartners",
                type: "text",
                nullable: false,
                defaultValue: "Receivable");

            migrationBuilder.Sql(
                """
                UPDATE "DebtPartners"
                SET "Type" = CASE
                    WHEN "InitialBalance" < 0 THEN 'Payable'
                    ELSE 'Receivable'
                END;
                """);
        }
    }
}
