using Microsoft.AspNetCore.Http;
using PlatformApi.Models;

namespace PlatformApi.DTOs.Products;

public record CreateProductRequest
(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    int CategoryId,
    List<IFormFile>? Images,
    ProductStatus Status
);