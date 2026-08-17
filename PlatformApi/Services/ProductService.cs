using PlatformApi.DTOs.Products;
using PlatformApi.Models;
using PlatformApi.Repositories;
using PlatformApi.Services.Embedding;
using PlatformApi.Services.ImageStorage;

namespace PlatformApi.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IImageStorageService _imageStorageService;
    private readonly IEmbeddingService _embeddingService;
    public ProductService(
        IProductRepository productRepository,
        IImageStorageService imageStorageService,
        IEmbeddingService embeddingService)
    {
        _productRepository = productRepository;
        _imageStorageService = imageStorageService;
        _embeddingService = embeddingService;
    }

    // =========================================
    // GET ALL PRODUCTS
    // =========================================

    public async Task<ProductResponse?> GetByIdAsync(int id)
    {
        var product =
            await _productRepository.GetByIdAsync(id);

        if (product == null)
            return null;

        return MapToResponse(product);
    }

    // =========================================
    // GET ALL PRODUCTS
    // =========================================

    public async Task<ProductListResponse> GetAllAsync(
        int page,
        int pageSize,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice)
    {
        // =========================================
        // Validate pagination
        // =========================================

        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 20;

        if (pageSize > 100)
            pageSize = 100;


        // =========================================
        // Get products
        // =========================================

        var products =
            await _productRepository.GetAllAsync(
                page,
                pageSize,
                categoryId,
                minPrice,
                maxPrice);


        // =========================================
        // Get total number of products
        // =========================================

        var totalItems =
            await _productRepository.GetTotalCountAsync(
                categoryId,
                minPrice,
                maxPrice);


        // =========================================
        // Calculate total pages
        // =========================================

        var totalPages =
            (int)Math.Ceiling(
                (double)totalItems / pageSize);


        // =========================================
        // Convert Product -> ProductResponse
        // =========================================

        var productResponses =
            products
                .Select(MapToResponse)
                .ToList();


        // =========================================
        // Return strongly typed response
        // =========================================

        return new ProductListResponse(
            productResponses,
            page,
            pageSize,
            totalItems,
            totalPages
        );
    }

    // =========================================
    // GET SELLER PRODUCTS
    // =========================================

    public async Task<List<ProductResponse>>
        GetSellerProductsAsync(int sellerId)
    {
        var products =
            await _productRepository
                .GetBySellerAsync(sellerId);

        return products
            .Select(MapToResponse)
            .ToList();
    }

    // =========================================
    // CREATE PRODUCT
    // =========================================

    public async Task<ProductResponse> CreateAsync(
        CreateProductRequest request,
        int sellerId)
    {
        // =========================================
        // VALIDATE NAME
        // =========================================

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException(
                "Product name is required.");
        }

        if (request.Name.Length > 200)
        {
            throw new ArgumentException(
                "Product name cannot exceed 200 characters.");
        }

        // =========================================
        // VALIDATE DESCRIPTION
        // =========================================

        if (string.IsNullOrWhiteSpace(
                request.Description))
        {
            throw new ArgumentException(
                "Product description is required.");
        }

        // =========================================
        // VALIDATE PRICE
        // =========================================

        if (request.Price <= 0)
        {
            throw new ArgumentException(
                "Price must be greater than 0.");
        }

        // =========================================
        // VALIDATE STOCK
        // =========================================

        if (request.StockQuantity < 0)
        {
            throw new ArgumentException(
                "Stock quantity cannot be negative.");
        }

        // =========================================
        // VALIDATE IMAGES
        // =========================================

        var images =
            request.Images ?? new List<IFormFile>();

        if (images.Count > 5)
        {
            throw new ArgumentException(
                "Maximum 5 images are allowed.");
        }

        // =========================================
        // VALIDATE CATEGORY
        // =========================================

        var categoryExists =
            await _productRepository
                .CategoryExistsAsync(
                    request.CategoryId);

        if (!categoryExists)
        {
            throw new ArgumentException(
                "The specified category does not exist.");
        }

        // =========================================
        // SAVE IMAGES LOCALLY
        // =========================================

        var imageUrls =
            await _imageStorageService
                .SaveProductImagesAsync(images);

        // =========================================
        // CREATE PRODUCT
        // =========================================

        var product = new Product
        {
            Name = request.Name,

            Description = request.Description,

            Price = request.Price,

            StockQuantity =
                request.StockQuantity,

            CategoryId =
                request.CategoryId,

            SellerId =
                sellerId,

            Images =
                imageUrls,

            Status =
                request.Status,

            IsDeleted = false,

            CreatedAt =
                DateTime.UtcNow,

            UpdatedAt =
                DateTime.UtcNow
        };


