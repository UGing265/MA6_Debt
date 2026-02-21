using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class transferwallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "destination_transaction_id",
                table: "transfers",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "source_transaction_id",
                table: "transfers",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                table: "transfers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "ix_transfers_user_id",
                table: "transfers",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_transfers_users_user_id",
                table: "transfers",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transfers_users_user_id",
                table: "transfers");

            migrationBuilder.DropIndex(
                name: "ix_transfers_user_id",
                table: "transfers");

            migrationBuilder.DropColumn(
                name: "destination_transaction_id",
                table: "transfers");

            migrationBuilder.DropColumn(
                name: "source_transaction_id",
                table: "transfers");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "transfers");
        }
    }
}
