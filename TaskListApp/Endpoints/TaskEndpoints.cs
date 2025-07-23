using Microsoft.AspNetCore.Mvc;
using TaskListApp.DTOs;
using TaskListApp.Services;

namespace TaskListApp.Endpoints;

/// <summary>
/// Provides extension methods to map task-related API endpoints.
/// </summary>
public static class TaskEndpoints
{
    /// <summary>
    /// Maps all task management endpoints to the provided endpoint route builder.
    /// </summary>
    /// <param name="endpoints">The endpoint route builder to map endpoints to.</param>
    public static void MapTaskEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var taskGroup = endpoints.MapGroup("/api/tasks")
            .WithTags("Tasks");

        taskGroup.MapGet("/", async (ITaskService taskService) =>
        {
            var tasks = await taskService.GetAllTasksAsync();
            return Results.Ok(tasks);
        })
        .WithName("GetAllTasks")
        .Produces<IEnumerable<TaskDto>>(StatusCodes.Status200OK);

        taskGroup.MapGet("/{id:int}", async (int id, ITaskService taskService) =>
        {
            var task = await taskService.GetTaskByIdAsync(id);
            return task != null ? Results.Ok(task) : Results.NotFound($"Task with ID {id} not found");
        })
        .WithName("GetTaskById")
        .Produces<TaskDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        taskGroup.MapPost("/", async ([FromBody] CreateTaskDto createTaskDto, ITaskService taskService) =>
        {
            if (string.IsNullOrWhiteSpace(createTaskDto.Title))
            {
                return Results.BadRequest("Task title is required");
            }

            var task = await taskService.CreateTaskAsync(createTaskDto);
            return Results.Created($"/api/tasks/{task.Id}", task);
        })
        .WithName("CreateTask")
        .Accepts<CreateTaskDto>("application/json")
        .Produces<TaskDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);

        taskGroup.MapPut("/{id:int}/toggle", async (int id, ITaskService taskService) =>
        {
            var task = await taskService.ToggleTaskStatusAsync(id);
            return task != null ? Results.Ok(task) : Results.NotFound($"Task with ID {id} not found");
        })
        .WithName("ToggleTaskStatus")
        .Produces<TaskDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        taskGroup.MapDelete("/{id:int}", async (int id, ITaskService taskService) =>
        {
            var deleted = await taskService.DeleteTaskAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound($"Task with ID {id} not found");
        })
        .WithName("DeleteTask")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}
