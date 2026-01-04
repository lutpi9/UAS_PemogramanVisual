using LupyCanteen.Data;
using LupyCanteen.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add MongoDB
builder.Services.AddSingleton<MongoDbContext>();

// Add custom services
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IUserService, UserService>();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8000", "http://127.0.0.1:8000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Comment out HTTPS redirect for development
// app.UseHttpsRedirection();

// Serve frontend files from home directory as default (FIRST PRIORITY)
app.UseFileServer(new FileServerOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..", "home")),
    RequestPath = "",
    EnableDefaultFiles = true,
    DefaultFilesOptions = { DefaultFileNames = { "index.html" } }
});

// Serve admin files from admin directory
app.UseFileServer(new FileServerOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..", "admin")),
    RequestPath = "/admin",
    EnableDefaultFiles = true,
    DefaultFilesOptions = { DefaultFileNames = { "login.html" } }
});

// Serve kasir files from kasir directory
app.UseFileServer(new FileServerOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..", "kasir")),
    RequestPath = "/kasir",
    EnableDefaultFiles = true,
    DefaultFilesOptions = { DefaultFileNames = { "kasir-dashboard.html" } }
});

// Serve user files from user directory
app.UseFileServer(new FileServerOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..", "user")),
    RequestPath = "/user",
    EnableDefaultFiles = true,
    DefaultFilesOptions = { DefaultFileNames = { "user-dashboard.html" } }
});

// Serve root files (for files in the root directory like CHECKOUT-FINAL-SOLUTION.html)
app.UseFileServer(new FileServerOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..")),
    RequestPath = "",
    EnableDirectoryBrowsing = false
});

// Serve uploaded images
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images")),
    RequestPath = "/images"
});

// Serve static files (HTML/CSS/JS) - LAST PRIORITY
app.UseStaticFiles();

// Enable CORS
app.UseCors("AllowFrontend");

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

// Emergency endpoint to create kasir user
app.MapPost("/api/emergency/create-kasir", async (MongoDbContext context) =>
{
    try
    {
        // Check if kasir already exists
        var existingKasir = await context.Users
            .Find(u => u.Username == "kasir1")
            .FirstOrDefaultAsync();
            
        if (existingKasir != null)
        {
            return Results.Ok(new { 
                success = true, 
                message = "Kasir user already exists",
                data = new { 
                    existingKasir.Id, 
                    existingKasir.Username, 
                    existingKasir.FullName, 
                    existingKasir.Role 
                }
            });
        }

        // Create kasir user
        var kasirUser = new LupyCanteen.Models.User
        {
            Username = "kasir1",
            Email = "kasir1@lupycanteen.com",
            Password = HashPasswordEmergency("kasir123"),
            FullName = "Kasir Satu",
            Role = "Kasir",
            Phone = "081234567891",
            Address = "Jl. Raya Margamulya, Telukjambe Barat",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await context.Users.InsertOneAsync(kasirUser);

        return Results.Ok(new { 
            success = true, 
            message = "Kasir user created successfully",
            data = new { 
                kasirUser.Id, 
                kasirUser.Username, 
                kasirUser.FullName, 
                kasirUser.Role 
            }
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { 
            success = false, 
            message = "Failed to create kasir user", 
            error = ex.Message 
        });
    }
});

// Emergency endpoint to create admin user
app.MapPost("/api/emergency/create-admin", async (MongoDbContext context) =>
{
    try
    {
        // Check if admin already exists
        var existingAdmin = await context.Users
            .Find(u => u.Username == "admin")
            .FirstOrDefaultAsync();
            
        if (existingAdmin != null)
        {
            return Results.Ok(new { 
                success = true, 
                message = "Admin user already exists",
                data = new { 
                    existingAdmin.Id, 
                    existingAdmin.Username, 
                    existingAdmin.FullName, 
                    existingAdmin.Role 
                }
            });
        }

        // Create admin user
        var adminUser = new LupyCanteen.Models.User
        {
            Username = "admin",
            Email = "admin@lupycanteen.com",
            Password = HashPasswordEmergency("admin123"),
            FullName = "Administrator",
            Role = "Admin",
            Phone = "081234567890",
            Address = "Jl. Raya Margamulya, Telukjambe Barat",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await context.Users.InsertOneAsync(adminUser);

        return Results.Ok(new { 
            success = true, 
            message = "Admin user created successfully",
            data = new { 
                adminUser.Id, 
                adminUser.Username, 
                adminUser.FullName, 
                adminUser.Role 
            }
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { 
            success = false, 
            message = "Failed to create admin user", 
            error = ex.Message 
        });
    }
});

// Emergency endpoint to create regular user
app.MapPost("/api/emergency/create-user", async (MongoDbContext context) =>
{
    try
    {
        // Check if user already exists
        var existingUser = await context.Users
            .Find(u => u.Username == "user1")
            .FirstOrDefaultAsync();
            
        if (existingUser != null)
        {
            return Results.Ok(new { 
                success = true, 
                message = "Regular user already exists",
                data = new { 
                    existingUser.Id, 
                    existingUser.Username, 
                    existingUser.FullName, 
                    existingUser.Role 
                }
            });
        }

        // Create regular user
        var regularUser = new LupyCanteen.Models.User
        {
            Username = "user1",
            Email = "user@lupycanteen.com",
            Password = HashPasswordEmergency("user123"),
            FullName = "Pelanggan Setia",
            Role = "User",
            Phone = "081234567892",
            Address = "Jl. Raya Margamulya, Telukjambe Barat",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await context.Users.InsertOneAsync(regularUser);

        return Results.Ok(new { 
            success = true, 
            message = "Regular user created successfully",
            data = new { 
                regularUser.Id, 
                regularUser.Username, 
                regularUser.FullName, 
                regularUser.Role 
            }
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { 
            success = false, 
            message = "Failed to create regular user", 
            error = ex.Message 
        });
    }
});

// Helper function for emergency password hashing
static string HashPasswordEmergency(string password)
{
    using var sha256 = System.Security.Cryptography.SHA256.Create();
    var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password + "LupyCanteen_Salt"));
    return Convert.ToBase64String(hashedBytes);
}

// API endpoints for JSON responses
app.MapGet("/api", () => new { 
    message = "🍱 LupyCanteen API is running!", 
    version = "1.0.0",
    database = "MongoDB",
    features = new {
        imageUpload = true,
        maxImageSize = "5MB",
        supportedFormats = new[] { "JPG", "PNG", "GIF", "WebP" }
    },
    endpoints = new {
        swagger = "/swagger",
        menu = "/api/menu",
        menuWithImage = "/api/menu/with-image",
        orders = "/api/order"
    },
    timestamp = DateTime.UtcNow
});

// Seed MongoDB with initial data (temporarily disabled)
// using (var scope = app.Services.CreateScope())
// {
//     var mongoContext = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
//     await MongoSeedData.InitializeAsync(mongoContext);
// }

app.Run();
