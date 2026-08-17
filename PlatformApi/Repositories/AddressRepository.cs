using Microsoft.EntityFrameworkCore;
using PlatformApi.Data;
using PlatformApi.Models;

namespace PlatformApi.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly AppDbContext _context;

    public AddressRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Address>>
        GetByUserIdAsync(int userId)
    {
        return await _context.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenBy(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<Address?> GetByIdAsync(
        int addressId,
        int userId)
    {
        return await _context.Addresses
            .FirstOrDefaultAsync(
                a =>
                    a.Id == addressId &&
                    a.UserId == userId);
    }

    public async Task AddAsync(Address address)
    {
        await _context.Addresses.AddAsync(address);
    }

    public Task UpdateAsync(Address address)
    {
        _context.Addresses.Update(address);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Address address)
    {
        _context.Addresses.Remove(address);

        return Task.CompletedTask;
    }

    public async Task ClearDefaultAsync(int userId)
    {
        var addresses =
            await _context.Addresses
                .Where(
                    a =>
                        a.UserId == userId &&
                        a.IsDefault)
                .ToListAsync();

        foreach (var address in addresses)
        {
            address.IsDefault = false;
        }
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}