using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediaPortal.Data;
using MediaPortal.Models;
using Microsoft.AspNetCore.Authorization;

namespace MediaPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly MediaPortalContext _context;

        public CategoriesController(MediaPortalContext context)
        {
            _context = context;
        }

        // GET: api/Categories?type=Article
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] string? type)
        {
            var query = _context.Categories.AsQueryable();

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(c => c.Type == type);
            }

            return await query.ToListAsync();
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // POST: api/Categories
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
