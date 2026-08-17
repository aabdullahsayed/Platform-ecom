using PlatformApi.Models;

namespace PlatformApi.Repositories;

public interface IOrderRepository
{
    Task<List<Order>> GetUserOrdersAsync(
        int userId,
        int page,
        int pageSize);

    Task<Order?> GetUserOrderByIdAsync(
        int userId,
        int orderId);

    Task<Order?> GetByIdAsync(
        int orderId);

    Task AddAsync(
        Order order);

    Task UpdateAsync(
        Order order);

    Task DeleteAsync(
        Order order);

    Task<bool> ExistsAsync(
        int orderId);

    Task<bool> UserOwnsOrderAsync(
        int userId,
        int orderId);

    Task<int> GetUserOrderCountAsync(
        int userId);

    Task SaveChangesAsync();
}