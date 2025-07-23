import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskItem from '../components/TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    isCompleted: false,
    createdAt: '2025-01-15T10:00:00Z',
    completedAt: null
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
  });

  test('renders task information correctly', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  test('shows task as incomplete when not completed', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('shows task as complete when completed', () => {
    const completedTask = {
      ...mockTask,
      isCompleted: true,
      completedAt: '2025-01-15T11:00:00Z'
    };

    render(
      <TaskItem 
        task={completedTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('calls onToggle when checkbox is clicked', async () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(mockTask.id);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete when delete button is clicked', async () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: '✕' });
    await userEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  test('renders task without description', () => {
    const taskWithoutDesc = {
      ...mockTask,
      description: null
    };

    render(
      <TaskItem 
        task={taskWithoutDesc} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  test('formats and displays creation date', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    // Check that some date text is rendered (exact format may vary by locale)
    const dateText = screen.getByText(/Jan|January/);
    expect(dateText).toBeInTheDocument();
  });

  test('displays completion date when task is completed', () => {
    const completedTask = {
      ...mockTask,
      isCompleted: true,
      completedAt: '2025-01-15T12:00:00Z'
    };

    render(
      <TaskItem 
        task={completedTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    // Should show both created and completed dates
    const completedText = screen.getByText(/completed/i);
    expect(completedText).toBeInTheDocument();
  });

  test('handles empty title gracefully', () => {
    const taskWithEmptyTitle = {
      ...mockTask,
      title: ''
    };

    render(
      <TaskItem 
        task={taskWithEmptyTitle} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    // Should still render without crashing
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  test('maintains proper DOM structure for styling', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    // Test that key elements are present for styling purposes
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('does not call handlers when task is undefined', () => {
    // This test ensures robustness against edge cases
    const undefinedTask = undefined;
    
    expect(() => {
      render(
        <TaskItem 
          task={undefinedTask} 
          onToggle={mockOnToggle} 
          onDelete={mockOnDelete} 
        />
      );
    }).toThrow(); // Should throw since task is required
  });
});
