using LupyCanteen.Models.DTOs;
using LupyCanteen.Services;
using Microsoft.AspNetCore.Mvc;

namespace LupyCanteen.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _userService.LoginAsync(loginDto);
                if (result == null)
                {
                    return Unauthorized(new { message = "Username atau password salah" });
                }

                return Ok(new { 
                    success = true, 
                    message = "Login berhasil", 
                    data = result 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Login gagal", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(createUserDto);
                return Ok(new { 
                    success = true, 
                    message = "Registrasi berhasil", 
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
                    message = "Registrasi gagal", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var success = await _userService.ChangePasswordAsync(changePasswordDto.UserId, changePasswordDto.NewPassword);
                if (!success)
                {
                    return NotFound(new { message = "User tidak ditemukan" });
                }

                return Ok(new { 
                    success = true, 
                    message = "Password berhasil diubah" 
                });
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

    public class ChangePasswordDto
    {
        public string UserId { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}