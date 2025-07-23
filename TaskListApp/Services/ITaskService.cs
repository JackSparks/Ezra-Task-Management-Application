using TaskListApp.DTOs;

namespace TaskListApp.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllTasksAsync();
    Task<TaskDto?> GetTaskByIdAsync(int id);
    Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto);
    Task<TaskDto?> ToggleTaskStatusAsync(int id);
    Task<bool> DeleteTaskAsync(int id);
}
