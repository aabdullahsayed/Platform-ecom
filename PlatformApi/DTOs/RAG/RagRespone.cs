namespace PlatformApi.DTOs.RAG;

public record RagResponse(
    string Question,
    string Answer
);