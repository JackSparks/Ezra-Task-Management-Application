import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../components/TaskList';

describe('TaskList', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Completed Task',
      description: 'This is completed',
      isCompleted: true,
      createdAt: '2025-01-15T10:00:00Z',
      completedAt: '2025-01-15T11:00:00Z'
    },
    {
      id: 2,
      title: 'Pending Task',
      description: 'This is pending',
      isCompleted: false,
      createdAt: '2025-01-15T12:00:00Z',
      completedAt: null
    },
    {
      id: 3,
      title: 'Another Pending Task',
      description: null,
      isCompleted: false,
      createdAt: '2025-01-15T13:00:00Z',
      completedAt: null
    }
  ];

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
  });

  test('renders loading state', () => {
    render(
      <TaskList 
        tasks={[]} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={true} 
      />
    );

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  test('renders empty state when no tasks', () => {
    render(
      <TaskList 
        tasks={[]} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
  });

  test('renders task list with tasks', () => {
    render(
      <TaskList 
        tasks={mockTasks} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    // Should show all task titles
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('Another Pending Task')).toBeInTheDocument();
  });

  test('displays task statistics correctly', () => {
    render(
      <TaskList 
        tasks={mockTasks} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    // Should show statistics: 1 completed, 2 pending out of 3 total
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Completed:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Pending:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('separates completed and pending tasks', () => {
    render(
      <TaskList 
        tasks={mockTasks} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    // Should have sections for pending and completed tasks
    expect(screen.getByText(/pending tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/completed tasks/i)).toBeInTheDocument();
  });

  test('renders correct number of task items', () => {
    render(
      <TaskList 
        tasks={mockTasks} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    // Should have 3 checkboxes (one per task)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    // Should have 3 delete buttons (one per task)
    const deleteButtons = screen.getAllByRole('button', { name: '✕' });
    expect(deleteButtons).toHaveLength(3);
  });





  test('does not show loading when loading is false', () => {
    render(
      <TaskList 
        tasks={mockTasks} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
  });

  test('does not show empty state when there are tasks', () => {
    render(
      <TaskList 
        tasks={mockTasks} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={false} 
      />
    );

    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/add your first task/i)).not.toBeInTheDocument();
  });

  test('shows loading state even with empty tasks array', () => {
    render(
      <TaskList 
        tasks={[]} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
        loading={true} 
      />
    );

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });
});
