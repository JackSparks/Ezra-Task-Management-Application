using Xunit;
using Microsoft.EntityFrameworkCore;
using TaskListApp.Data;
using TaskListApp.Models;
using System.Threading.Tasks;
using System;

namespace TaskListApp.Tests;

public class TaskDbContextTests
{
    private TaskDbContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TaskDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new TaskDbContext(options);
    }

    [Fact]
    public async Task DbContext_CanAddAndRetrieveTasks()
    {
        using var context = GetInMemoryContext();
        
        var task = new TaskItem
        {
            Title = "Test Task",
            Description = "Test Description",
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var retrievedTask = await context.Tasks.FirstOrDefaultAsync();
        
        Assert.NotNull(retrievedTask);
        Assert.Equal("Test Task", retrievedTask.Title);
        Assert.Equal("Test Description", retrievedTask.Description);
        Assert.False(retrievedTask.IsCompleted);
    }

    // ...existing code...

    [Fact]
    public async Task DbContext_AllowsNullDescription()
    {
        using var context = GetInMemoryContext();
        
        var taskWithoutDescription = new TaskItem
        {
            Title = "Task without description",
            Description = null,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Tasks.Add(taskWithoutDescription);
        await context.SaveChangesAsync();

        var retrievedTask = await context.Tasks.FirstOrDefaultAsync();
        
        Assert.NotNull(retrievedTask);
        Assert.Null(retrievedTask.Description);
    }

    [Fact]
    public async Task DbContext_UpdatesTaskCorrectly()
    {
        using var context = GetInMemoryContext();
        
        var task = new TaskItem
        {
            Title = "Original Title",
            Description = "Original Description",
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        // Update the task
        task.Title = "Updated Title";
        task.IsCompleted = true;
        task.CompletedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        var updatedTask = await context.Tasks.FirstOrDefaultAsync();
        
        Assert.NotNull(updatedTask);
        Assert.Equal("Updated Title", updatedTask.Title);
        Assert.True(updatedTask.IsCompleted);
        Assert.NotNull(updatedTask.CompletedAt);
    }
}
