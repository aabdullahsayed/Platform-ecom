using System.Text;
using PlatformApi.Services.LLM;
using PlatformApi.Repositories;
using PlatformApi.Services.Embedding;
using PlatformApi.Models;

namespace PlatformApi.Services.RAG;

public class RagService : IRagService
{
    private readonly IProductRepository _productRepository;
    private readonly IEmbeddingService _embeddingService;
    private readonly ILLMService _llmService;

    public RagService(
        IProductRepository productRepository,
        IEmbeddingService embeddingService,
        ILLMService llmService)
    {
        _productRepository = productRepository;
        _embeddingService = embeddingService;
        _llmService = llmService;
    }

    public async Task<string> AskAsync(
        string question,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(question))
        {
            throw new ArgumentException(
                "Question cannot be empty.");
        }

        // ==========================================
        // STEP 1
        // Generate embedding for user question
        // ==========================================

        var queryEmbedding =
            await _embeddingService
                .GenerateEmbeddingAsync(question);

        // ==========================================
        // STEP 2
        // Search PostgreSQL using pgvector
        // ==========================================

        var products =
            await _productRepository
                .SearchByEmbeddingAsync(
                    queryEmbedding,
                    5);

        // ==========================================
        // STEP 3
        // Build context
        // ==========================================

        var context = new StringBuilder();

        foreach (var product in products)
        {
            context.AppendLine(
                $"Product: {product.Name}");

            context.AppendLine(
                $"Description: {product.Description}");

            context.AppendLine(
                $"Price: ${product.Price}");

            context.AppendLine(
                $"Stock: {product.StockQuantity}");

            context.AppendLine(
                $"Category: {product.Category?.Name}");

            context.AppendLine();
        }

        // ==========================================
        // STEP 4
        // Build RAG prompt
        // ==========================================

        var prompt = $"""
You are an e-commerce product assistant.

Answer the user's question using ONLY
the product information provided below.

If the information is not available in the
context, say that you could not find a
matching product.

Do not invent products, prices,
stock quantities, or specifications.

PRODUCT CONTEXT:

{context}

USER QUESTION:

{question}

Give a concise and helpful answer.
""";

        // ==========================================
        // STEP 5
        // Ask LLM
        // ==========================================

        var answer =
            await _llmService.GenerateAsync(
                prompt,
                cancellationToken);

        return answer;
    }
}