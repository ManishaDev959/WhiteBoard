using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Whiteboard.Data;
using Whiteboard.Api.Models;
using Whiteboard.Data.Entities;
using WhiteboardApi.Models;

namespace WhiteboardApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly WhiteboardDbContext _context;

        public DocumentsController(WhiteboardDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDocuments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var documents = await _context.Documents
                .Where(d => d.OwnerId.ToString() == userId && !d.IsDeleted)
                .ToListAsync();
            return Ok(documents);
        }

        [HttpGet("user")]
        [Authorize] // protect endpoint
        public async Task<IActionResult> GetDocumentsByUserId()
        {
            var userIdfromToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdfromToken == null)
                return Unauthorized("Invalid or missing token.");

            var userGuid = Guid.Parse(userIdfromToken);

            var documents = await _context.Documents
                .Where(d => d.OwnerId == userGuid && !d.IsDeleted)
                .ToListAsync();

            return Ok(documents);
        }


        [HttpPost]
        public async Task<IActionResult> CreateDocument([FromBody] DocumentDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var document = new Document
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Content = request.Content ?? "",
                OwnerId = Guid.Parse(userId),
                IsDeleted = request.IsDeleted,  // Use value from DTO
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return Ok(document);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(Guid id, [FromBody] DocumentDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var document = await _context.Documents.FindAsync(id);

            if (document == null) return NotFound();
            if (document.OwnerId.ToString() != userId) return Forbid();

            document.Title = request.Title;
            document.Content = request.Content;
            document.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(document);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var document = await _context.Documents.FindAsync(id);

            if (document == null) return NotFound();
            if (document.OwnerId.ToString() != userId) return Forbid();

            document.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Moved to trash" });
        }


        [HttpPatch("restore/{id}")]
        public async Task<IActionResult> RestoreDocument(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var document = await _context.Documents.FindAsync(id);

            if (document == null) return NotFound();
            if (document.OwnerId.ToString() != userId) return Forbid();

            document.IsDeleted = false;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Restored successfully" });
        }

        [HttpGet("trash")]
        public async Task<IActionResult> GetTrashedDocuments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var documents = await _context.Documents
                .Where(d => d.OwnerId.ToString() == userId && d.IsDeleted)
                .ToListAsync();

            return Ok(documents);
        }

        [HttpGet("count")]
        [Authorize]
        public async Task<IActionResult> GetDocumentCountForUser()
        {
            var userIdfromToken = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdfromToken == null)
                return Unauthorized();

            var userGuid = Guid.Parse(userIdfromToken);
            var count = await _context.Documents
                .CountAsync(d => d.OwnerId == userGuid && !d.IsDeleted);

            return Ok(new { count });
        }

        [HttpGet("deleted-count")]
        [Authorize]
        public async Task<IActionResult> GetDeletedDocumentCountForUser()
        {
            var userIdfromToken = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdfromToken == null)
                return Unauthorized();

            var userGuid = Guid.Parse(userIdfromToken);
            var count = await _context.Documents
                .CountAsync(d => d.OwnerId == userGuid && d.IsDeleted);

            return Ok(new { count });
        }

    }
}
