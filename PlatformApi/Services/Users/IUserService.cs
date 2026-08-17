using PlatformApi.DTOs.Users;

namespace PlatformApi.Services.Users;

public interface IUserService
{
    Task<ProfileResponse?> GetProfileAsync(int userId);

    Task<ProfileResponse?> UpdateProfileAsync(
        int userId,
        UpdateProfileRequest request);

    Task<List<AddressResponse>> GetAddressesAsync(
        int userId);

    Task<AddressResponse> AddAddressAsync(
        int userId,
        AddressRequest request);

    Task<bool> UpdateAddressAsync(
        int userId,
        int addressId,
        AddressRequest request);

    Task<bool> DeleteAddressAsync(
        int userId,
        int addressId);
}