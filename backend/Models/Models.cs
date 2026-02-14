using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MediaPortal.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Article", "Video", "Question"
    }

    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public int Views { get; set; }
        public List<string> Tags { get; set; } = new();
    }

    public class Video
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public string Author { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public int Views { get; set; }
        public TimeSpan Duration { get; set; }
        public List<string> Tags { get; set; } = new();
    }

    public class Question
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public DateTime AskedDate { get; set; }
        public int Views { get; set; }
        public List<string> Tags { get; set; } = new();
        public List<Answer> Answers { get; set; } = new();
    }

    public class Answer
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        [JsonIgnore]
        public Question? Question { get; set; } // Added nav prop just in case, limiting loop with JsonIgnore
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime AnsweredDate { get; set; }
        public int Votes { get; set; }
        public bool IsAccepted { get; set; }
    }

    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public int EntityId { get; set; }
        public string EntityType { get; set; } = string.Empty; // "Article", "Video", "Question"
    }
}
