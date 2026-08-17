using PlatformApi.DTOs.Users;
using PlatformApi.Models;
using PlatformApi.Repositories;

namespace PlatformApi.Services.Users;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IAddressRepository _addressRepository;

    public UserService(
        IUserRepository userRepository,
        IAddressRepository addressRepository)
    {
        _userRepository = userRepository;
        _addressRepository = addressRepository;
    }

    public async Task<ProfileResponse?>
        GetProfileAsync(int userId)
    {
        var user =
            await _userRepository
                .GetByIdAsync(userId);

        if (user == null)
            return null;

        return new ProfileResponse(
            user.Id,
            user.Name,
            user.Email,
            user.Role.ToString());
    }

    public async Task<ProfileResponse?>
        UpdateProfileAsync(
            int userId,
            UpdateProfileRequest request)
    {
        var user =
            await _userRepository
                .GetByIdAsync(userId);

        if (user == null)
            return null;

        if (string.IsNullOrWhiteSpace(
                request.Name))
        {
            throw new ArgumentException(
                "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Email))
        {
            throw new ArgumentException(
                "Email is required.");
        }

        user.Name = request.Name.Trim();
        user.Email = request.Email.Trim();

        await _userRepository
            .UpdateAsync(user);

        await _userRepository
            .SaveChangesAsync();

        return new ProfileResponse(
            user.Id,
            user.Name,
            user.Email,
            user.Role.ToString());
    }

    public async Task<List<AddressResponse>>
        GetAddressesAsync(int userId)
    {
        var addresses =
            await _addressRepository
                .GetByUserIdAsync(userId);

        return addresses
            .Select(MapAddress)
            .ToList();
    }

    public async Task<AddressResponse>
        AddAddressAsync(
            int userId,
            AddressRequest request)
    {
        if (request.IsDefault)
        {
            await _addressRepository
                .ClearDefaultAsync(userId);
        }

        var address = new Address
        {
            UserId = userId,

            FullName = request.FullName,

            Phone = request.Phone,

            AddressLine = request.AddressLine,

            City = request.City,

            State = request.State,

            PostalCode = request.PostalCode,

            Country = request.Country,

            IsDefault = request.IsDefault,

            CreatedAt = DateTime.UtcNow
        };

        await _addressRepository
            .AddAsync(address);

        await _addressRepository
            .SaveChangesAsync();

        return MapAddress(address);
    }

    public async Task<bool>
        UpdateAddressAsync(
            int userId,
            int addressId,
            AddressRequest request)
    {
        var address =
            await _addressRepository
                .GetByIdAsync(
                    addressId,
                    userId);

        if (address == null)
            return false;

        if (request.IsDefault)
        {
            await _addressRepository
                .ClearDefaultAsync(userId);
        }

        address.FullName = request.FullName;

        address.Phone = request.Phone;

        address.AddressLine =
            request.AddressLine;

        address.City = request.City;

        address.State = request.State;

        address.PostalCode =
            request.PostalCode;

        address.Country =
            request.Country;

        address.IsDefault =
            request.IsDefault;

        await _addressRepository
            .UpdateAsync(address);

        await _addressRepository
            .SaveChangesAsync();

        return true;
    }

    public async Task<bool>
        DeleteAddressAsync(
            int userId,
            int addressId)
    {
        var address =
            await _addressRepository
                .GetByIdAsync(
                    addressId,
                    userId);

        if (address == null)
            return false;

        await _addressRepository
            .DeleteAsync(address);

        await _addressRepository
            .SaveChangesAsync();

        return true;
    }

    private static AddressResponse
        MapAddress(Address address)
    {
        return new AddressResponse(
            address.Id,
            address.FullName,
            address.Phone,
            address.AddressLine,
            address.City,
            address.State,
            address.PostalCode,
            address.Country,
            address.IsDefault);
    }
}