using Microsoft.AspNetCore.Identity;

namespace Whiteboard.Api.Services
{
    public class PasswordService
    {
        private readonly PasswordHasher<string> _hasher = new();

        public string HashPassword(string username, string password)
        {
            return _hasher.HashPassword(username, password);
        }

        public bool VerifyPassword(string username, string hashedPassword, string providedPassword)
        {
            var result = _hasher.VerifyHashedPassword(username, hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success;
        }
    }
}
