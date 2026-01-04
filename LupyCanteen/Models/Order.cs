using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LupyCanteen.Models;

public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("transactionNumber")]
    public string TransactionNumber { get; set; } = string.Empty;
    
    [BsonElement("customerName")]
    public string CustomerName { get; set; } = "Guest";
    
    [BsonElement("customerEmail")]
    public string CustomerEmail { get; set; } = string.Empty;
    
    [BsonElement("customerPhone")]
    public string CustomerPhone { get; set; } = string.Empty;
    
    [BsonElement("orderDate")]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    [BsonElement("totalAmount")]
    public decimal TotalAmount { get; set; }
    
    [BsonElement("status")]
    public string Status { get; set; } = "Pending";
    
    [BsonElement("notes")]
    public string? Notes { get; set; }
    
    [BsonElement("orderItems")]
    public List<OrderItem> OrderItems { get; set; } = new();

    // For admin display - computed property
    [BsonIgnore]
    public List<OrderItem> Items => OrderItems;
}

public class OrderItem
{
    [BsonElement("menuItemId")]
    public string MenuItemId { get; set; } = string.Empty;
    
    [BsonElement("menuItemName")]
    public string MenuItemName { get; set; } = string.Empty;
    
    [BsonElement("name")]
    public string Name => MenuItemName;
    
    [BsonElement("quantity")]
    public int Quantity { get; set; }
    
    [BsonElement("price")]
    public decimal Price { get; set; }
}