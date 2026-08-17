using PlatformApi.Models;

namespace PlatformApi.Repositories;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id);

    Task<List<Product>> GetBySellerAsync(int sellerId);

    Task<List<Product>> GetAllAsync(
        int page,
        int pageSize,
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null);

    Task<int> GetTotalCountAsync(
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null);

    Task<bool> CategoryExistsAsync(int categoryId);

        Task<List<Product>> SearchByEmbeddingAsync(
            float[] queryEmbedding,
            int limit = 5);
    Task AddAsync(Product product);

    Task UpdateAsync(Product product);

    Task SaveChangesAsync();
}