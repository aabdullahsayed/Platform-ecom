using PlatformApi.DTOs;
using PlatformApi.Models;
using PlatformApi.Repositories;

namespace PlatformApi.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User?> ValidateUserAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.email);

        if (user == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(
                request.password,
                user.Password))
        {
            return null;
        }

        return user;
    }
}