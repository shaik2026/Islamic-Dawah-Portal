using Microsoft.AspNetCore.Mvc;
using MediaPortal.Data;
using MediaPortal.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace MediaPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MediaPortalContext _context;
        private readonly string _secretKey;

        public AuthController(MediaPortalContext context, IConfiguration configuration)
        {
            _context = context;
            _secretKey = configuration["Jwt:Key"] ?? "SecretKeyForDemoJustForTesting123!";
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            var user = new User
            {
                Username = request.Username,
                Password = HashPassword(request.Password),
                Name = request.Name,
                Role = "User" // Default role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var hashedPassword = HashPassword(request.Password);
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == hashedPassword);

            if (user == null)
            {
                // Fallback for the hardcoded admin if database is empty/reset
                if (request.Username == "admin" && request.Password == "admin123")
                {
                    var adminUser = new User 
                    { 
                        Username = "admin", 
                        Role = "Admin", // CRITICAL: Capitalized role
                        Name = "Admin User"
                    };
                    var adminToken = GenerateJwtToken(adminUser);
                    
                    return Ok(new { 
                        token = adminToken, 
                        user = new { 
                            username = "admin", 
                            role = "Admin",
                            name = "Admin User"
                        } 
                    });
                }

                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { 
                token = token, 
                user = new { 
                    username = user.Username, 
                    role = user.Role,
                    name = user.Name
                } 
            });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
