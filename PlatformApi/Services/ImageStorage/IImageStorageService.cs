using Microsoft.AspNetCore.Http;

namespace PlatformApi.Services.ImageStorage;

public interface IImageStorageService
{
    Task<List<string>> SaveProductImagesAsync(
        List<IFormFile> images);

    Task DeleteImageAsync(string imageUrl);
}