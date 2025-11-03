using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Whiteboard.Data.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        public string? Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 🟢 Navigation properties
        public ICollection<Document>? Documents { get; set; } = new List<Document>();

        // 🟢 Each user can upload multiple files
        public ICollection<FileDocument>? FileDocuments { get; set; } = new List<FileDocument>();
    }
}
