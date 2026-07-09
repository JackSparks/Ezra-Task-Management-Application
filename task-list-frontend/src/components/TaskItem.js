import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={handleToggle}
            id={`task-${task.id}`}
            aria-checked={task.isCompleted}
          />
          <label htmlFor={`task-${task.id}`} className="checkbox-label" aria-hidden="true">
            <svg className="checkbox-check" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>

        <div
          className="task-details"
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Toggle task: ${task.title}`}
        >
          <h3 className={`task-title ${task.isCompleted ? 'strikethrough' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className="task-created">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6 3.5V6L7.5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Created: {formatDate(task.createdAt)}
            </span>
            {task.isCompleted && task.completedAt && (
              <span className="task-completed">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Completed: {formatDate(task.completedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        title="Delete task"
        aria-label="✕"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </article>
  );
};

export default TaskItem;
