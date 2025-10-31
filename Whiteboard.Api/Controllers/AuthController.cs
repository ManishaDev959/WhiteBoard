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
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly WhiteboardDbContext _db;
        private readonly PasswordService _passwordService;
        private readonly JwtService _jwtService;

        private readonly IHubContext<AdminHub> _hubContext;

        public AuthController(WhiteboardDbContext db, PasswordService passwordService, JwtService jwtService,
        IHubContext<AdminHub> hubContext
        )
        {
            _db = db;
            _passwordService = passwordService;
            _jwtService = jwtService;
            _hubContext = hubContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("Username already exists.");

            var hashedPassword = _passwordService.HashPassword(request.Username, request.Password);
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = hashedPassword,
                Role = string.IsNullOrWhiteSpace(request.Role) ? "User" : request.Role
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("UserRegistered", new
            {
                Name = user.Username,
                RegisteredAt = user.CreatedAt
            });

            return Ok(new { Message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            var validPassword = _passwordService.VerifyPassword(user.Username, user.PasswordHash, request.Password);
            if (!validPassword)
                return Unauthorized("Invalid credentials.");

            var token = _jwtService.GenerateToken(user.Id, user.Username, user.Role);
            return Ok(new AuthResponse { Token = token, Username = user.Username, Role = user.Role });
        }
    }
}
