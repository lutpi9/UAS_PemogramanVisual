namespace LupyCanteen.Services;

public interface IImageService
{
    Task<string> SaveImageAsync(IFormFile image, string category);
    Task<bool> DeleteImageAsync(string imageUrl);
    string GetImageUrl(string fileName);
}