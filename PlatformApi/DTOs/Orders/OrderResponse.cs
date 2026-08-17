using PlatformApi.Models.Enums;

namespace PlatformApi.DTOs.Orders;

public record OrderResponse(
    int Id,
    OrderStatus Status,
    decimal TotalAmount,
    decimal DiscountAmount,
    decimal FinalAmount,
    string ShippingAddress,
    string? PaymentIntentId,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<OrderItemResponse> Items
);