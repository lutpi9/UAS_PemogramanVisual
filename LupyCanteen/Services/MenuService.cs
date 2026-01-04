using LupyCanteen.Data;
using LupyCanteen.Models;
using LupyCanteen.Models.DTOs;
using MongoDB.Driver;

namespace LupyCanteen.Services;

public class MenuService : IMenuService
{
    private readonly MongoDbContext _context;
    private readonly IImageService _imageService;

    public MenuService(MongoDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<IEnumerable<MenuItem>> GetAllMenuItemsAsync()
    {
        var filter = Builders<MenuItem>.Filter.Eq(m => m.IsAvailable, true);
        return await _context.MenuItems
            .Find(filter)
            .SortBy(m => m.Category)
            .ThenBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetMenuItemsByCategoryAsync(string category)
    {
        var filter = Builders<MenuItem>.Filter.And(
            Builders<MenuItem>.Filter.Eq(m => m.IsAvailable, true),
            Builders<MenuItem>.Filter.Regex(m => m.Category, new MongoDB.Bson.BsonRegularExpression($"^{category}$", "i"))
        );
        
        return await _context.MenuItems
            .Find(filter)
            .SortBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<MenuItem?> GetMenuItemByIdAsync(string id)
    {
        var filter = Builders<MenuItem>.Filter.And(
            Builders<MenuItem>.Filter.Eq(m => m.Id, id),
            Builders<MenuItem>.Filter.Eq(m => m.IsAvailable, true)
        );
        
        return await _context.MenuItems.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<MenuItem> CreateMenuItemAsync(CreateMenuItemDto dto)
    {
        var menuItem = new MenuItem
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Category = dto.Category.ToLower(),
            Badge = dto.Badge?.ToLower(),
            ImageUrl = dto.ImageUrl,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.MenuItems.InsertOneAsync(menuItem);
        return menuItem;
    }

    public async Task<MenuItem> CreateMenuItemWithImageAsync(CreateMenuItemWithImageDto dto)
    {
        string? imageUrl = null;
        
        if (dto.Image != null)
        {
            imageUrl = await _imageService.SaveImageAsync(dto.Image, dto.Category);
        }

        var menuItem = new MenuItem
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Category = dto.Category.ToLower(),
            Badge = dto.Badge?.ToLower(),
            ImageUrl = imageUrl,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.MenuItems.InsertOneAsync(menuItem);
        return menuItem;
    }

    public async Task<MenuItem?> UpdateMenuItemAsync(string id, CreateMenuItemDto dto)
    {
        var filter = Builders<MenuItem>.Filter.Eq(m => m.Id, id);
        var update = Builders<MenuItem>.Update
            .Set(m => m.Name, dto.Name)
            .Set(m => m.Description, dto.Description)
            .Set(m => m.Price, dto.Price)
            .Set(m => m.Category, dto.Category.ToLower())
            .Set(m => m.Badge, dto.Badge?.ToLower());

        if (!string.IsNullOrEmpty(dto.ImageUrl))
        {
            update = update.Set(m => m.ImageUrl, dto.ImageUrl);
        }

        var result = await _context.MenuItems.FindOneAndUpdateAsync(filter, update, 
            new FindOneAndUpdateOptions<MenuItem> { ReturnDocument = ReturnDocument.After });
        
        return result;
    }

    public async Task<MenuItem?> UpdateMenuItemWithImageAsync(string id, CreateMenuItemWithImageDto dto)
    {
        var existingItem = await GetMenuItemByIdAsync(id);
        if (existingItem == null) return null;

        string? imageUrl = existingItem.ImageUrl;
        
        if (dto.Image != null)
        {
            // Delete old image if exists
            if (!string.IsNullOrEmpty(existingItem.ImageUrl))
            {
                await _imageService.DeleteImageAsync(existingItem.ImageUrl);
            }
            
            // Save new image
            imageUrl = await _imageService.SaveImageAsync(dto.Image, dto.Category);
        }

        var filter = Builders<MenuItem>.Filter.Eq(m => m.Id, id);
        var update = Builders<MenuItem>.Update
            .Set(m => m.Name, dto.Name)
            .Set(m => m.Description, dto.Description)
            .Set(m => m.Price, dto.Price)
            .Set(m => m.Category, dto.Category.ToLower())
            .Set(m => m.Badge, dto.Badge?.ToLower())
            .Set(m => m.ImageUrl, imageUrl);

        var result = await _context.MenuItems.FindOneAndUpdateAsync(filter, update, 
            new FindOneAndUpdateOptions<MenuItem> { ReturnDocument = ReturnDocument.After });
        
        return result;
    }

    public async Task<bool> DeleteMenuItemAsync(string id)
    {
        var existingItem = await GetMenuItemByIdAsync(id);
        if (existingItem == null) return false;

        // Delete associated image if exists
        if (!string.IsNullOrEmpty(existingItem.ImageUrl))
        {
            await _imageService.DeleteImageAsync(existingItem.ImageUrl);
        }

        var filter = Builders<MenuItem>.Filter.Eq(m => m.Id, id);
        var update = Builders<MenuItem>.Update.Set(m => m.IsAvailable, false);
        
        var result = await _context.MenuItems.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }
}