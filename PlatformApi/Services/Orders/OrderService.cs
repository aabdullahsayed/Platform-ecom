using PlatformApi.DTOs.Orders;
using PlatformApi.Repositories;

namespace PlatformApi.Services.Orders;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(
        IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }


    // =====================================================
    // GET ORDER HISTORY
    // =====================================================

    public async Task<List<OrderResponse>> GetOrdersAsync(
        int userId,
        int page,
        int pageSize)
    {
        // Validate pagination

        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1)
        {
            pageSize = 10;
        }

        if (pageSize > 100)
        {
            pageSize = 100;
        }


        // Get orders

        var orders =
            await _orderRepository.GetUserOrdersAsync(
                userId,
                page,
                pageSize);


        // Convert Order -> OrderResponse

        return orders
            .Select(MapToResponse)
            .ToList();
    }


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    public async Task<OrderResponse?> GetOrderAsync(
        int userId,
        int orderId)
    {
        var order =
            await _orderRepository.GetUserOrderByIdAsync(
                orderId,
                userId);

        if (order == null)
        {
            return null;
        }

        return MapToResponse(order);
    }


    // =====================================================
    // TRACK ORDER
    // =====================================================

    public async Task<OrderResponse?> TrackOrderAsync(
        int userId,
        int orderId)
    {
        var order =
            await _orderRepository.GetUserOrderByIdAsync(
                orderId,
                userId);

        if (order == null)
        {
            return null;
        }

        return MapToResponse(order);
    }


    // =====================================================
    // MAPPER
    // =====================================================

    private static OrderResponse MapToResponse(
        Models.Order order)
    {
        var items = order.Items
            .Select(item =>
                new OrderItemResponse(
                    item.Id,
                    item.ProductId,
                    item.ProductName,
                    item.Quantity,
                    item.UnitPrice,
                    item.TotalPrice
                ))
            .ToList();


        return new OrderResponse(
            order.Id,
            order.Status,
            order.TotalAmount,
            order.DiscountAmount,
            order.FinalAmount,
            order.ShippingAddress,
            order.PaymentIntentId,
            order.CreatedAt,
            order.UpdatedAt,
            items
        );
    }
}