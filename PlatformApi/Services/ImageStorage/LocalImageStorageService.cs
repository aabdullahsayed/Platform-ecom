using Microsoft.AspNetCore.Http;

namespace PlatformApi.Services.ImageStorage;

public class LocalImageStorageService
    : IImageStorageService
{
    private readonly IWebHostEnvironment _environment;

    private readonly string[] _allowedExtensions =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private const long MaxFileSize =
        5 * 1024 * 1024;


    public LocalImageStorageService(
        IWebHostEnvironment environment)
    {
        _environment = environment;
    }


    public async Task<List<string>>
        SaveProductImagesAsync(
            List<IFormFile> images)
    {
        if (images == null ||
            images.Count == 0)
        {
            return new List<string>();
        }


        if (images.Count > 5)
        {
            throw new ArgumentException(
                "Maximum 5 images are allowed.");
        }


        var uploadDirectory =
            Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "products");


        Directory.CreateDirectory(
            uploadDirectory);


        var imageUrls =
            new List<string>();


        foreach (var image in images)
        {
            // =========================================
            // Check file size
            // =========================================

            if (image.Length == 0)
            {
                throw new ArgumentException(
                    "One of the uploaded images is empty.");
            }


            if (image.Length > MaxFileSize)
            {
                throw new ArgumentException(
                    $"Image '{image.FileName}' exceeds the 5MB limit.");
            }


            // =========================================
            // Check extension
            // =========================================

            var extension =
                Path.GetExtension(
                    image.FileName)
                    .ToLowerInvariant();


            if (!_allowedExtensions
                .Contains(extension))
            {
                throw new ArgumentException(
                    $"Image '{image.FileName}' has an invalid format. " +
                    "Only JPG, JPEG, PNG and WebP are allowed.");
            }


            // =========================================
            // Generate safe filename
            // =========================================

            var fileName =
                $"{Guid.NewGuid():N}{extension}";


            var filePath =
                Path.Combine(
                    uploadDirectory,
                    fileName);


            // =========================================
            // Save file
            // =========================================

            await using var stream =
                new FileStream(
                    filePath,
                    FileMode.Create);


            await image.CopyToAsync(stream);


            // =========================================
            // URL stored in database
            // =========================================

            var imageUrl =
                $"/uploads/products/{fileName}";


            imageUrls.Add(imageUrl);
        }


        return imageUrls;
    }


    public async Task DeleteImageAsync(
        string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(
            imageUrl))
        {
            return;
        }


        var fileName =
            Path.GetFileName(
                imageUrl);


        var filePath =
            Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "products",
                fileName);


        if (File.Exists(filePath))
        {
            await Task.Run(() =>
                File.Delete(filePath));
        }
    }
}