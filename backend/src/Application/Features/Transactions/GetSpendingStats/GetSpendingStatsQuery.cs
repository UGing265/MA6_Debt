using System;
using System.Collections.Generic;
using MediatR;

namespace Application.Features.Transactions.GetSpendingStats
{
    public class GetSpendingStatsQuery : IRequest<List<SpendingStatsDto>>
    {
        public Guid UserId { get; set; }
        public string Period { get; set; } = "day"; // "day", "month", "quarter"
        public int Limit { get; set; } = 30;
    }
}
