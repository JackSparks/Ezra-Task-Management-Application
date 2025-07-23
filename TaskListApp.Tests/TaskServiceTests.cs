using Xunit;
using TaskListApp.Services;
using TaskListApp.Data;
using TaskListApp.DTOs;
using TaskListApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace TaskListApp.Tests;

public class TaskServiceTests
{
    private TaskService GetServiceWithInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<TaskDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Use unique DB per test
            .Options;
        var context = new TaskDbContext(options);
        return new TaskService(context);
    }

    private async Task<TaskService> GetServiceWithSampleData()
    {
        var service = GetServiceWithInMemoryDb();
        await service.CreateTaskAsync(new CreateTaskDto { Title = "Sample Task 1", Description = "Description 1" });
        await service.CreateTaskAsync(new CreateTaskDto { Title = "Sample Task 2", Description = "Description 2" });
        return service;
    }

    [Fact]
    public async Task CreateTask_AddsNewTask()
    {
        var service = GetServiceWithInMemoryDb();
        var dto = new CreateTaskDto { Title = "Test", Description = "Test Desc" };
        var result = await service.CreateTaskAsync(dto);
        Assert.NotNull(result);
        Assert.Equal("Test", result.Title);
        Assert.Equal("Test Desc", result.Description);
        Assert.False(result.IsCompleted);
    }

    [Fact]
    public async Task ToggleTaskStatus_TogglesCompletion()
    {
        var service = GetServiceWithInMemoryDb();
        var dto = new CreateTaskDto { Title = "Toggle", Description = "Toggle Desc" };
        var created = await service.CreateTaskAsync(dto);
        var toggled = await service.ToggleTaskStatusAsync(created.Id);
        Assert.True(toggled!.IsCompleted);
        var toggledBack = await service.ToggleTaskStatusAsync(created.Id);
        Assert.False(toggledBack!.IsCompleted);
    }

    [Fact]
    public async Task DeleteTask_RemovesTask()
    {
        var service = GetServiceWithInMemoryDb();
        var dto = new CreateTaskDto { Title = "Delete", Description = "Delete Desc" };
        var created = await service.CreateTaskAsync(dto);
        var deleted = await service.DeleteTaskAsync(created.Id);
        Assert.True(deleted);
        var task = await service.GetTaskByIdAsync(created.Id);
        Assert.Null(task);
    }

    [Fact]
    public async Task GetAllTasks_ReturnsAll()
    {
        var service = GetServiceWithInMemoryDb();
        await service.CreateTaskAsync(new CreateTaskDto { Title = "A" });
        await service.CreateTaskAsync(new CreateTaskDto { Title = "B" });
        var tasks = await service.GetAllTasksAsync();
        Assert.Equal(2, tasks.Count());
    }

    [Fact]
    public async Task GetAllTasks_EmptyDatabase_ReturnsEmptyList()
    {
        var service = GetServiceWithInMemoryDb();
        var tasks = await service.GetAllTasksAsync();
        Assert.Empty(tasks);
    }

    [Fact]
    public async Task GetAllTasks_OrdersByCreatedAtDescending()
    {
        var service = GetServiceWithInMemoryDb();
        
        // Create tasks with slight delay to ensure different timestamps
        var firstTask = await service.CreateTaskAsync(new CreateTaskDto { Title = "First" });
        await Task.Delay(10);
        var secondTask = await service.CreateTaskAsync(new CreateTaskDto { Title = "Second" });
        
        var tasks = await service.GetAllTasksAsync();
        var taskList = tasks.ToList();
        
        Assert.Equal(2, taskList.Count);
        Assert.Equal("Second", taskList[0].Title); // Most recent first
        Assert.Equal("First", taskList[1].Title);
    }

    [Fact]
    public async Task GetTaskById_ExistingTask_ReturnsTask()
    {
        var service = GetServiceWithInMemoryDb();
        var created = await service.CreateTaskAsync(new CreateTaskDto { Title = "Test", Description = "Test Desc" });
        
        var retrieved = await service.GetTaskByIdAsync(created.Id);
        
        Assert.NotNull(retrieved);
        Assert.Equal(created.Id, retrieved.Id);
        Assert.Equal("Test", retrieved.Title);
        Assert.Equal("Test Desc", retrieved.Description);
    }

    [Fact]
    public async Task GetTaskById_NonExistentTask_ReturnsNull()
    {
        var service = GetServiceWithInMemoryDb();
        
        var retrieved = await service.GetTaskByIdAsync(999);
        
        Assert.Null(retrieved);
    }

    [Fact]
    public async Task CreateTask_ValidData_CreatesAndReturnsTask()
    {
        var service = GetServiceWithInMemoryDb();
        var dto = new CreateTaskDto { Title = "New Task", Description = "New Description" };
        var beforeCreation = DateTime.UtcNow;
        
        var result = await service.CreateTaskAsync(dto);
        var afterCreation = DateTime.UtcNow;
        
        Assert.NotNull(result);
        Assert.True(result.Id > 0);
        Assert.Equal("New Task", result.Title);
        Assert.Equal("New Description", result.Description);
        Assert.False(result.IsCompleted);
        Assert.Null(result.CompletedAt);
        Assert.True(result.CreatedAt >= beforeCreation && result.CreatedAt <= afterCreation);
    }

    [Fact]
    public async Task CreateTask_WithoutDescription_CreatesTask()
    {
        var service = GetServiceWithInMemoryDb();
        var dto = new CreateTaskDto { Title = "Title Only" };
        
        var result = await service.CreateTaskAsync(dto);
        
        Assert.NotNull(result);
        Assert.Equal("Title Only", result.Title);
        Assert.Null(result.Description);
    }

    [Fact]
    public async Task ToggleTaskStatus_IncompleteTask_CompletesTask()
    {
        var service = GetServiceWithInMemoryDb();
        var created = await service.CreateTaskAsync(new CreateTaskDto { Title = "Toggle Test" });
        var beforeToggle = DateTime.UtcNow;
        
        var toggled = await service.ToggleTaskStatusAsync(created.Id);
        var afterToggle = DateTime.UtcNow;
        
        Assert.NotNull(toggled);
        Assert.True(toggled.IsCompleted);
        Assert.NotNull(toggled.CompletedAt);
        Assert.True(toggled.CompletedAt >= beforeToggle && toggled.CompletedAt <= afterToggle);
    }

    [Fact]
    public async Task ToggleTaskStatus_CompleteTask_IncompletesTask()
    {
        var service = GetServiceWithInMemoryDb();
        var created = await service.CreateTaskAsync(new CreateTaskDto { Title = "Toggle Test" });
        
        // First toggle to complete
        await service.ToggleTaskStatusAsync(created.Id);
        
        // Second toggle to incomplete
        var toggled = await service.ToggleTaskStatusAsync(created.Id);
        
        Assert.NotNull(toggled);
        Assert.False(toggled.IsCompleted);
        Assert.Null(toggled.CompletedAt);
    }

    [Fact]
    public async Task ToggleTaskStatus_NonExistentTask_ReturnsNull()
    {
        var service = GetServiceWithInMemoryDb();
        
        var result = await service.ToggleTaskStatusAsync(999);
        
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteTask_ExistingTask_DeletesAndReturnsTrue()
    {
        var service = GetServiceWithInMemoryDb();
        var created = await service.CreateTaskAsync(new CreateTaskDto { Title = "To Delete" });
        
        var deleted = await service.DeleteTaskAsync(created.Id);
        
        Assert.True(deleted);
        
        // Verify task is actually deleted
        var retrieved = await service.GetTaskByIdAsync(created.Id);
        Assert.Null(retrieved);
    }

    [Fact]
    public async Task DeleteTask_NonExistentTask_ReturnsFalse()
    {
        var service = GetServiceWithInMemoryDb();
        
        var deleted = await service.DeleteTaskAsync(999);
        
        Assert.False(deleted);
    }

    [Fact]
    public async Task DeleteTask_DoesNotAffectOtherTasks()
    {
        var service = GetServiceWithInMemoryDb();
        var task1 = await service.CreateTaskAsync(new CreateTaskDto { Title = "Keep This" });
        var task2 = await service.CreateTaskAsync(new CreateTaskDto { Title = "Delete This" });
        
        await service.DeleteTaskAsync(task2.Id);
        
        var remaining = await service.GetAllTasksAsync();
        Assert.Single(remaining);
        Assert.Equal(task1.Id, remaining.First().Id);
        Assert.Equal("Keep This", remaining.First().Title);
    }

    [Fact]
    public async Task MultipleOperations_WorkCorrectly()
    {
        var service = GetServiceWithInMemoryDb();
        
        // Create multiple tasks
        var task1 = await service.CreateTaskAsync(new CreateTaskDto { Title = "Task 1" });
        var task2 = await service.CreateTaskAsync(new CreateTaskDto { Title = "Task 2" });
        var task3 = await service.CreateTaskAsync(new CreateTaskDto { Title = "Task 3" });
        
        // Complete one task
        await service.ToggleTaskStatusAsync(task2.Id);
        
        // Delete one task
        await service.DeleteTaskAsync(task3.Id);
        
        // Verify final state
        var allTasks = await service.GetAllTasksAsync();
        var taskList = allTasks.ToList();
        
        Assert.Equal(2, taskList.Count);
        
        var remainingTask1 = taskList.First(t => t.Id == task1.Id);
        var remainingTask2 = taskList.First(t => t.Id == task2.Id);
        
        Assert.False(remainingTask1.IsCompleted);
        Assert.True(remainingTask2.IsCompleted);
    }
}
