using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Whiteboard.Data.Entities
{

    public class FileDocument
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }          // Original file name
        public string StoredFileName { get; set; }    // Unique file name used on disk
        public string ContentType { get; set; }       // MIME type
        public long Size { get; set; }                // File size in bytes
        public string Description { get; set; }       // Optional user description
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public Guid OwnerId { get; set; }             // Foreign key to User
        public User Owner { get; set; }

        public bool IsPrivate { get; set; } = true;   // For access control

          // optional: link to a document if it’s tied to one
        public Guid? DocumentId { get; set; }
        public Document? Document { get; set; }

        // optional: visibility or access control (e.g., private, shared, public)
        public string AccessLevel { get; set; } = "private";
    }

}
