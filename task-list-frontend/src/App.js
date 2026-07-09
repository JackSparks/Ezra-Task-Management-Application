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

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getAllTasks();
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
      <div className="app-background" aria-hidden="true">
        <div className="app-background__gradient" />
        <div className="app-background__grid" />
      </div>

      <div className="app-container">
        <header className="app-header">
          <div className="app-header__brand">
            <div className="app-header__logo" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5.5L8.5 11L17 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16.5H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="app-header__text">
              <h1>Task Manager</h1>
              <p>Keep track of your tasks and stay organized</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
              </svg>
            </span>
            <span className="error-text">{error}</span>
            <button
              className="retry-btn"
              onClick={loadTasks}
              title="Retry loading tasks"
              aria-label="Retry loading tasks"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12.25 7A5.25 5.25 0 1 1 7 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12.25 2.75V7H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
