using Microsoft.EntityFrameworkCore;
using MediaPortal.Data;
using MediaPortal.Services;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MediaPortalContext>();
    
    // Create tables (critical - let errors surface)
    context.Database.EnsureCreated();
    
    // Seed sample data
    try
    {
        SeedData.Initialize(context);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
app.UseDeveloperExceptionPage(); // Shows detailed errors - remove after debugging
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
