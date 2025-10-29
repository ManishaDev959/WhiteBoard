using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Whiteboard.Api.Models;
using Whiteboard.Api.Services;
using Whiteboard.Data;
using Whiteboard.Data.Entities;

namespace Whiteboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly WhiteboardDbContext _db;
        private readonly PasswordService _passwordService;
        private readonly JwtService _jwtService;

        public AuthController(WhiteboardDbContext db, PasswordService passwordService, JwtService jwtService)
        {
            _db = db;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("Username already exists.");

            var hashedPassword = _passwordService.HashPassword(request.Username, request.Password);
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                PasswordHash = hashedPassword
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            var validPassword = _passwordService.VerifyPassword(user.Username, user.PasswordHash, request.Password);
            if (!validPassword)
                return Unauthorized("Invalid credentials.");

            var token = _jwtService.GenerateToken(user.Id, user.Username);
            return Ok(new AuthResponse { Token = token, Username = user.Username });
        }
    }
}
