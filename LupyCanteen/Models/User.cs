using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace LupyCanteen.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [BsonElement("username")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [BsonElement("fullName")]
        public string FullName { get; set; } = string.Empty;

        [BsonElement("role")]
        public string Role { get; set; } = "User"; // Admin, Kasir, User

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("address")]
        public string Address { get; set; } = string.Empty;

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("lastLogin")]
        public DateTime? LastLogin { get; set; }
    }
}