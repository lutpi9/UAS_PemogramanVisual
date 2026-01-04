using LupyCanteen.Models;
using LupyCanteen.Models.DTOs;

namespace LupyCanteen.Services;

public interface IMenuService
{
    Task<IEnumerable<MenuItem>> GetAllMenuItemsAsync();
    Task<IEnumerable<MenuItem>> GetMenuItemsByCategoryAsync(string category);
    Task<MenuItem?> GetMenuItemByIdAsync(string id);
    Task<MenuItem> CreateMenuItemAsync(CreateMenuItemDto dto);
    Task<MenuItem> CreateMenuItemWithImageAsync(CreateMenuItemWithImageDto dto);
    Task<MenuItem?> UpdateMenuItemAsync(string id, CreateMenuItemDto dto);
    Task<MenuItem?> UpdateMenuItemWithImageAsync(string id, CreateMenuItemWithImageDto dto);
    Task<bool> DeleteMenuItemAsync(string id);
}