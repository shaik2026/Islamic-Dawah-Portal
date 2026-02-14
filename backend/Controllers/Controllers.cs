using Microsoft.AspNetCore.Mvc;
using MediaPortal.Models;
using MediaPortal.Services;

namespace MediaPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticles()
        {
            var articles = await _articleService.GetAllArticlesAsync();
            return Ok(articles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(int id)
        {
            var article = await _articleService.GetArticleByIdAsync(id);
            if (article == null)
                return NotFound();

            return Ok(article);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticlesByCategory(string category)
        {
            var articles = await _articleService.GetArticlesByCategoryAsync(category);
            return Ok(articles);
        }

        [HttpPost]
        public async Task<ActionResult<Article>> CreateArticle(Article article)
        {
            var createdArticle = await _articleService.CreateArticleAsync(article);
            return CreatedAtAction(nameof(GetArticle), new { id = createdArticle.Id }, createdArticle);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Article>> UpdateArticle(int id, Article article)
        {
            var updatedArticle = await _articleService.UpdateArticleAsync(id, article);
            if (updatedArticle == null)
                return NotFound();

            return Ok(updatedArticle);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteArticle(int id)
        {
            var result = await _articleService.DeleteArticleAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly IVideoService _videoService;

        public VideosController(IVideoService videoService)
        {
            _videoService = videoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetAllVideos()
        {
            var videos = await _videoService.GetAllVideosAsync();
            return Ok(videos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Video>> GetVideo(int id)
        {
            var video = await _videoService.GetVideoByIdAsync(id);
            if (video == null)
                return NotFound();

            return Ok(video);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Video>>> GetVideosByCategory(string category)
        {
            var videos = await _videoService.GetVideosByCategoryAsync(category);
            return Ok(videos);
        }

        [HttpPost]
        public async Task<ActionResult<Video>> CreateVideo(Video video)
        {
            var createdVideo = await _videoService.CreateVideoAsync(video);
            return CreatedAtAction(nameof(GetVideo), new { id = createdVideo.Id }, createdVideo);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Video>> UpdateVideo(int id, Video video)
        {
            var updatedVideo = await _videoService.UpdateVideoAsync(id, video);
            if (updatedVideo == null)
                return NotFound();

            return Ok(updatedVideo);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVideo(int id)
        {
            var result = await _videoService.DeleteVideoAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly IQnAService _qnaService;

        public QuestionsController(IQnAService qnaService)
        {
            _qnaService = qnaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            var questions = await _qnaService.GetAllQuestionsAsync();
            return Ok(questions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _qnaService.GetQuestionByIdAsync(id);
            if (question == null)
                return NotFound();

            return Ok(question);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategory(string category)
        {
            var questions = await _qnaService.GetQuestionsByCategoryAsync(category);
            return Ok(questions);
        }

        [HttpPost]
        public async Task<ActionResult<Question>> CreateQuestion(Question question)
        {
            var createdQuestion = await _qnaService.CreateQuestionAsync(question);
            return CreatedAtAction(nameof(GetQuestion), new { id = createdQuestion.Id }, createdQuestion);
        }

        [HttpPost("{id}/answers")]
        public async Task<ActionResult<Answer>> AddAnswer(int id, Answer answer)
        {
            try
            {
                var createdAnswer = await _qnaService.AddAnswerAsync(id, answer);
                return Ok(createdAnswer);
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }

        [HttpPut("{questionId}/answers/{answerId}/accept")]
        public async Task<ActionResult<Answer>> AcceptAnswer(int questionId, int answerId)
        {
            var answer = await _qnaService.AcceptAnswerAsync(questionId, answerId);
            if (answer == null)
                return NotFound();

            return Ok(answer);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuestion(int id)
        {
            var result = await _qnaService.DeleteQuestionAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
