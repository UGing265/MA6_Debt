using System;

namespace Application.Common.Locking
{
    public static class MonthLockPolicy
    {
        private static readonly TimeZoneInfo VietnamTimeZone = ResolveVietnamTimeZone();

        private const string VietnamIanaTimeZoneId = "Asia/Ho_Chi_Minh";
        private const string VietnamWindowsTimeZoneId = "SE Asia Standard Time";

        public static bool IsLocked(DateTime transactionDate, DateTimeOffset nowUtc)
        {
            var transactionLocal = ConvertToVietnamLocal(transactionDate);
            var nowLocal = TimeZoneInfo.ConvertTime(nowUtc, VietnamTimeZone);

            return transactionLocal.Year != nowLocal.Year || transactionLocal.Month != nowLocal.Month;
        }

        private static DateTime ConvertToVietnamLocal(DateTime transactionDate)
        {
            var utc = transactionDate.Kind switch
            {
                DateTimeKind.Utc => transactionDate,
                DateTimeKind.Local => transactionDate.ToUniversalTime(),
                _ => DateTime.SpecifyKind(transactionDate, DateTimeKind.Utc)
            };

            return TimeZoneInfo.ConvertTimeFromUtc(utc, VietnamTimeZone);
        }

        private static TimeZoneInfo ResolveVietnamTimeZone()
        {
            return TryFindTimeZoneInfo(VietnamIanaTimeZoneId)
                   ?? TryFindTimeZoneInfo(VietnamWindowsTimeZoneId)
                   ?? CreateFixedVietnamTimeZone();
        }

        private static TimeZoneInfo? TryFindTimeZoneInfo(string timeZoneId)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            }
            catch (TimeZoneNotFoundException)
            {
                return null;
            }
            catch (InvalidTimeZoneException)
            {
                return null;
            }
        }

        private static TimeZoneInfo CreateFixedVietnamTimeZone()
        {
            return TimeZoneInfo.CreateCustomTimeZone(
                id: VietnamIanaTimeZoneId,
                baseUtcOffset: TimeSpan.FromHours(7),
                displayName: "Vietnam Time",
                standardDisplayName: "Vietnam Time");
        }
    }
}
