

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Whiteboard.Api.Models;
using Whiteboard.Api.Services;
using Whiteboard.Data;
using Whiteboard.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Whiteboard.Api.Hubs;

namespace Whiteboard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly WhiteboardDbContext _context;

        public FilesController(IWebHostEnvironment env, WhiteboardDbContext context)
        {
            _env = env;
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string description)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

           
            var storedFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, storedFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

        
            var userId = User.FindFirst("sub")?.Value ?? "00000000-0000-0000-0000-000000000000";

            var document = new FileDocument
            {
                FileName = file.FileName,
                StoredFileName = storedFileName,
                ContentType = file.ContentType,
                Size = file.Length,
                Description = description,
                OwnerId = Guid.Parse(userId)
            };

            _context.FileDocuments.Add(document);
            await _context.SaveChangesAsync();

            return Ok(new { message = "File uploaded successfully.", document.Id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> DownloadFile(Guid id)
        {
            var document = await _context.FileDocuments.FindAsync(id);
            if (document == null) return NotFound();

            // Access control
            var userId = User.FindFirst("sub")?.Value;
            if (document.IsPrivate && document.OwnerId.ToString() != userId)
                return Forbid();

            var filePath = Path.Combine(_env.ContentRootPath, "uploads", document.StoredFileName);
            if (!System.IO.File.Exists(filePath)) return NotFound();

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, document.ContentType, document.FileName);
        }
    }
}
