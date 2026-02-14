using System.ComponentModel.DataAnnotations;

namespace MediaPortal.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty; // In a real app, this would be a hash
        
        public string Name { get; set; } = string.Empty;
        
        public string Role { get; set; } = "User"; // Default role
    }
}
