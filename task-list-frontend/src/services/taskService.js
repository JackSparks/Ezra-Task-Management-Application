// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:5111/api';

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  },

  // Toggle task completion status
  toggleTask: async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle task');
    }
    return response.json();
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    return response.ok;
  },
};
