using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlatformApi.DTOs.Users;
using PlatformApi.Services.Users;

namespace PlatformApi.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(
        IUserService userService)
    {
        _userService = userService;
    }

    // =========================================
    // GET PROFILE
    // =========================================

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();

        var profile =
            await _userService
                .GetProfileAsync(userId);

        if (profile == null)
            return NotFound();

        return Ok(profile);
    }


    // =========================================
    // UPDATE PROFILE
    // =========================================

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileRequest request)
    {
        try
        {
            var userId = GetUserId();

            var profile =
                await _userService
                    .UpdateProfileAsync(
                        userId,
                        request);

            if (profile == null)
                return NotFound();

            return Ok(profile);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    // =========================================
    // GET ADDRESSES
    // =========================================

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = GetUserId();

        var addresses =
            await _userService
                .GetAddressesAsync(userId);

        return Ok(addresses);
    }


    // =========================================
    // ADD ADDRESS
    // =========================================

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress(
        [FromBody] AddressRequest request)
    {
        try
        {
            var userId = GetUserId();

            var address =
                await _userService
                    .AddAddressAsync(
                        userId,
                        request);

            return Ok(address);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    // =========================================
    // UPDATE ADDRESS
    // =========================================

    [HttpPut("addresses/{id:int}")]
    public async Task<IActionResult> UpdateAddress(
        int id,
        [FromBody] AddressRequest request)
    {
        var userId = GetUserId();

        var updated =
            await _userService
                .UpdateAddressAsync(
                    userId,
                    id,
                    request);

        if (!updated)
            return NotFound();

        return NoContent();
    }


    // =========================================
    // DELETE ADDRESS
    // =========================================

    [HttpDelete("addresses/{id:int}")]
    public async Task<IActionResult> DeleteAddress(
        int id)
    {
        var userId = GetUserId();

        var deleted =
            await _userService
                .DeleteAddressAsync(
                    userId,
                    id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }


    // =========================================
    // USER ID
    // =========================================

    private int GetUserId()
    {
        var claim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(claim))
            throw new UnauthorizedAccessException();

        if (!int.TryParse(
                claim,
                out var userId))
        {
            throw new UnauthorizedAccessException();
        }

        return userId;
    }
}