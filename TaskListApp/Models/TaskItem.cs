using System.ComponentModel.DataAnnotations;

namespace TaskListApp.Models;

/// <summary>
/// Represents a task in the system.
/// </summary>
public class TaskItem
{
    /// <summary>
    /// The unique identifier for the task.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The title of the task.
    /// </summary>
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// The optional description of the task.
    /// </summary>
    [StringLength(1000)]
    public string? Description { get; set; }

    /// <summary>
    /// Indicates whether the task is completed.
    /// </summary>
    public bool IsCompleted { get; set; } = false;

    /// <summary>
    /// The UTC date and time when the task was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// The UTC date and time when the task was completed (if any).
    /// </summary>
    public DateTime? CompletedAt { get; set; }
}
