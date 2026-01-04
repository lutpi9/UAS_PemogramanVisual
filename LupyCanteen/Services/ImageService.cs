namespace LupyCanteen.Services;

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string _imageDirectory;

    public ImageService(IWebHostEnvironment environment)
    {
        _environment = environment;
        _imageDirectory = Path.Combine(_environment.WebRootPath, "images", "menu");
        
        // Ensure directory exists
        if (!Directory.Exists(_imageDirectory))
        {
            Directory.CreateDirectory(_imageDirectory);
        }
    }

    public async Task<string> SaveImageAsync(IFormFile image, string category)
    {
        if (image == null || image.Length == 0)
            throw new ArgumentException("Invalid image file");

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException("Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.");

        // Validate file size (max 5MB)
        if (image.Length > 5 * 1024 * 1024)
            throw new ArgumentException("File size too large. Maximum 5MB allowed.");

        // Generate unique filename
        var fileName = $"{category}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_imageDirectory, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        return GetImageUrl(fileName);
    }

    public async Task<bool> DeleteImageAsync(string imageUrl)
    {
        try
        {
            if (string.IsNullOrEmpty(imageUrl))
                return false;

            // Extract filename from URL
            var fileName = Path.GetFileName(imageUrl);
            var filePath = Path.Combine(_imageDirectory, fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }

            return false;
        }
        catch
        {
            return false;
        }
    }

    public string GetImageUrl(string fileName)
    {
        return $"/images/menu/{fileName}";
    }
}