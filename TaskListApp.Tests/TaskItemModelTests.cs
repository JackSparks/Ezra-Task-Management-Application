using Xunit;
using TaskListApp.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
using System.Linq;

namespace TaskListApp.Tests;

public class TaskItemModelTests
{
    [Fact]
    public void TaskItem_DefaultValues_AreSetCorrectly()
    {
        var task = new TaskItem();

        Assert.Equal(0, task.Id);
        Assert.Equal(string.Empty, task.Title);
        Assert.Null(task.Description);
        Assert.False(task.IsCompleted);
        Assert.NotEqual(default(DateTime), task.CreatedAt);
        Assert.Null(task.CompletedAt);
    }

    [Fact]
    public void TaskItem_AllProperties_CanBeSet()
    {
        var createdAt = DateTime.UtcNow;
        var completedAt = createdAt.AddHours(2);

        var task = new TaskItem
        {
            Id = 42,
            Title = "Test Task",
            Description = "Test Description",
            IsCompleted = true,
            CreatedAt = createdAt,
            CompletedAt = completedAt
        };

        Assert.Equal(42, task.Id);
        Assert.Equal("Test Task", task.Title);
        Assert.Equal("Test Description", task.Description);
        Assert.True(task.IsCompleted);
        Assert.Equal(createdAt, task.CreatedAt);
        Assert.Equal(completedAt, task.CompletedAt);
    }

    [Fact]
    public void TaskItem_TitleValidation_RequiredAttribute()
    {
        var task = new TaskItem { Title = null! };
        var validationResults = ValidateModel(task);

        Assert.Contains(validationResults, v => 
            v.MemberNames.Contains(nameof(TaskItem.Title)) && 
            v.ErrorMessage!.Contains("required"));
    }

    [Fact]
    public void TaskItem_TitleValidation_MaxLengthAttribute()
    {
        var task = new TaskItem { Title = new string('A', 201) }; // Exceeds 200 chars
        var validationResults = ValidateModel(task);

        Assert.Contains(validationResults, v => 
            v.MemberNames.Contains(nameof(TaskItem.Title)));
    }

    [Fact]
    public void TaskItem_DescriptionValidation_MaxLengthAttribute()
    {
        var task = new TaskItem 
        { 
            Title = "Valid Title",
            Description = new string('A', 1001) // Exceeds 1000 chars
        };
        var validationResults = ValidateModel(task);

        Assert.Contains(validationResults, v => 
            v.MemberNames.Contains(nameof(TaskItem.Description)));
    }

    [Fact]
    public void TaskItem_ValidData_PassesValidation()
    {
        var task = new TaskItem
        {
            Title = "Valid Task",
            Description = "Valid Description",
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        var validationResults = ValidateModel(task);
        
        Assert.Empty(validationResults);
    }

    [Fact]
    public void TaskItem_CreatedAtDefault_IsSetAutomatically()
    {
        var beforeCreation = DateTime.UtcNow;
        var task = new TaskItem { Title = "Test" };
        var afterCreation = DateTime.UtcNow;

        Assert.True(task.CreatedAt >= beforeCreation);
        Assert.True(task.CreatedAt <= afterCreation);
    }

    [Fact]
    public void TaskItem_IsCompletedDefault_IsFalse()
    {
        var task = new TaskItem { Title = "Test" };
        
        Assert.False(task.IsCompleted);
    }

    [Fact]
    public void TaskItem_CompletedAtDefault_IsNull()
    {
        var task = new TaskItem { Title = "Test" };
        
        Assert.Null(task.CompletedAt);
    }

    private static List<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model);
        Validator.TryValidateObject(model, validationContext, validationResults, true);
        return validationResults;
    }
}
