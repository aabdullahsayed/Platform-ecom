using Microsoft.EntityFrameworkCore;
using PlatformApi.Data;
using PlatformApi.Models;

namespace PlatformApi.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }


    // =========================================
    // GET USER BY EMAIL
    // =========================================

    public async Task<User?> GetByEmailAsync(
        string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(
                u => u.Email == email);
    }


    // =========================================
    // GET USER BY ID
    // =========================================

    public async Task<User?> GetByIdAsync(
        int userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(
                u => u.Id == userId);
    }


    // =========================================
    // ADD USER
    // =========================================

    public async Task AddAsync(
        User user)
    {
        await _context.Users.AddAsync(user);
    }


    // =========================================
    // UPDATE USER
    // =========================================

    public Task UpdateAsync(
        User user)
    {
        _context.Users.Update(user);

        return Task.CompletedTask;
    }


    // =========================================
    // GET ADDRESSES
    // =========================================

    public async Task<List<Address>>
        GetAddressesAsync(int userId)
    {
        return await _context.Addresses
            .Where(a =>
                a.UserId == userId)
            .OrderByDescending(a =>
                a.IsDefault)
            .ThenBy(a =>
                a.Id)
            .ToListAsync();
    }


    // =========================================
    // GET SINGLE ADDRESS
    // =========================================

    public async Task<Address?> GetAddressByIdAsync(
        int addressId,
        int userId)
    {
        return await _context.Addresses
            .FirstOrDefaultAsync(a =>
                a.Id == addressId &&
                a.UserId == userId);
    }


    // =========================================
    // ADD ADDRESS
    // =========================================

    public async Task AddAddressAsync(
        Address address)
    {
        await _context.Addresses
            .AddAsync(address);
    }


    // =========================================
    // UPDATE ADDRESS
    // =========================================

    public Task UpdateAddressAsync(
        Address address)
    {
        _context.Addresses.Update(address);

        return Task.CompletedTask;
    }


    // =========================================
    // DELETE ADDRESS
    // =========================================

    public Task DeleteAddressAsync(
        Address address)
    {
        _context.Addresses.Remove(address);

        return Task.CompletedTask;
    }


    // =========================================
    // GET ORDERS
    // =========================================

    public async Task<List<Order>> GetOrdersAsync(
        int userId,
        int page,
        int pageSize,
        string? status = null)
    {
        IQueryable<Order> query =
            _context.Orders
                .Include(o => o.Items)
                .Where(o =>
                    o.UserId == userId);

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(o =>
                o.Status.ToString() == status);
        }

        return await query
            .OrderByDescending(o =>
                o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }


    // =========================================
    // ORDER COUNT
    // =========================================

    public async Task<int> GetOrderCountAsync(
        int userId,
        string? status = null)
    {
        IQueryable<Order> query =
            _context.Orders
                .Where(o =>
                    o.UserId == userId);

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(o =>
                o.Status.ToString() == status);
        }

        return await query.CountAsync();
    }


    // =========================================
    // GET ORDER BY ID
    // =========================================

    public async Task<Order?> GetOrderByIdAsync(
        int orderId,
        int userId)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                o.UserId == userId);
    }

    // =========================================
    // SAVE CHANGES
    // =========================================

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}