using PlatformApi.Models;

namespace PlatformApi.Repositories;

public interface IAddressRepository
{
    Task<List<Address>> GetByUserIdAsync(
        int userId);

    Task<Address?> GetByIdAsync(
        int addressId,
        int userId);

    Task AddAsync(Address address);

    Task UpdateAsync(Address address);

    Task DeleteAsync(Address address);

    Task ClearDefaultAsync(int userId);

    Task SaveChangesAsync();
}