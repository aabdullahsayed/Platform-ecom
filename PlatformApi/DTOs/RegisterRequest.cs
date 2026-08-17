namespace PlatformApi.DTOs;
using PlatformApi.Models;

public record RegisterRequest(
    string Name,
    string Email,
    string Password,
    Role role
);