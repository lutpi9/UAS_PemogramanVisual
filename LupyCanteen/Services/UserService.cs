using LupyCanteen.Data;
using LupyCanteen.Models;
using LupyCanteen.Models.DTOs;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

namespace LupyCanteen.Services
{
    public class UserService : IUserService
    {
        private readonly MongoDbContext _context;

        public UserService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Find(u => u.Username == loginDto.Username && u.IsActive)
                .FirstOrDefaultAsync();

            if (user == null || !VerifyPassword(loginDto.Password, user.Password))
            {
                return null;
            }

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);

            return new LoginResponseDto
            {
                Token = GenerateToken(user), // Simple token for demo
                UserId = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role,
                Email = user.Email
            };
        }

        public async Task<User> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Check if username or email already exists
            var existingUser = await _context.Users
                .Find(u => u.Username == createUserDto.Username || u.Email == createUserDto.Email)
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                throw new InvalidOperationException("Username atau email sudah digunakan");
            }

            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                Password = HashPassword(createUserDto.Password),
                FullName = createUserDto.FullName,
                Role = createUserDto.Role,
                Phone = createUserDto.Phone,
                Address = createUserDto.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.Users.InsertOneAsync(user);
            return user;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Find(_ => true)
                .SortByDescending(u => u.CreatedAt)
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _context.Users
                .Find(u => u.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Find(u => u.Username == username)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> UpdateUserAsync(string id, UpdateUserDto updateUserDto)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return null;

            user.Email = updateUserDto.Email;
            user.FullName = updateUserDto.FullName;
            user.Role = updateUserDto.Role;
            user.Phone = updateUserDto.Phone;
            user.Address = updateUserDto.Address;
            user.IsActive = updateUserDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.Users.ReplaceOneAsync(u => u.Id == id, user);
            return user;
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var result = await _context.Users.DeleteOneAsync(u => u.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<bool> ChangePasswordAsync(string id, string newPassword)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            user.Password = HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.Users.ReplaceOneAsync(u => u.Id == id, user);
            return true;
        }

        public async Task<Dictionary<string, object>> GetUserStatisticsAsync()
        {
            var totalUsers = await _context.Users.CountDocumentsAsync(_ => true);
            var activeUsers = await _context.Users.CountDocumentsAsync(u => u.IsActive);
            var adminCount = await _context.Users.CountDocumentsAsync(u => u.Role == "Admin");
            var kasirCount = await _context.Users.CountDocumentsAsync(u => u.Role == "Kasir");
            var userCount = await _context.Users.CountDocumentsAsync(u => u.Role == "User");

            var recentUsers = await _context.Users
                .Find(_ => true)
                .SortByDescending(u => u.CreatedAt)
                .Limit(5)
                .ToListAsync();

            return new Dictionary<string, object>
            {
                ["totalUsers"] = totalUsers,
                ["activeUsers"] = activeUsers,
                ["inactiveUsers"] = totalUsers - activeUsers,
                ["adminCount"] = adminCount,
                ["kasirCount"] = kasirCount,
                ["userCount"] = userCount,
                ["recentUsers"] = recentUsers.Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role,
                    u.CreatedAt
                })
            };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "LupyCanteen_Salt"));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return HashPassword(password) == hashedPassword;
        }

        private string GenerateToken(User user)
        {
            // Simple token for demo - in production use JWT
            var tokenData = $"{user.Id}:{user.Username}:{user.Role}:{DateTime.UtcNow.Ticks}";
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenData));
        }
    }
}