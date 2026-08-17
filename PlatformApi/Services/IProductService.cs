using PlatformApi.DTOs.Products;

namespace PlatformApi.Services;

public interface IProductService
{
    Task<ProductResponse?> GetByIdAsync(
        int id);

    Task<ProductListResponse> GetAllAsync(
        int page,
        int pageSize,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice);

    Task<List<ProductResponse>>
        GetSellerProductsAsync(
            int sellerId);

    Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        int sellerId);

    Task<bool> UpdateAsync(
        int productId,
        UpdateProductRequest request,
        int userId,
        bool isAdmin);

    Task<bool> DeleteAsync(
        int productId,
        int userId,
        bool isAdmin);
    
    Task<List<ProductResponse>> SearchAsync(
        string query,
        int limit = 5);
}