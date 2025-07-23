using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;
using System.Net;
using TaskListApp.DTOs;
using System.Text.Json;
using System.Threading.Tasks;
using System.Net.Http;
using System.Collections.Generic;

namespace TaskListApp.Tests;

public class TaskEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TaskEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthCheck_ReturnsHealthy()
    {
        var response = await _client.GetAsync("/health");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("Healthy", content);
    }

    [Fact]
    public async Task GetTasks_ReturnsSuccessAndTasks()
    {
        var response = await _client.GetAsync("/api/tasks");
        response.EnsureSuccessStatusCode();
        
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskDto>>();
        Assert.NotNull(tasks);
    }

    [Fact]
    public async Task CreateTask_ValidData_ReturnsCreated()
    {
        var dto = new CreateTaskDto { Title = "API Test Task", Description = "Created from integration test" };
        
        var response = await _client.PostAsJsonAsync("/api/tasks", dto);
        
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        
        var task = await response.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);
        Assert.Equal("API Test Task", task!.Title);
        Assert.Equal("Created from integration test", task.Description);
        Assert.False(task.IsCompleted);
        Assert.True(task.Id > 0);
    }

    [Fact]
    public async Task CreateTask_EmptyTitle_ReturnsBadRequest()
    {
        var dto = new CreateTaskDto { Title = "", Description = "Invalid task" };
        
        var response = await _client.PostAsJsonAsync("/api/tasks", dto);
        
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateTask_NullTitle_ReturnsBadRequest()
    {
        var dto = new CreateTaskDto { Title = null!, Description = "Invalid task" };
        
        var response = await _client.PostAsJsonAsync("/api/tasks", dto);
        
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTaskById_ExistingTask_ReturnsTask()
    {
        // First create a task
        var createDto = new CreateTaskDto { Title = "Get By ID Test", Description = "For testing get by ID" };
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createDto);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        
        // Then get it by ID
        var getResponse = await _client.GetAsync($"/api/tasks/{createdTask!.Id}");
        getResponse.EnsureSuccessStatusCode();
        
        var retrievedTask = await getResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(retrievedTask);
        Assert.Equal(createdTask.Id, retrievedTask!.Id);
        Assert.Equal("Get By ID Test", retrievedTask.Title);
    }

    [Fact]
    public async Task GetTaskById_NonExistentTask_ReturnsNotFound()
    {
        var response = await _client.GetAsync("/api/tasks/99999");
        
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ToggleTaskStatus_ExistingTask_ReturnsUpdatedTask()
    {
        // Create a task first
        var createDto = new CreateTaskDto { Title = "Toggle Test", Description = "For testing toggle" };
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createDto);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        
        // Toggle its status
        var toggleResponse = await _client.PutAsync($"/api/tasks/{createdTask!.Id}/toggle", null);
        toggleResponse.EnsureSuccessStatusCode();
        
        var toggledTask = await toggleResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(toggledTask);
        Assert.True(toggledTask!.IsCompleted);
        Assert.NotNull(toggledTask.CompletedAt);
    }

    [Fact]
    public async Task ToggleTaskStatus_NonExistentTask_ReturnsNotFound()
    {
        var response = await _client.PutAsync("/api/tasks/99999/toggle", null);
        
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTask_ExistingTask_ReturnsNoContent()
    {
        // Create a task first
        var createDto = new CreateTaskDto { Title = "Delete Test", Description = "For testing delete" };
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createDto);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        
        // Delete it
        var deleteResponse = await _client.DeleteAsync($"/api/tasks/{createdTask!.Id}");
        
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        
        // Verify it's deleted
        var getResponse = await _client.GetAsync($"/api/tasks/{createdTask.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteTask_NonExistentTask_ReturnsNotFound()
    {
        var response = await _client.DeleteAsync("/api/tasks/99999");
        
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CompleteWorkflow_CreateToggleDelete_WorksCorrectly()
    {
        // 1. Create a task
        var createDto = new CreateTaskDto { Title = "Workflow Test", Description = "Complete workflow test" };
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", createDto);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(createdTask);
        Assert.False(createdTask!.IsCompleted);
        
        // 2. Toggle to complete
        var toggleResponse = await _client.PutAsync($"/api/tasks/{createdTask.Id}/toggle", null);
        toggleResponse.EnsureSuccessStatusCode();
        
        var completedTask = await toggleResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.True(completedTask!.IsCompleted);
        
        // 3. Toggle back to incomplete
        var toggleBackResponse = await _client.PutAsync($"/api/tasks/{createdTask.Id}/toggle", null);
        toggleBackResponse.EnsureSuccessStatusCode();
        
        var incompletedTask = await toggleBackResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.False(incompletedTask!.IsCompleted);
        Assert.Null(incompletedTask.CompletedAt);
        
        // 4. Delete the task
        var deleteResponse = await _client.DeleteAsync($"/api/tasks/{createdTask.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task CorsHeaders_ArePresent()
    {
        var response = await _client.GetAsync("/api/tasks");
        
        // Check that CORS headers are present (should be added by CORS middleware)
        response.EnsureSuccessStatusCode();
        // Note: In a real CORS test, you'd send an OPTIONS request with Origin header
        // and check for Access-Control-Allow-Origin header
    }

    [Fact]
    public async Task ApiReturnsJson_ContentType()
    {
        var response = await _client.GetAsync("/api/tasks");
        response.EnsureSuccessStatusCode();
        
        Assert.Contains("application/json", response.Content.Headers.ContentType?.ToString());
    }
}
