using LupyCanteen.Models;
using LupyCanteen.Models.DTOs;

namespace LupyCanteen.Services
{
    public interface IUserService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
        Task<User> CreateUserAsync(CreateUserDto createUserDto);
        Task<List<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> UpdateUserAsync(string id, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(string id);
        Task<bool> ChangePasswordAsync(string id, string newPassword);
        Task<Dictionary<string, object>> GetUserStatisticsAsync();
    }
}