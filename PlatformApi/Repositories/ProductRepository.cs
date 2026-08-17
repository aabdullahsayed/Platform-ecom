using Microsoft.EntityFrameworkCore;
using Pgvector;
using PlatformApi.Data;
using PlatformApi.Models;
using Pgvector.EntityFrameworkCore;

namespace PlatformApi.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }


    // =========================================
    // GET PRODUCT BY ID
    // =========================================

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products

            .Include(p => p.Category)

            .Include(p => p.Seller)

            .FirstOrDefaultAsync(
                p =>
                    p.Id == id &&
                    !p.IsDeleted);
    }


    // =========================================
    // GET SELLER PRODUCTS
    // =========================================

    public async Task<List<Product>> GetBySellerAsync(
        int sellerId)
    {
        return await _context.Products

            .Include(p => p.Category)

            .Include(p => p.Seller)

            .Where(
                p =>
                    p.SellerId == sellerId &&
                    !p.IsDeleted)

            .OrderByDescending(
                p => p.CreatedAt)

            .ToListAsync();
    }


    // =========================================
    // GET ALL PRODUCTS
    // WITH PAGINATION + FILTERING
    // =========================================

    public async Task<List<Product>> GetAllAsync(
        int page,
        int pageSize,
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null)
    {
        IQueryable<Product> query =
            _context.Products

                .Include(p => p.Category)

                .Include(p => p.Seller)

                .Where(p => !p.IsDeleted);


        // =========================================
        // CATEGORY FILTER
        // =========================================

        if (categoryId.HasValue)
        {
            query = query.Where(
                p =>
                    p.CategoryId ==
                    categoryId.Value);
        }


        // =========================================
        // MIN PRICE FILTER
        // =========================================

        if (minPrice.HasValue)
        {
            query = query.Where(
                p =>
                    p.Price >=
                    minPrice.Value);
        }


        // =========================================
        // MAX PRICE FILTER
        // =========================================

        if (maxPrice.HasValue)
        {
            query = query.Where(
                p =>
                    p.Price <=
                    maxPrice.Value);
        }


        // =========================================
        // PAGINATION
        // =========================================

        return await query

            .OrderByDescending(
                p => p.CreatedAt)

            .Skip(
                (page - 1) *
                pageSize)

            .Take(pageSize)

            .ToListAsync();
    }


    // =========================================
    // TOTAL COUNT
    // =========================================

    public async Task<int> GetTotalCountAsync(
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null)
    {
        IQueryable<Product> query =
            _context.Products

                .Where(p => !p.IsDeleted);


        // Category

        if (categoryId.HasValue)
        {
            query = query.Where(
                p =>
                    p.CategoryId ==
                    categoryId.Value);
        }


        // Minimum price

        if (minPrice.HasValue)
        {
            query = query.Where(
                p =>
                    p.Price >=
                    minPrice.Value);
        }


        // Maximum price

        if (maxPrice.HasValue)
        {
            query = query.Where(
                p =>
                    p.Price <=
                    maxPrice.Value);
        }


        return await query.CountAsync();
    }


    // =========================================
    // CATEGORY EXISTS
    // =========================================

    public async Task<bool> CategoryExistsAsync(
        int categoryId)
    {
        return await _context.Categories
            .AnyAsync(
                c =>
                    c.Id == categoryId);
    }


    // =========================================
    // ADD PRODUCT
    // =========================================

    public async Task AddAsync(
        Product product)
    {
        await _context.Products
            .AddAsync(product);
    }


    // =========================================
    // UPDATE PRODUCT
    // =========================================

    public Task UpdateAsync(
        Product product)
    {
        _context.Products
            .Update(product);

        return Task.CompletedTask;
    }
// =========================================
// VECTOR SIMILARITY SEARCH
// =========================================

    public async Task<List<Product>> SearchByEmbeddingAsync(
        float[] queryEmbedding,
        int limit = 5)
    {
        // Convert float[] into pgvector Vector
        var queryVector = new Vector(queryEmbedding);

        return await _context.Products

            .Include(p => p.Category)

            .Include(p => p.Seller)

            .Where(p =>
                !p.IsDeleted &&
                p.Embedding != null)

            // Smaller cosine distance = more similar
            .OrderBy(p =>
                p.Embedding!
                    .CosineDistance(queryVector))

            .Take(limit)

            .ToListAsync();
    }

    // =========================================
    // SAVE CHANGES
    // =========================================

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}