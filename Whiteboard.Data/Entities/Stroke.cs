using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Whiteboard.Data.Entities
{
    public class Stroke
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid DocumentId { get; set; }

        [ForeignKey(nameof(DocumentId))]
        public Document? Document { get; set; }

        [Required]
        public string Data { get; set; } = string.Empty; // e.g., JSON stroke data

        public string? Color { get; set; }
        public float Thickness { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
