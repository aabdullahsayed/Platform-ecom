using PlatformApi.Models.Enums;

namespace PlatformApi.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public OrderStatus Status { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal FinalAmount { get; set; }

    // Stored as JSON/JSONB in PostgreSQL
    public string ShippingAddress { get; set; } = string.Empty;

    // Will later contain Stripe PaymentIntent ID
    public string? PaymentIntentId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<OrderItem> Items { get; set; }
        = new List<OrderItem>();
}