using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConvertToSnakeCaseAndRenameBalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DebtPartners_Users_UserId",
                table: "DebtPartners");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_DebtPartners_PartnerId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Wallets_WalletId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Wallets_FromWalletId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Wallets_ToWalletId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Wallets_Users_UserId",
                table: "Wallets");

            migrationBuilder.DropForeignKey(
                name: "FK_Wallets_Wallets_ParentWalletId",
                table: "Wallets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Wallets",
                table: "Wallets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transfers",
                table: "Transfers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DebtPartners",
                table: "DebtPartners");

            migrationBuilder.RenameTable(
                name: "Wallets",
                newName: "wallets");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Transfers",
                newName: "transfers");

            migrationBuilder.RenameTable(
                name: "Transactions",
                newName: "transactions");

            migrationBuilder.RenameTable(
                name: "DebtPartners",
                newName: "debt_partners");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "wallets",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "wallets",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "wallets",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "wallets",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "ParentWalletId",
                table: "wallets",
                newName: "parent_wallet_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "wallets",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Wallets_UserId",
                table: "wallets",
                newName: "ix_wallets_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_Wallets_ParentWalletId",
                table: "wallets",
                newName: "ix_wallets_parent_wallet_id");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "users",
                newName: "password_hash");

            migrationBuilder.RenameColumn(
                name: "DefaultWalletId",
                table: "users",
                newName: "default_wallet_id");

            migrationBuilder.RenameColumn(
                name: "DefaultPartnerId",
                table: "users",
                newName: "default_partner_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "users",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "transfers",
                newName: "amount");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "transfers",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "TransferDate",
                table: "transfers",
                newName: "transfer_date");

            migrationBuilder.RenameColumn(
                name: "ToWalletId",
                table: "transfers",
                newName: "to_wallet_id");

            migrationBuilder.RenameColumn(
                name: "FromWalletId",
                table: "transfers",
                newName: "from_wallet_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "transfers",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Transfers_ToWalletId",
                table: "transfers",
                newName: "ix_transfers_to_wallet_id");

            migrationBuilder.RenameIndex(
                name: "IX_Transfers_FromWalletId",
                table: "transfers",
                newName: "ix_transfers_from_wallet_id");

            migrationBuilder.RenameColumn(
                name: "Note",
                table: "transactions",
                newName: "note");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "transactions",
                newName: "amount");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "transactions",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "WalletId",
                table: "transactions",
                newName: "wallet_id");

            migrationBuilder.RenameColumn(
                name: "TransactionDate",
                table: "transactions",
                newName: "transaction_date");

            migrationBuilder.RenameColumn(
                name: "PartnerId",
                table: "transactions",
                newName: "partner_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "transactions",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_WalletId",
                table: "transactions",
                newName: "ix_transactions_wallet_id");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_PartnerId",
                table: "transactions",
                newName: "ix_transactions_partner_id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "debt_partners",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "debt_partners",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "debt_partners",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "debt_partners",
                newName: "is_deleted");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "debt_partners",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "InitialBalance",
                table: "debt_partners",
                newName: "balance");

            migrationBuilder.RenameIndex(
                name: "IX_DebtPartners_UserId",
                table: "debt_partners",
                newName: "ix_debt_partners_user_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_wallets",
                table: "wallets",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_transfers",
                table: "transfers",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_transactions",
                table: "transactions",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_debt_partners",
                table: "debt_partners",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_debt_partners_users_user_id",
                table: "debt_partners",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_debt_partners_partner_id",
                table: "transactions",
                column: "partner_id",
                principalTable: "debt_partners",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_wallets_wallet_id",
                table: "transactions",
                column: "wallet_id",
                principalTable: "wallets",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_transfers_wallets_from_wallet_id",
                table: "transfers",
                column: "from_wallet_id",
                principalTable: "wallets",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_transfers_wallets_to_wallet_id",
                table: "transfers",
                column: "to_wallet_id",
                principalTable: "wallets",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_wallets_users_user_id",
                table: "wallets",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_wallets_wallets_parent_wallet_id",
                table: "wallets",
                column: "parent_wallet_id",
                principalTable: "wallets",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_debt_partners_users_user_id",
                table: "debt_partners");

            migrationBuilder.DropForeignKey(
                name: "fk_transactions_debt_partners_partner_id",
                table: "transactions");

            migrationBuilder.DropForeignKey(
                name: "fk_transactions_wallets_wallet_id",
                table: "transactions");

            migrationBuilder.DropForeignKey(
                name: "fk_transfers_wallets_from_wallet_id",
                table: "transfers");

            migrationBuilder.DropForeignKey(
                name: "fk_transfers_wallets_to_wallet_id",
                table: "transfers");

            migrationBuilder.DropForeignKey(
                name: "fk_wallets_users_user_id",
                table: "wallets");

            migrationBuilder.DropForeignKey(
                name: "fk_wallets_wallets_parent_wallet_id",
                table: "wallets");

            migrationBuilder.DropPrimaryKey(
                name: "pk_wallets",
                table: "wallets");

            migrationBuilder.DropPrimaryKey(
                name: "pk_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_transfers",
                table: "transfers");

            migrationBuilder.DropPrimaryKey(
                name: "pk_transactions",
                table: "transactions");

            migrationBuilder.DropPrimaryKey(
                name: "pk_debt_partners",
                table: "debt_partners");

            migrationBuilder.RenameTable(
                name: "wallets",
                newName: "Wallets");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "transfers",
                newName: "Transfers");

            migrationBuilder.RenameTable(
                name: "transactions",
                newName: "Transactions");

            migrationBuilder.RenameTable(
                name: "debt_partners",
                newName: "DebtPartners");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Wallets",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Wallets",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Wallets",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Wallets",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "parent_wallet_id",
                table: "Wallets",
                newName: "ParentWalletId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Wallets",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_wallets_user_id",
                table: "Wallets",
                newName: "IX_Wallets_UserId");

            migrationBuilder.RenameIndex(
                name: "ix_wallets_parent_wallet_id",
                table: "Wallets",
                newName: "IX_Wallets_ParentWalletId");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "Users",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "default_wallet_id",
                table: "Users",
                newName: "DefaultWalletId");

            migrationBuilder.RenameColumn(
                name: "default_partner_id",
                table: "Users",
                newName: "DefaultPartnerId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "amount",
                table: "Transfers",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Transfers",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "transfer_date",
                table: "Transfers",
                newName: "TransferDate");

            migrationBuilder.RenameColumn(
                name: "to_wallet_id",
                table: "Transfers",
                newName: "ToWalletId");

            migrationBuilder.RenameColumn(
                name: "from_wallet_id",
                table: "Transfers",
                newName: "FromWalletId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Transfers",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_transfers_to_wallet_id",
                table: "Transfers",
                newName: "IX_Transfers_ToWalletId");

            migrationBuilder.RenameIndex(
                name: "ix_transfers_from_wallet_id",
                table: "Transfers",
                newName: "IX_Transfers_FromWalletId");

            migrationBuilder.RenameColumn(
                name: "note",
                table: "Transactions",
                newName: "Note");

            migrationBuilder.RenameColumn(
                name: "amount",
                table: "Transactions",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Transactions",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "wallet_id",
                table: "Transactions",
                newName: "WalletId");

            migrationBuilder.RenameColumn(
                name: "transaction_date",
                table: "Transactions",
                newName: "TransactionDate");

            migrationBuilder.RenameColumn(
                name: "partner_id",
                table: "Transactions",
                newName: "PartnerId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Transactions",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_transactions_wallet_id",
                table: "Transactions",
                newName: "IX_Transactions_WalletId");

            migrationBuilder.RenameIndex(
                name: "ix_transactions_partner_id",
                table: "Transactions",
                newName: "IX_Transactions_PartnerId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "DebtPartners",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "DebtPartners",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "DebtPartners",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "is_deleted",
                table: "DebtPartners",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "DebtPartners",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "balance",
                table: "DebtPartners",
                newName: "InitialBalance");

            migrationBuilder.RenameIndex(
                name: "ix_debt_partners_user_id",
                table: "DebtPartners",
                newName: "IX_DebtPartners_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Wallets",
                table: "Wallets",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transfers",
                table: "Transfers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DebtPartners",
                table: "DebtPartners",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DebtPartners_Users_UserId",
                table: "DebtPartners",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_DebtPartners_PartnerId",
                table: "Transactions",
                column: "PartnerId",
                principalTable: "DebtPartners",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Wallets_WalletId",
                table: "Transactions",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Wallets_FromWalletId",
                table: "Transfers",
                column: "FromWalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Wallets_ToWalletId",
                table: "Transfers",
                column: "ToWalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Wallets_Users_UserId",
                table: "Wallets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Wallets_Wallets_ParentWalletId",
                table: "Wallets",
                column: "ParentWalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
