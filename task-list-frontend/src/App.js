import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskService } from './services/taskService';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getAllTasks();
      // Filter out any invalid tasks (missing title, etc.)
      const validTasks = tasksData.filter(task => 
        task && 
        task.title && 
        task.title.trim().length > 0 &&
        typeof task.isCompleted === 'boolean'
      );
      setTasks(validTasks);
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend server is running.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setSubmitting(true);
      setError(null);
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setError(null);
      const updatedTask = await taskService.toggleTask(taskId);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError(null);
        await taskService.deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1>📝 Task Manager</h1>
          <p>Keep track of your tasks and stay organized</p>
        </header>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              className="retry-btn" 
              onClick={loadTasks}
              title="Retry loading tasks"
            >
              🔄
            </button>
          </div>
        )}

        <main className="app-main">
          <TaskForm 
            onSubmit={handleCreateTask} 
            loading={submitting}
          />
          
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            loading={loading}
          />
        </main>

        <footer className="app-footer">
          <p>Built with React and .NET Core</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
