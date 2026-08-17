namespace PlatformApi.Services.RAG;

public interface IRagService
{
    Task<string> AskAsync(
        string question,
        CancellationToken cancellationToken = default);
}