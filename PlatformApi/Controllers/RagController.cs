using Microsoft.AspNetCore.Mvc;
using PlatformApi.DTOs.RAG;
using PlatformApi.Services.RAG;

namespace PlatformApi.Controllers;

[ApiController]
[Route("api/rag")]
public class RagController : ControllerBase
{
    private readonly IRagService _ragService;

    public RagController(IRagService ragService)
    {
        _ragService = ragService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask(
        [FromBody] RagRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var answer =
                await _ragService.AskAsync(
                    request.Question,
                    cancellationToken);

            return Ok(
                new RagResponse(
                    request.Question,
                    answer));
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