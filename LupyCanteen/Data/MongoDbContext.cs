using MongoDB.Driver;
using LupyCanteen.Models;

namespace LupyCanteen.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB") ?? "mongodb://localhost:27017";
        var databaseName = configuration["DatabaseName"] ?? "LupyCanteenDb";
        
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<MenuItem> MenuItems => _database.GetCollection<MenuItem>("MenuItems");
    public IMongoCollection<Order> Orders => _database.GetCollection<Order>("Orders");
    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
}