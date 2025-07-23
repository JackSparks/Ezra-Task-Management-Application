import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = () => {
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
    <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={handleToggle}
            id={`task-${task.id}`}
            aria-checked={task.isCompleted}
          />
        </div>
        <div className="task-details" onClick={handleToggle}>
          <h3 className={`task-title ${task.isCompleted ? 'strikethrough' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className="task-created">Created: {formatDate(task.createdAt)}</span>
            {task.isCompleted && task.completedAt && (
              <span className="task-completed">Completed: {formatDate(task.completedAt)}</span>
            )}
          </div>
        </div>
      </div>
      <button className="delete-btn" onClick={handleDelete} title="Delete task" aria-label="✕">
        ✕
      </button>
    </div>
  );
};

export default TaskItem;
