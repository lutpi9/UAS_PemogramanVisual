using LupyCanteen.Data;
using LupyCanteen.Models;
using LupyCanteen.Models.DTOs;
using MongoDB.Driver;

namespace LupyCanteen.Services;

public class OrderService : IOrderService
{
    private readonly MongoDbContext _context;

    public OrderService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderDto dto)
    {
        var transactionNumber = GenerateTransactionNumber();
        
        var order = new Order
        {
            TransactionNumber = transactionNumber,
            OrderDate = DateTime.UtcNow,
            Status = "Completed"
        };

        decimal totalAmount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var itemDto in dto.Items)
        {
            var menuItem = await _context.MenuItems
                .Find(Builders<MenuItem>.Filter.Eq(m => m.Id, itemDto.MenuItemId))
                .FirstOrDefaultAsync();
            
            if (menuItem == null) continue;

            var orderItem = new OrderItem
            {
                MenuItemId = itemDto.MenuItemId,
                MenuItemName = itemDto.MenuItemName,
                Quantity = itemDto.Quantity,
                Price = itemDto.Price
            };

            orderItems.Add(orderItem);
            totalAmount += itemDto.Price * itemDto.Quantity;
        }

        order.TotalAmount = totalAmount;
        order.OrderItems = orderItems;

        await _context.Orders.InsertOneAsync(order);
        return order;
    }

    public async Task<Order?> GetOrderByIdAsync(string id)
    {
        return await _context.Orders
            .Find(Builders<Order>.Filter.Eq(o => o.Id, id))
            .FirstOrDefaultAsync();
    }

    public async Task<Order?> GetOrderByTransactionNumberAsync(string transactionNumber)
    {
        return await _context.Orders
            .Find(Builders<Order>.Filter.Eq(o => o.TransactionNumber, transactionNumber))
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Order>> GetOrdersAsync()
    {
        return await _context.Orders
            .Find(Builders<Order>.Filter.Empty)
            .SortByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<List<Order>> GetAllOrdersAsync()
    {
        return await _context.Orders
            .Find(Builders<Order>.Filter.Empty)
            .SortByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<Order?> UpdateOrderStatusAsync(string id, string status)
    {
        var filter = Builders<Order>.Filter.Eq(o => o.Id, id);
        var update = Builders<Order>.Update.Set(o => o.Status, status);
        
        return await _context.Orders.FindOneAndUpdateAsync(filter, update,
            new FindOneAndUpdateOptions<Order> { ReturnDocument = ReturnDocument.After });
    }

    public async Task<bool> DeleteOrderAsync(string id)
    {
        var result = await _context.Orders.DeleteOneAsync(o => o.Id == id);
        return result.DeletedCount > 0;
    }

    private static string GenerateTransactionNumber()
    {
        return "TRX" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString()[^8..];
    }
}