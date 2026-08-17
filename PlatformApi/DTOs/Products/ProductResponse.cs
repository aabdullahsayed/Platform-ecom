using PlatformApi.Models;

namespace PlatformApi.DTOs.Products;

public record ProductResponse
(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    int CategoryId,
    string CategoryName,
    int SellerId,
    string SellerName,
    List<string> Images,
    ProductStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);