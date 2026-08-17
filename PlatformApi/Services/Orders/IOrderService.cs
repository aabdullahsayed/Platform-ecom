using PlatformApi.DTOs.Orders;

namespace PlatformApi.Services.Orders;

public interface IOrderService
{
    // =====================================================
    // GET ORDER HISTORY
    // =====================================================

    Task<List<OrderResponse>> GetOrdersAsync(
        int userId,
        int page,
        int pageSize);


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    Task<OrderResponse?> GetOrderAsync(
        int userId,
        int orderId);


    // =====================================================
    // TRACK ORDER
    // =====================================================

    Task<OrderResponse?> TrackOrderAsync(
        int userId,
        int orderId);
}