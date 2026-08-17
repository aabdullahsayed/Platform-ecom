namespace PlatformApi.DTOs.Products;

public class ProductSearchRequest
{
    public string Query { get; set; } = string.Empty;

    public int Limit { get; set; } = 5;
}