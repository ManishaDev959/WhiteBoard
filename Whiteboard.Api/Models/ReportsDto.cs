// 📁 DTOs/ReportSearchDto.cs
namespace Whiteboard.Api.Models
{
    public class ReportDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? UserId { get; set; } // optional, for user-specific reports
    }
}
