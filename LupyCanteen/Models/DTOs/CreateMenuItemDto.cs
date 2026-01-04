namespace LupyCanteen.Models.DTOs;

public class CreateMenuItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Badge { get; set; }
    public string? ImageUrl { get; set; }
}

public class CreateMenuItemWithImageDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Badge { get; set; }
    public IFormFile? Image { get; set; }
}

public class CreateOrderDto
{
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public string MenuItemId { get; set; } = string.Empty;
    public string MenuItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}