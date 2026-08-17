using Pgvector;

namespace PlatformApi.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public int CategoryId { get; set; }

    public Category Category { get; set; }

    public int SellerId { get; set; }

    public User Seller { get; set; }

    public List<string> Images { get; set; } = new();

    public ProductStatus Status { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // RAG
    public Vector? Embedding { get; set; }
}