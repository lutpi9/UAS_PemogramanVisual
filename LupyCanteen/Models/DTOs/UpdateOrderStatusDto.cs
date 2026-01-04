namespace LupyCanteen.Models.DTOs
{
    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
    }
}