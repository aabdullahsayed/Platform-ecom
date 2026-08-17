using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PlatformApi.Services.Embedding;

public class EmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;

    public EmbeddingService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<float[]> GenerateEmbeddingAsync(
        string text,
        CancellationToken cancellationToken = default)
    {
        var request = new EmbeddingRequest
        {
            Text = text
        };

        var response = await _httpClient.PostAsJsonAsync(
            "/embed",
            request,
            cancellationToken
        );

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(
                cancellationToken
            );

            throw new Exception(
                $"Embedding service failed: {error}"
            );
        }

        var result =
            await response.Content.ReadFromJsonAsync<EmbeddingResponse>(
                cancellationToken: cancellationToken
            );

        if (result == null || result.Embedding == null)
        {
            throw new Exception(
                "Embedding service returned an invalid response."
            );
        }

        return result.Embedding;
    }


    private class EmbeddingRequest
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }


    private class EmbeddingResponse
    {
        [JsonPropertyName("dimension")]
        public int Dimension { get; set; }

        [JsonPropertyName("embedding")]
        public float[] Embedding { get; set; } = [];
    }
}