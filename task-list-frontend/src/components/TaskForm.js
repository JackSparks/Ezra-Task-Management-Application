import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || null
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <section className="task-form-section" aria-label="Create new task">
      <div className="task-form-header">
        <h2 className="task-form-title">New Task</h2>
        <p className="task-form-subtitle">Add a task to your list</p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            disabled={loading}
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={3}
            disabled={loading}
            maxLength={1000}
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="submit-btn__spinner" aria-hidden="true" />
              Adding...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Task
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default TaskForm;
