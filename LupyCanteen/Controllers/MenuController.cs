using LupyCanteen.Models.DTOs;
using LupyCanteen.Services;
using Microsoft.AspNetCore.Mvc;

namespace LupyCanteen.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;

    public MenuController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMenuItems()
    {
        var menuItems = await _menuService.GetAllMenuItemsAsync();
        return Ok(menuItems);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetMenuItemsByCategory(string category)
    {
        var menuItems = await _menuService.GetMenuItemsByCategoryAsync(category);
        return Ok(menuItems);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMenuItemById(string id)
    {
        var menuItem = await _menuService.GetMenuItemByIdAsync(id);
        if (menuItem == null)
            return NotFound();

        return Ok(menuItem);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMenuItem([FromBody] CreateMenuItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var menuItem = await _menuService.CreateMenuItemAsync(dto);
        return CreatedAtAction(nameof(GetMenuItemById), new { id = menuItem.Id }, menuItem);
    }

    [HttpPost("with-image")]
    public async Task<IActionResult> CreateMenuItemWithImage([FromForm] CreateMenuItemWithImageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var menuItem = await _menuService.CreateMenuItemWithImageAsync(dto);
            return CreatedAtAction(nameof(GetMenuItemById), new { id = menuItem.Id }, menuItem);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenuItem(string id, [FromBody] CreateMenuItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var menuItem = await _menuService.UpdateMenuItemAsync(id, dto);
        if (menuItem == null)
            return NotFound();

        return Ok(menuItem);
    }

    [HttpPut("{id}/with-image")]
    public async Task<IActionResult> UpdateMenuItemWithImage(string id, [FromForm] CreateMenuItemWithImageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var menuItem = await _menuService.UpdateMenuItemWithImageAsync(id, dto);
            if (menuItem == null)
                return NotFound();

            return Ok(menuItem);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenuItem(string id)
    {
        var result = await _menuService.DeleteMenuItemAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPost("cleanup-unwanted")]
    public async Task<IActionResult> CleanupUnwantedMenuItems()
    {
        try
        {
            var unwantedMenuNames = new[]
            {
                "Churros Coklat", "Kue Cubit Rainbow", "Risoles",
                "ayam geprek", "Burger Ayam Crispy", "mie ayam",
                "nasi gudeg", "nasi padang", "nasi ayam spesial",
                "es campur", "escampur segar", "jus alpuket", "kopi hitam",
                "Sate Ayam Spesial", "sate ayam spesial", "Es Camour Segar", "Jus Alpuket"
            };

            var allMenuItems = await _menuService.GetAllMenuItemsAsync();
            var itemsToDelete = allMenuItems.Where(item => 
                unwantedMenuNames.Any(unwanted => 
                    string.Equals(item.Name, unwanted, StringComparison.OrdinalIgnoreCase)
                )
            ).ToList();

            var deletedCount = 0;
            foreach (var item in itemsToDelete)
            {
                var deleted = await _menuService.DeleteMenuItemAsync(item.Id);
                if (deleted) deletedCount++;
            }

            return Ok(new { 
                message = $"Cleanup completed. {deletedCount} unwanted menu items removed.",
                deletedItems = itemsToDelete.Select(i => i.Name).ToList()
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Cleanup failed", error = ex.Message });
        }
    }

    [HttpDelete("by-name/{name}")]
    public async Task<IActionResult> DeleteMenuItemByName(string name)
    {
        try
        {
            var allMenuItems = await _menuService.GetAllMenuItemsAsync();
            var itemToDelete = allMenuItems.FirstOrDefault(item => 
                string.Equals(item.Name, name, StringComparison.OrdinalIgnoreCase)
            );

            if (itemToDelete == null)
                return NotFound(new { message = $"Menu item '{name}' not found" });

            var deleted = await _menuService.DeleteMenuItemAsync(itemToDelete.Id);
            if (!deleted)
                return BadRequest(new { message = $"Failed to delete menu item '{name}'" });

            return Ok(new { message = $"Menu item '{name}' deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Delete failed", error = ex.Message });
        }
    }
}