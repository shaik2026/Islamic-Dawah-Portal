using MediaPortal.Models;

namespace MediaPortal.Services
{
    public interface IArticleService
    {
        Task<IEnumerable<Article>> GetAllArticlesAsync();
        Task<Article?> GetArticleByIdAsync(int id);
        Task<IEnumerable<Article>> GetArticlesByCategoryAsync(string category);
        Task<Article> CreateArticleAsync(Article article);
        Task<Article?> UpdateArticleAsync(int id, Article article);
        Task<bool> DeleteArticleAsync(int id);
    }

    public interface IVideoService
    {
        Task<IEnumerable<Video>> GetAllVideosAsync();
        Task<Video?> GetVideoByIdAsync(int id);
        Task<IEnumerable<Video>> GetVideosByCategoryAsync(string category);
        Task<Video> CreateVideoAsync(Video video);
        Task<Video?> UpdateVideoAsync(int id, Video video);
        Task<bool> DeleteVideoAsync(int id);
    }

    public interface IQnAService
    {
        Task<IEnumerable<Question>> GetAllQuestionsAsync();
        Task<Question?> GetQuestionByIdAsync(int id);
        Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(string category);
        Task<Question> CreateQuestionAsync(Question question);
        Task<Answer> AddAnswerAsync(int questionId, Answer answer);
        Task<Answer?> AcceptAnswerAsync(int questionId, int answerId);
        Task<bool> DeleteQuestionAsync(int id);
    }
}
