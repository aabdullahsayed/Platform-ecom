namespace PlatformApi.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public Role Role { get; set; }

    public ICollection<Product> Products { get; set; }
        = new List<Product>();

    public ICollection<Order> Orders { get; set; }
        = new List<Order>();

    public ICollection<Address> Addresses { get; set; }
        = new List<Address>();
}