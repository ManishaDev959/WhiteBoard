using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Whiteboard.Data;
using Whiteboard.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace Whiteboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ReportsController : ControllerBase
    {
        private readonly WhiteboardDbContext _context;

        public ReportsController(WhiteboardDbContext context)
        {
            _context = context;
        }

        [HttpPost("documents-report")]
        public async Task<IActionResult> GetDocumentsReport([FromBody] ReportDto search)
        {
            var query = _context.Documents.AsQueryable();

            // Apply filters
            if (search.StartDate.HasValue)
                query = query.Where(d => d.CreatedAt >= search.StartDate.Value);

            if (search.EndDate.HasValue)
                query = query.Where(d => d.CreatedAt <= search.EndDate.Value);

            if (search.UserId.HasValue)
                query = query.Where(d => d.OwnerId == search.UserId.Value);

            // Fetch results
            var documents = await query
                .Include(d => d.Owner)
                .OrderByDescending(d => d.CreatedAt)
                .Select(d => new
                {
                    d.Id,
                    d.Title,
                    d.CreatedAt,
                    OwnerName = d.Owner.Username
                })
                .ToListAsync();

            var totalCount = documents.Count;

            return Ok(new
            {
                totalCount,
                documents
            });
        }
    }
}
