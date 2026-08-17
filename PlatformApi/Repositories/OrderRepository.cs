using Microsoft.EntityFrameworkCore;
using PlatformApi.Data;
using PlatformApi.Models;

namespace PlatformApi.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }


    // =====================================================
    // GET USER ORDER HISTORY
    // GET /api/users/orders
    // =====================================================

    public async Task<List<Order>> GetUserOrdersAsync(
        int userId,
        int page,
        int pageSize)
    {
        return await _context.Orders

            // Include order items
            .Include(o => o.Items)

            // Only orders belonging to current user
            .Where(o =>
                o.UserId == userId)

            // Newest orders first
            .OrderByDescending(o =>
                o.CreatedAt)

            // Pagination
            .Skip(
                (page - 1) *
                pageSize)

            .Take(pageSize)

            .ToListAsync();
    }


    // =====================================================
    // GET USER ORDER BY ID
    // GET /api/users/orders/{id}
    // =====================================================

    public async Task<Order?> GetUserOrderByIdAsync(
        int userId,
        int orderId)
    {
        return await _context.Orders

            // Load order items
            .Include(o => o.Items)

            // Security:
            // User can only access their own order
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                o.UserId == userId);
    }


    // =====================================================
    // GET ORDER BY ID
    // Used internally/admin operations
    // =====================================================

    public async Task<Order?> GetByIdAsync(
        int orderId)
    {
        return await _context.Orders

            .Include(o => o.Items)

            .FirstOrDefaultAsync(o =>
                o.Id == orderId);
    }


    // =====================================================
    // ADD ORDER
    // =====================================================

    public async Task AddAsync(
        Order order)
    {
        await _context.Orders
            .AddAsync(order);
    }


    // =====================================================
    // UPDATE ORDER
    // =====================================================

    public Task UpdateAsync(
        Order order)
    {
        _context.Orders
            .Update(order);

        return Task.CompletedTask;
    }


    // =====================================================
    // DELETE ORDER
    // =====================================================

    public Task DeleteAsync(
        Order order)
    {
        _context.Orders
            .Remove(order);

        return Task.CompletedTask;
    }


    // =====================================================
    // CHECK ORDER EXISTS
    // =====================================================

    public async Task<bool> ExistsAsync(
        int orderId)
    {
        return await _context.Orders
            .AnyAsync(o =>
                o.Id == orderId);
    }


    // =====================================================
    // CHECK USER ORDER EXISTS
    // =====================================================

    public async Task<bool> UserOwnsOrderAsync(
        int userId,
        int orderId)
    {
        return await _context.Orders
            .AnyAsync(o =>
                o.Id == orderId &&
                o.UserId == userId);
    }


    // =====================================================
    // GET TOTAL USER ORDERS
    // Useful for pagination later
    // =====================================================

    public async Task<int> GetUserOrderCountAsync(
        int userId)
    {
        return await _context.Orders
            .CountAsync(o =>
                o.UserId == userId);
    }


    // =====================================================
    // SAVE CHANGES
    // =====================================================

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}