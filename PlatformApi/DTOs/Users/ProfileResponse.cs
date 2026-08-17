namespace PlatformApi.DTOs.Users;

public record ProfileResponse(
    int Id,
    string Name,
    string Email,
    string Role
);