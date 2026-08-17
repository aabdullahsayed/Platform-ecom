using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlatformApi.Services.Orders;

namespace PlatformApi.Controllers;

[ApiController]
[Route("api/users/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(
        IOrderService orderService)
    {
        _orderService = orderService;
    }


    // =====================================================
    // GET ORDER HISTORY
    // GET /api/users/orders
    // =====================================================

    [HttpGet]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();

        var orders =
            await _orderService.GetOrdersAsync(
                userId,
                page,
                pageSize);

        return Ok(orders);
    }


    // =====================================================
    // GET ORDER DETAILS
    // GET /api/users/orders/{id}
    // =====================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(
        int id)
    {
        var userId = GetUserId();

        var order =
            await _orderService.GetOrderAsync(
                userId,
                id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        return Ok(order);
    }


    // =====================================================
    // TRACK ORDER
    // GET /api/users/orders/{id}/track
    // =====================================================

    [HttpGet("{id:int}/track")]
    public async Task<IActionResult> TrackOrder(
        int id)
    {
        var userId = GetUserId();

        var order =
            await _orderService.TrackOrderAsync(
                userId,
                id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        return Ok(new
        {
            orderId = order.Id,
            status = order.Status,
            createdAt = order.CreatedAt,
            updatedAt = order.UpdatedAt
        });
    }


    // =====================================================
    // GET CURRENT USER ID
    // =====================================================

    private int GetUserId()
    {
        var claim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(claim))
        {
            throw new UnauthorizedAccessException(
                "User ID claim is missing.");
        }

        if (!int.TryParse(
                claim,
                out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid User ID claim.");
        }

        return userId;
    }
}