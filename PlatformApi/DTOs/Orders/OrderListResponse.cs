namespace PlatformApi.DTOs.Orders;

public record OrderListResponse(
    List<OrderResponse> Orders,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages
);