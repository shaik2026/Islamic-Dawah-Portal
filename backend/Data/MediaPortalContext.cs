using Microsoft.EntityFrameworkCore;
using MediaPortal.Models;

namespace MediaPortal.Data
{
    public class MediaPortalContext : DbContext
    {
        public MediaPortalContext(DbContextOptions<MediaPortalContext> options)
            : base(options)
        {
        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Article>()
                .Property(a => a.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<Video>()
                .Property(v => v.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<Question>()
                .Property(q => q.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<Question>()
                .HasMany(q => q.Answers)
                .WithOne()
                .HasForeignKey(a => a.QuestionId);
        }
    }
}
