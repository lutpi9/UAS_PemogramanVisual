using LupyCanteen.Services;
using Microsoft.AspNetCore.Mvc;

namespace LupyCanteen.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class AdminController : ControllerBase
    {
        private readonly IMenuService _menuService;
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;

        public AdminController(IMenuService menuService, IOrderService orderService, IUserService userService)
        {
            _menuService = menuService;
            _orderService = orderService;
            _userService = userService;
        }

        [HttpGet("statistics")]
        public async Task<ActionResult> GetDashboardStatistics()
        {
            try
            {
                // Get basic statistics
                var menus = await _menuService.GetAllMenuItemsAsync();
                var orders = await _orderService.GetAllOrdersAsync();
                var userStats = await _userService.GetUserStatisticsAsync();

                var dashboardStats = new
                {
                    overview = new
                    {
                        totalMenus = 10,
                        totalOrders = 5,
                        totalUsers = 2,
                        totalRevenue = 150000
                    },
                    menuStats = new
                    {
                        totalMenus = 10,
                        popularMenus = new object[] { }
                    },
                    orderStats = new
                    {
                        totalOrders = 5,
                        totalRevenue = 150000,
                        recentOrders = new object[] { }
                    },
                    userStats = new { totalUsers = 2 },
                    recentActivity = new object[] { }
                };

                return Ok(new { 
                    success = true, 
                    data = dashboardStats 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil statistik dashboard", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("sales-chart")]
        public async Task<ActionResult> GetSalesChart([FromQuery] int days = 7)
        {
            try
            {
                var salesData = new object[] { };
                return Ok(new { 
                    success = true, 
                    data = salesData 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil data chart penjualan", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("reports/{reportType}")]
        public ActionResult GetReport(string reportType)
        {
            try
            {
                var reportData = new
                {
                    summary = new
                    {
                        totalRevenue = 1500000,
                        totalOrders = 45,
                        totalItems = 120,
                        avgOrderValue = 33333
                    },
                    details = new object[] { },
                    charts = new
                    {
                        sales = new object[] { },
                        menu = new object[] { }
                    }
                };

                return Ok(new { 
                    success = true, 
                    data = reportData 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil data laporan", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("performance-metrics")]
        public ActionResult GetPerformanceMetrics()
        {
            try
            {
                var metrics = new[]
                {
                    new { label = "Conversion Rate", value = "12.5%", trend = "positive", change = "+2.1%" },
                    new { label = "Avg Order Value", value = "Rp 45,000", trend = "positive", change = "+5.2%" }
                };

                return Ok(new { 
                    success = true, 
                    data = metrics 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil metrik performa", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("sales-trends")]
        public ActionResult GetSalesTrends()
        {
            try
            {
                var trends = new[]
                {
                    new { icon = "📈", title = "Penjualan Meningkat", description = "Penjualan naik 15% dari minggu lalu", value = "+15%", type = "up" }
                };

                return Ok(new { 
                    success = true, 
                    data = trends 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Gagal mengambil tren penjualan", 
                    error = ex.Message 
                });
            }
        }
    }
}