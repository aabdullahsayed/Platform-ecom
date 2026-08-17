using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlatformApi.DTOs.Products;
using PlatformApi.Services;
using PlatformApi.Services.Embedding;

namespace PlatformApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(
        IProductService productService)
    {
        _productService = productService;
    }


    // =====================================================
    // GET ALL PRODUCTS
    // GET: /api/products
    // =====================================================

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] int? categoryId = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
        var result =
            await _productService.GetAllAsync(
                page,
                pageSize,
                categoryId,
                minPrice,
                maxPrice);

        return Ok(result);
    }


    // =====================================================
    // GET PRODUCT BY ID
    // GET: /api/products/1
    // =====================================================

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var product =
            await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        return Ok(product);
    }


    // =====================================================
    // GET SELLER PRODUCTS
    // GET: /api/products/seller
    // =====================================================

    [HttpGet("seller")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> GetSellerProducts()
    {
        var userId = GetUserId();

        var products =
            await _productService.GetSellerProductsAsync(
                userId);

        return Ok(products);
    }


    // =====================================================
    // CREATE PRODUCT
    // POST: /api/products
    //
    // IMPORTANT:
    // Because images are uploaded using IFormFile,
    // this must use [FromForm].
    // =====================================================

    [HttpPost]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> Create(
        [FromForm] CreateProductRequest request)
    {
        try
        {
            var userId = GetUserId();

            var product =
                await _productService.CreateAsync(
                    request,
                    userId);

            return CreatedAtAction(
                nameof(GetById),
                new
                {
                    id = product.Id
                },
                product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    // =====================================================
    // UPDATE PRODUCT
    // PUT: /api/products/1
    // =====================================================

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateProductRequest request)
    {
        try
        {
            var userId = GetUserId();

            var isAdmin =
                User.IsInRole("Admin");

            var updated =
                await _productService.UpdateAsync(
                    id,
                    request,
                    userId,
                    isAdmin);

            if (!updated)
            {
                return Forbid();
            }

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    // =====================================================
    // DELETE PRODUCT
    // DELETE: /api/products/1
    //
    // Soft delete
    // =====================================================

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        var isAdmin =
            User.IsInRole("Admin");

        var deleted =
            await _productService.DeleteAsync(
                id,
                userId,
                isAdmin);

        if (!deleted)
        {
            return Forbid();
        }

        return NoContent();
    }


    // =====================================================
    // GET CURRENT USER ID FROM COOKIE CLAIM
    // =====================================================

    private int GetUserId()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            throw new UnauthorizedAccessException(
                "User ID claim is missing.");
        }

        if (!int.TryParse(
                userIdClaim,
                out int userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid User ID claim.");
        }

        return userId;
    }
    
    
    [HttpPost("test-embedding")]
    public async Task<IActionResult> TestEmbedding(
        [FromBody] string text,
        IEmbeddingService embeddingService)
    {
        var embedding =
            await embeddingService.GenerateEmbeddingAsync(text);

        return Ok(new
        {
            dimension = embedding.Length,
            embedding
        });
    }
    
    // =====================================================
    // SEMANTIC PRODUCT SEARCH
    //
    // POST: /api/products/search
    // =====================================================

    [HttpPost("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search(
        [FromBody] ProductSearchRequest request)
    {
        try
        {
            var products =
                await _productService.SearchAsync(
                    request.Query,
                    request.Limit);

            return Ok(new
            {
                query = request.Query,
                count = products.Count,
                products
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }

    }



}