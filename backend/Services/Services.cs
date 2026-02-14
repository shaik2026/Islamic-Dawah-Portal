using Microsoft.EntityFrameworkCore;
using MediaPortal.Data;
using MediaPortal.Models;

namespace MediaPortal.Services
{
    public class ArticleService : IArticleService
    {
        private readonly MediaPortalContext _context;

        public ArticleService(MediaPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Article>> GetAllArticlesAsync()
        {
            return await _context.Articles
                .Include(a => a.Category)
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync();
        }

        public async Task<Article?> GetArticleByIdAsync(int id)
        {
            var article = await _context.Articles
                .Include(a => a.Category)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (article != null)
            {
                article.Views++;
                await _context.SaveChangesAsync();
            }
            return article;
        }

        public async Task<IEnumerable<Article>> GetArticlesByCategoryAsync(string category)
        {
            return await _context.Articles
                .Include(a => a.Category)
                .Where(a => a.Category.Name == category)
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync();
        }

        public async Task<Article> CreateArticleAsync(Article article)
        {
            article.PublishedDate = DateTime.Now;
            article.Views = 0;
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<Article?> UpdateArticleAsync(int id, Article article)
        {
            var existingArticle = await _context.Articles.FindAsync(id);
            if (existingArticle == null)
                return null;

            existingArticle.Title = article.Title;
            existingArticle.Content = article.Content;
            existingArticle.Author = article.Author;
            existingArticle.CategoryId = article.CategoryId;
            existingArticle.ImageUrl = article.ImageUrl;
            existingArticle.Tags = article.Tags;

            await _context.SaveChangesAsync();
            return existingArticle;
        }

        public async Task<bool> DeleteArticleAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
                return false;

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class VideoService : IVideoService
    {
        private readonly MediaPortalContext _context;

        public VideoService(MediaPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Video>> GetAllVideosAsync()
        {
            return await _context.Videos
                .Include(v => v.Category)
                .OrderByDescending(v => v.PublishedDate)
                .ToListAsync();
        }

        public async Task<Video?> GetVideoByIdAsync(int id)
        {
            var video = await _context.Videos
                .Include(v => v.Category)
                .FirstOrDefaultAsync(v => v.Id == id);
            if (video != null)
            {
                video.Views++;
                await _context.SaveChangesAsync();
            }
            return video;
        }

        public async Task<IEnumerable<Video>> GetVideosByCategoryAsync(string category)
        {
            return await _context.Videos
                .Include(v => v.Category)
                .Where(v => v.Category.Name == category)
                .OrderByDescending(v => v.PublishedDate)
                .ToListAsync();
        }

        public async Task<Video> CreateVideoAsync(Video video)
        {
            video.PublishedDate = DateTime.Now;
            video.Views = 0;
            _context.Videos.Add(video);
            await _context.SaveChangesAsync();
            return video;
        }

        public async Task<Video?> UpdateVideoAsync(int id, Video video)
        {
            var existingVideo = await _context.Videos.FindAsync(id);
            if (existingVideo == null)
                return null;

            existingVideo.Title = video.Title;
            existingVideo.Description = video.Description;
            existingVideo.VideoUrl = video.VideoUrl;
            existingVideo.ThumbnailUrl = video.ThumbnailUrl;
            existingVideo.CategoryId = video.CategoryId;
            existingVideo.Author = video.Author;
            existingVideo.Duration = video.Duration;
            existingVideo.Tags = video.Tags;

            await _context.SaveChangesAsync();
            return existingVideo;
        }

        public async Task<bool> DeleteVideoAsync(int id)
        {
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
                return false;

            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class QnAService : IQnAService
    {
        private readonly MediaPortalContext _context;

        public QnAService(MediaPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
        {
            return await _context.Questions
                .Include(q => q.Category)
                .Include(q => q.Answers)
                .OrderByDescending(q => q.AskedDate)
                .ToListAsync();
        }

        public async Task<Question?> GetQuestionByIdAsync(int id)
        {
            var question = await _context.Questions
                .Include(q => q.Category)
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);
            
            if (question != null)
            {
                question.Views++;
                await _context.SaveChangesAsync();
            }
            return question;
        }

        public async Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(string category)
        {
            return await _context.Questions
                .Include(q => q.Category)
                .Include(q => q.Answers)
                .Where(q => q.Category.Name == category)
                .OrderByDescending(q => q.AskedDate)
                .ToListAsync();
        }

        public async Task<Question> CreateQuestionAsync(Question question)
        {
            question.AskedDate = DateTime.Now;
            question.Views = 0;
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<Answer> AddAnswerAsync(int questionId, Answer answer)
        {
            var question = await _context.Questions.FindAsync(questionId);
            if (question == null)
                throw new InvalidOperationException("Question not found");

            answer.QuestionId = questionId;
            answer.AnsweredDate = DateTime.Now;
            answer.Votes = 0;
            answer.IsAccepted = false;

            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            return answer;
        }

        public async Task<Answer?> AcceptAnswerAsync(int questionId, int answerId)
        {
            var question = await _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
                return null;

            // Unmark all previous accepted answers
            foreach (var ans in question.Answers)
            {
                ans.IsAccepted = false;
            }

            var answer = question.Answers.FirstOrDefault(a => a.Id == answerId);
            if (answer != null)
            {
                answer.IsAccepted = true;
                await _context.SaveChangesAsync();
            }

            return answer;
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
                return false;

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
