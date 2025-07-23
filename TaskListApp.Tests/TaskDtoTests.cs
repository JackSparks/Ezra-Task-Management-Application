using Xunit;
using TaskListApp.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
using System.Linq;

namespace TaskListApp.Tests;

public class TaskDtoTests
{
    [Fact]
    public void CreateTaskDto_ValidData_PassesValidation()
    {
        var dto = new CreateTaskDto
        {
            Title = "Valid Task",
            Description = "Valid Description"
        };

        var validationResults = ValidateDto(dto);
        
        Assert.Empty(validationResults);
    }

    [Fact]
    public void CreateTaskDto_EmptyTitle_FailsValidation()
    {
        var dto = new CreateTaskDto
        {
            Title = "",
            Description = "Valid Description"
        };

        var validationResults = ValidateDto(dto);
        
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains(nameof(CreateTaskDto.Title)));
    }

    [Fact]
    public void CreateTaskDto_NullTitle_FailsValidation()
    {
        var dto = new CreateTaskDto
        {
            Title = null!,
            Description = "Valid Description"
        };

        var validationResults = ValidateDto(dto);
        
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains(nameof(CreateTaskDto.Title)));
    }

    [Fact]
    public void CreateTaskDto_TitleTooLong_FailsValidation()
    {
        var dto = new CreateTaskDto
        {
            Title = new string('A', 201), // Exceeds 200 char limit
            Description = "Valid Description"
        };

        var validationResults = ValidateDto(dto);
        
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains(nameof(CreateTaskDto.Title)));
    }

    [Fact]
    public void CreateTaskDto_DescriptionTooLong_FailsValidation()
    {
        var dto = new CreateTaskDto
        {
            Title = "Valid Title",
            Description = new string('A', 1001) // Exceeds 1000 char limit
        };

        var validationResults = ValidateDto(dto);
        
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains(nameof(CreateTaskDto.Description)));
    }

    [Fact]
    public void CreateTaskDto_NullDescription_PassesValidation()
    {
        var dto = new CreateTaskDto
        {
            Title = "Valid Title",
            Description = null
        };

        var validationResults = ValidateDto(dto);
        
        Assert.Empty(validationResults);
    }

    [Fact]
    public void TaskDto_PropertiesSetCorrectly()
    {
        var now = DateTime.UtcNow;
        var completedAt = now.AddHours(1);

        var dto = new TaskDto
        {
            Id = 1,
            Title = "Test Task",
            Description = "Test Description",
            IsCompleted = true,
            CreatedAt = now,
            CompletedAt = completedAt
        };

        Assert.Equal(1, dto.Id);
        Assert.Equal("Test Task", dto.Title);
        Assert.Equal("Test Description", dto.Description);
        Assert.True(dto.IsCompleted);
        Assert.Equal(now, dto.CreatedAt);
        Assert.Equal(completedAt, dto.CompletedAt);
    }

    [Fact]
    public void ToggleTaskStatusDto_PropertiesSetCorrectly()
    {
        var dto = new ToggleTaskStatusDto
        {
            IsCompleted = true
        };

        Assert.True(dto.IsCompleted);

        dto.IsCompleted = false;
        Assert.False(dto.IsCompleted);
    }

    private static List<ValidationResult> ValidateDto(object dto)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(dto);
        Validator.TryValidateObject(dto, validationContext, validationResults, true);
        return validationResults;
    }
}
