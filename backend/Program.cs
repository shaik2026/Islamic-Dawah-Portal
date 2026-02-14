using Microsoft.EntityFrameworkCore;
using MediaPortal.Data;
using MediaPortal.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configure Database (Using In-Memory for demo purposes)
builder.Services.AddDbContext<MediaPortalContext>(options =>
    options.UseInMemoryDatabase("MediaPortalDB"));

// Register Services
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IQnAService, QnAService>();

var app = builder.Build();

// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MediaPortalContext>();
    SeedData.Initialize(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();
