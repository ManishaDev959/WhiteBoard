namespace WhiteboardApi.Models
{
    public class DocumentDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public Guid OwnerId { get; set; }
        public bool IsDeleted { get; set; } = false; // Default to false, but you can allow it if you want to create deleted docs (rare case)
    }
}
