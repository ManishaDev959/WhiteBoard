using Microsoft.EntityFrameworkCore;
using Whiteboard.Data.Entities;

namespace Whiteboard.Data
{
    public class WhiteboardDbContext : DbContext
    {
        public WhiteboardDbContext(DbContextOptions<WhiteboardDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<Stroke> Strokes => Set<Stroke>();
        public DbSet<TextChange> TextChanges => Set<TextChange>();

        public DbSet<FileDocument> FileDocuments => Set<FileDocument>();



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Owner)
                .WithMany(u => u.Documents)
                .HasForeignKey(d => d.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Stroke>()
                .HasOne(s => s.Document)
                .WithMany(d => d.Strokes)
                .HasForeignKey(s => s.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TextChange>()
                .HasOne(t => t.Document)
                .WithMany(d => d.TextChanges)
                .HasForeignKey(t => t.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);


            // ✅ FileDocument relationship
            modelBuilder.Entity<FileDocument>()
                .HasOne(fd => fd.Owner)
                .WithMany(u => u.FileDocuments)
                .HasForeignKey(fd => fd.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileDocument>()
                .HasOne(fd => fd.Document)
                .WithMany(d => d.FileDocuments)
                .HasForeignKey(fd => fd.DocumentId)
                .OnDelete(DeleteBehavior.SetNull);

        }
    }
}
