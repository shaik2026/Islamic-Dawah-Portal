using Microsoft.EntityFrameworkCore;
using MediaPortal.Data;
using MediaPortal.Services;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Islamic Dawah Portal API",
        Version = "v1",
        Description = "API for the Islamic Dawah Portal - Articles, Videos, and Q&A"
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SecretKeyForDemoJustForTesting123!";
var key = System.Text.Encoding.ASCII.GetBytes(jwtKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:3000", "http://localhost:5173" };
            policy.WithOrigins(origins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configure Database - Use SQL Server if a real connection string is provided, else InMemory
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useSqlServer = !string.IsNullOrEmpty(connectionString) 
    && connectionString != "OVERRIDE_IN_AZURE_APP_SETTINGS"
    && (connectionString.Contains("Server=") || connectionString.Contains("Data Source="));

builder.Services.AddDbContext<MediaPortalContext>(options =>
{
    if (useSqlServer)
    {
        options.UseSqlServer(connectionString);
    }
    else
    {
        options.UseInMemoryDatabase("MediaPortalDB");
    }
});

// Register Services
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IQnAService, QnAService>();

var app = builder.Build();

// Create database schema and seed data
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<MediaPortalContext>();
        
        // Create tables if they don't exist
        context.Database.EnsureCreated();
        app.Logger.LogInformation("Database schema created successfully.");
        
        // Seed sample data
        SeedData.Initialize(context);
        app.Logger.LogInformation("Seed data initialized successfully.");
    }
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "Database initialization failed. App will continue with degraded functionality.");
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
