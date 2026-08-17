using PlatformApi.Models;

namespace PlatformApi.Repositories;

public interface IUserRepository
{
    // =========================================
    // EXISTING
    // =========================================

    Task<User?> GetByEmailAsync(string email);

    Task AddAsync(User user);


    // =========================================
    // PROFILE
    // =========================================

    Task<User?> GetByIdAsync(int userId);

    Task UpdateAsync(User user);


    // =========================================
    // ADDRESSES
    // =========================================

    Task<List<Address>> GetAddressesAsync(
        int userId);

    Task<Address?> GetAddressByIdAsync(
        int addressId,
        int userId);

    Task AddAddressAsync(
        Address address);

    Task UpdateAddressAsync(
        Address address);

    Task DeleteAddressAsync(
        Address address);


    // =========================================
    // ORDERS
    // =========================================

    Task<List<Order>> GetOrdersAsync(
        int userId,
        int page,
        int pageSize,
        string? status = null);

    Task<int> GetOrderCountAsync(
        int userId,
        string? status = null);

    Task<Order?> GetOrderByIdAsync(
        int orderId,
        int userId);

    // =========================================
    // SAVE
    // =========================================

    Task SaveChangesAsync();
}