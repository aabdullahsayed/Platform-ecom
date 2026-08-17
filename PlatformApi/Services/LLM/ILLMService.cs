namespace PlatformApi.Services.LLM;

public interface ILLMService
{
    Task<string> GenerateAsync(
        string prompt,
        CancellationToken cancellationToken = default);
}