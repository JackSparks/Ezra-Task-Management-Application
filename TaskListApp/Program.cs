using Microsoft.EntityFrameworkCore;
using TaskListApp.Data;
using TaskListApp.Endpoints;
using TaskListApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Task List API", 
        Version = "v1",
        Description = "A simple REST API for managing tasks"
    });
});

// Add Entity Framework
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=tasks.db"));

// Add services
builder.Services.AddScoped<ITaskService, TaskService>();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task List API v1");
        c.RoutePrefix = string.Empty; // Swagger UI at root
    });
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TaskDbContext>();
    context.Database.EnsureCreated();
}

// Map API endpoints
app.MapTaskEndpoints();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
   .WithTags("Health")
   .WithSummary("Health check endpoint");

// Reset database endpoint for testing
app.MapPost("/api/test/reset", async (TaskDbContext context) =>
{
    await context.Tasks.ExecuteDeleteAsync();
    return Results.Ok(new { message = "Database reset successfully" });
})
.WithTags("Testing")
.WithSummary("Reset database for testing");

app.Run();

// Make Program class accessible for testing
public partial class Program { }
