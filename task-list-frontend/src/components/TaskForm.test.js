import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  test('submits form with title only', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    await userEvent.type(titleInput, 'Test Task Title');
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task Title',
      description: null
    });
  });

  test('submits form with title and description', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
  });

  test('trims whitespace from inputs', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    await userEvent.type(titleInput, '  Test Task  ');
    await userEvent.type(descriptionInput, '  Test Description  ');
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
  });

  test('does not submit with empty title', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    await userEvent.type(titleInput, '   '); // Only whitespace
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('clears form after successful submission', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.click(submitButton);
    
    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  test('shows loading state', () => {
    render(<TaskForm onSubmit={mockOnSubmit} loading={true} />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/adding/i);
  });

  test('prevents submission while loading', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={true} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole('button');
    
    await userEvent.type(titleInput, 'Test Task');
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('handles form submission via Enter key', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    
    await userEvent.type(titleInput, 'Test Task{enter}');
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: null
    });
  });

  test('treats empty description as null', async () => {
    
    render(<TaskForm onSubmit={mockOnSubmit} loading={false} />);
    
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });
    
    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, '   '); // Only whitespace
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: null
    });
  });
});