// =========================================
// GENERATE EMBEDDING
// =========================================

        var embeddingText =
            $"{product.Name}. " +
            $"{product.Description}. " +
            $"Category: {product.CategoryId}.";

        var embedding =
            await _embeddingService
                .GenerateEmbeddingAsync(
                    embeddingText);

        product.Embedding =
            new Pgvector.Vector(embedding);
        // =========================================
        // SAVE PRODUCT
        // =========================================

        await _productRepository
            .AddAsync(product);

        await _productRepository
            .SaveChangesAsync();

        // =========================================
        // RETURN RESPONSE
        // =========================================

        return MapToResponse(product);
    }

    // =========================================
    // UPDATE PRODUCT
    // =========================================

    public async Task<bool> UpdateAsync(
        int productId,
        UpdateProductRequest request,
        int userId,
        bool isAdmin)
    {
        var product =
            await _productRepository
                .GetByIdAsync(productId);

        if (product == null)
            return false;

        // =========================================
        // OWNERSHIP CHECK
        // =========================================

        if (!isAdmin &&
            product.SellerId != userId)
        {
            return false;
        }

        // =========================================
        // VALIDATE NAME
        // =========================================

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException(
                "Product name is required.");
        }

        if (request.Name.Length > 200)
        {
            throw new ArgumentException(
                "Product name cannot exceed 200 characters.");
        }

        // =========================================
        // VALIDATE PRICE
        // =========================================

        if (request.Price <= 0)
        {
            throw new ArgumentException(
                "Price must be greater than 0.");
        }

        // =========================================
        // VALIDATE STOCK
        // =========================================

        if (request.StockQuantity < 0)
        {
            throw new ArgumentException(
                "Stock quantity cannot be negative.");
        }

        // =========================================
        // VALIDATE CATEGORY
        // =========================================

        var categoryExists =
            await _productRepository
                .CategoryExistsAsync(
                    request.CategoryId);

        if (!categoryExists)
        {
            throw new ArgumentException(
                "The specified category does not exist.");
        }

        // =========================================
        // UPDATE PRODUCT
        // =========================================

        product.Name =
            request.Name;

        product.Description =
            request.Description;

        product.Price =
            request.Price;

        product.StockQuantity =
            request.StockQuantity;

        product.CategoryId =
            request.CategoryId;

        product.Status =
            request.Status;

        product.UpdatedAt =
            DateTime.UtcNow;

        // =========================================
        // SAVE
        // =========================================

        await _productRepository
            .UpdateAsync(product);

        await _productRepository
            .SaveChangesAsync();

        return true;
    }

    // =========================================
    // DELETE PRODUCT
    // =========================================

    public async Task<bool> DeleteAsync(
        int productId,
        int userId,
        bool isAdmin)
    {
        var product =
            await _productRepository
                .GetByIdAsync(productId);

        if (product == null)
            return false;

        // =========================================
        // OWNERSHIP CHECK
        // =========================================

        if (!isAdmin &&
            product.SellerId != userId)
        {
            return false;
        }

        // =========================================
        // SOFT DELETE
        // =========================================

        product.IsDeleted = true;

        product.UpdatedAt =
            DateTime.UtcNow;

        // =========================================
        // SAVE
        // =========================================

        await _productRepository
            .UpdateAsync(product);

        await _productRepository
            .SaveChangesAsync();

        return true;
    }

    // =========================================
    // MAPPER
    // =========================================

    private static ProductResponse
        MapToResponse(Product product)
    {
        return new ProductResponse(
            product.Id,

            product.Name,

            product.Description,

            product.Price,

            product.StockQuantity,

            product.CategoryId,

            product.Category?.Name
                ?? string.Empty,

            product.SellerId,

            product.Seller?.Name
                ?? string.Empty,

            product.Images,

            product.Status,

            product.CreatedAt,

            product.UpdatedAt
        );
    }
    // =========================================
// SEMANTIC PRODUCT SEARCH
// =========================================

    public async Task<List<ProductResponse>> SearchAsync(
        string query,
        int limit = 5)
    {
        // =========================================
        // VALIDATE QUERY
        // =========================================

        if (string.IsNullOrWhiteSpace(query))
        {
            throw new ArgumentException(
                "Search query cannot be empty.");
        }


        // =========================================
        // VALIDATE LIMIT
        // =========================================

        if (limit < 1)
        {
            limit = 5;
        }

        if (limit > 50)
        {
            limit = 50;
        }


        // =========================================
        // GENERATE QUERY EMBEDDING
        // =========================================

        var queryEmbedding =
            await _embeddingService
                .GenerateEmbeddingAsync(query);


        // =========================================
        // SEARCH POSTGRESQL VECTOR
        // =========================================

        var products =
            await _productRepository
                .SearchByEmbeddingAsync(
                    queryEmbedding,
                    limit);


        // =========================================
        // MAP PRODUCTS TO RESPONSE
        // =========================================

        return products
            .Select(MapToResponse)
            .ToList();
    }
}