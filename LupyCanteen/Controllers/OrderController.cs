using LupyCanteen.Models.DTOs;
using LupyCanteen.Services;
using Microsoft.AspNetCore.Mvc;

namespace LupyCanteen.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Data tidak valid", errors = ModelState });

            var order = await _orderService.CreateOrderAsync(dto);
            return Ok(new { 
                success = true, 
                data = order, 
                message = "Pesanan berhasil dibuat" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                success = false, 
                message = "Gagal membuat pesanan", 
                error = ex.Message 
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(string id)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound(new { success = false, message = "Pesanan tidak ditemukan" });

            return Ok(new { success = true, data = order });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                success = false, 
                message = "Gagal mengambil data pesanan", 
                error = ex.Message 
            });
        }
    }

    [HttpGet("transaction/{transactionNumber}")]
    public async Task<IActionResult> GetOrderByTransactionNumber(string transactionNumber)
    {
        try
        {
            var order = await _orderService.GetOrderByTransactionNumberAsync(transactionNumber);
            if (order == null)
                return NotFound(new { success = false, message = "Pesanan tidak ditemukan" });

            return Ok(new { success = true, data = order });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                success = false, 
                message = "Gagal mengambil data pesanan", 
                error = ex.Message 
            });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(new { 
                success = true, 
                data = orders,
                total = orders.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                success = false, 
                message = "Gagal mengambil data pesanan", 
                error = ex.Message 
            });
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateOrderStatusDto dto)
    {
        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(id, dto.Status);
            if (order == null)
                return NotFound(new { success = false, message = "Pesanan tidak ditemukan" });

            return Ok(new { 
                success = true, 
                data = order, 
                message = "Status pesanan berhasil diupdate" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                success = false, 
                message = "Gagal mengupdate status pesanan", 
                error = ex.Message 
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(string id)
    {
        try
        {
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
                return NotFound(new { success = false, message = "Pesanan tidak ditemukan" });

            return Ok(new { 
                success = true, 
                message = "Pesanan berhasil dihapus" 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                success = false, 
                message = "Gagal menghapus pesanan", 
                error = ex.Message 
            });
        }
    }
}