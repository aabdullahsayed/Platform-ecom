using PlatformApi.Models;

namespace PlatformApi.DTOs.Products;

public record UpdateProductRequest
(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    int CategoryId,
    ProductStatus Status
);