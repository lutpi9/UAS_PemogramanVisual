using LupyCanteen.Models;
using LupyCanteen.Models.DTOs;

namespace LupyCanteen.Services;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderDto dto);
    Task<Order?> GetOrderByIdAsync(string id);
    Task<Order?> GetOrderByTransactionNumberAsync(string transactionNumber);
    Task<IEnumerable<Order>> GetOrdersAsync();
    Task<List<Order>> GetAllOrdersAsync();
    Task<Order?> UpdateOrderStatusAsync(string id, string status);
    Task<bool> DeleteOrderAsync(string id);
}