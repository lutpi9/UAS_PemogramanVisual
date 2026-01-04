using System.ComponentModel.DataAnnotations;

namespace LupyCanteen.Models.DTOs
{
    public class UpdateMenuItemDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1000, 1000000)]
        public decimal Price { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Badge { get; set; }

        public string? ImageUrl { get; set; }
    }
}