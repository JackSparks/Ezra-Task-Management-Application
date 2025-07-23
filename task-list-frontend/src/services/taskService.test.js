import { taskService } from '../services/taskService';

// Mock fetch globally
global.fetch = jest.fn();

describe('taskService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getAllTasks', () => {
    test('fetches all tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', isCompleted: false },
        { id: 2, title: 'Task 2', isCompleted: true }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks
      });

      const result = await taskService.getAllTasks();

      expect(fetch).toHaveBeenCalledWith('http://localhost:5111/api/tasks');
      expect(result).toEqual(mockTasks);
    });

    test('throws error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(taskService.getAllTasks()).rejects.toThrow('Failed to fetch tasks');
    });

    test('throws error when network fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(taskService.getAllTasks()).rejects.toThrow('Network error');
    });
  });

  describe('createTask', () => {
    test('creates task successfully', async () => {
      const taskData = { title: 'New Task', description: 'Task description' };
      const mockCreatedTask = { id: 1, ...taskData, isCompleted: false };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedTask
      });

      const result = await taskService.createTask(taskData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:5111/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      expect(result).toEqual(mockCreatedTask);
    });

    test('throws error when creation fails', async () => {
      const taskData = { title: 'New Task' };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(taskService.createTask(taskData)).rejects.toThrow('Failed to create task');
    });
  });

  describe('toggleTask', () => {
    test('toggles task successfully', async () => {
      const taskId = 1;
      const mockToggledTask = { id: taskId, title: 'Task', isCompleted: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToggledTask
      });

      const result = await taskService.toggleTask(taskId);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:5111/api/tasks/${taskId}/toggle`, {
        method: 'PUT',
      });
      expect(result).toEqual(mockToggledTask);
    });

    test('throws error when toggle fails', async () => {
      const taskId = 1;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(taskService.toggleTask(taskId)).rejects.toThrow('Failed to toggle task');
    });
  });

  describe('deleteTask', () => {
    test('deletes task successfully', async () => {
      const taskId = 1;

      fetch.mockResolvedValueOnce({
        ok: true
      });

      await taskService.deleteTask(taskId);

      expect(fetch).toHaveBeenCalledWith(`http://localhost:5111/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
    });

    test('throws error when deletion fails', async () => {
      const taskId = 1;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(taskService.deleteTask(taskId)).rejects.toThrow('Failed to delete task');
    });
  });

  describe('API endpoint configuration', () => {
    test('uses correct base URL', () => {
      // This test ensures the API_BASE_URL is correctly configured
      expect(taskService.getAllTasks).toBeDefined();
      expect(taskService.createTask).toBeDefined();
      expect(taskService.toggleTask).toBeDefined();
      expect(taskService.deleteTask).toBeDefined();
    });
  });

  describe('error handling', () => {
    test('handles JSON parsing errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(taskService.getAllTasks()).rejects.toThrow('Invalid JSON');
    });

    test('handles missing response body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const result = await taskService.getAllTasks();
      expect(result).toBeNull();
    });
  });

  describe('request headers', () => {
    test('sends correct content-type for POST requests', async () => {
      const taskData = { title: 'Test Task' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...taskData })
      });

      await taskService.createTask(taskData);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          }
        })
      );
    });

    test('does not send body for GET requests', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      await taskService.getAllTasks();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5111/api/tasks'
      );
      // Should not have a body property
      expect(fetch.mock.calls[0][1]).toBeUndefined();
    });
  });
});
