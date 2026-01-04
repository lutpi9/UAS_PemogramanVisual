using LupyCanteen.Models.DTOs;
using LupyCanteen.Services;
using Microsoft.AspNetCore.Mvc;

namespace LupyCanteen.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                var userList = users.Select(u => new {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Role,
                    u.Phone,
                    u.Address,
                    u.IsActive,
                    u.CreatedAt,
                    u.LastLogin
                });

                return Ok(new { 
                    success = true, 
                    data = userList,
                    total = users.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil data user", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User tidak ditemukan" });
                }

                return Ok(new { 
                    success = true, 
                    data = new {
                        user.Id,
                        user.Username,
                        user.Email,
                        user.FullName,
                        user.Role,
                        user.Phone,
                        user.Address,
                        user.IsActive,
                        user.CreatedAt,
                        user.LastLogin
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil data user", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(createUserDto);
                return Ok(new { 
                    success = true, 
                    message = "User berhasil dibuat", 
                    data = new { 
                        user.Id, 
                        user.Username, 
                        user.FullName, 
                        user.Email, 
                        user.Role 
                    } 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal membuat user", 
                    error = ex.Message 
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, updateUserDto);
                if (user == null)
                {
                    return NotFound(new { message = "User tidak ditemukan" });
                }

                return Ok(new { 
                    success = true, 
                    message = "User berhasil diupdate", 
                    data = new {
                        user.Id,
                        user.Username,
                        user.Email,
                        user.FullName,
                        user.Role,
                        user.Phone,
                        user.Address,
                        user.IsActive
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengupdate user", 
                    error = ex.Message 
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            try
            {
                var success = await _userService.DeleteUserAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "User tidak ditemukan" });
                }

                return Ok(new { 
                    success = true, 
                    message = "User berhasil dihapus" 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal menghapus user", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("statistics")]
        public async Task<ActionResult> GetUserStatistics()
        {
            try
            {
                var stats = await _userService.GetUserStatisticsAsync();
                return Ok(new { 
                    success = true, 
                    data = stats 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil statistik user", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost("{id}/change-password")]
        public async Task<ActionResult> ChangePassword(string id, [FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var result = await _userService.ChangePasswordAsync(id, changePasswordDto.NewPassword);
                if (!result)
                {
                    return NotFound(new { success = false, message = "User tidak ditemukan" });
                }
                return Ok(new { success = true, message = "Password berhasil diubah" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengubah password", 
                    error = ex.Message 
                });
            }
        }
    }
}