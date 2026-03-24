using MediatR;
using System;
using System.Collections.Generic;

namespace Application.Features.Transfers.GetTransfers
{
    /// <summary>
    /// CQRS query for listing transfer history with optional filtering.
    /// </summary>
    public class GetTransfersQuery : IRequest<IReadOnlyList<TransferDto>>
    {
        public Guid UserId { get; set; }

        // Optional wallet filter. If provided, returns transfers involving this wallet.
        public Guid? WalletId { get; set; }

        // Optional date range filter for TransferDate.
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
