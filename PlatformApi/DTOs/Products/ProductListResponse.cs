namespace PlatformApi.DTOs.Products;

public record ProductListResponse
(
    List<ProductResponse> Products,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages
);