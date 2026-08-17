using PlatformApi.DTOs;
using PlatformApi.Models;

namespace PlatformApi.Services;

public interface IAuthService
{
    Task<User?> ValidateUserAsync(LoginRequest request);
}