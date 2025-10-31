using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Whiteboard.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Whiteboard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly WhiteboardDbContext _context;

        public UsersController(WhiteboardDbContext context)
        {
            _context = context;
        }


        [HttpGet("today")]
        public async Task<IActionResult> GetTodayUsers()
        {
            var today = DateTime.UtcNow.Date;

            var users = await _context.Users
                .Include(u => u.Documents)
                .Select(u => new
                {
                    u.Id,
                    Username = u.Username,
                    u.CreatedAt,
                    DocumentsCreatedToday = u.Documents
                        .Count(d => d.CreatedAt.Date == today && !d.IsDeleted),
                    LastActive = u.Documents
                        .Where(d => !d.IsDeleted)
                        .OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt)
                        .Select(d => d.UpdatedAt ?? d.CreatedAt)
                        .FirstOrDefault()
                })
                .Where(u =>
            // ✅ Either registered today OR created any document today
            u.CreatedAt.Date == today ||
            u.DocumentsCreatedToday > 0
        )
                .OrderByDescending(u => u.LastActive)
                .ToListAsync();


            return Ok(users);
        }

        // ✅ Get all users (optional)
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.CreatedAt
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(users);
        }
    }
}
