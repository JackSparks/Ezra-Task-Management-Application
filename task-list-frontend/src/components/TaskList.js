import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onToggle, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Add your first task above to get started!</p>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.isCompleted);
  const pendingTasks = tasks.filter(task => !task.isCompleted);

  return (
    <div className="task-list">
      <div className="task-stats">
        <span className="stat">
          <span>Total:</span> <span>{tasks.length}</span>
        </span>
        <span className="stat">
          <span>Pending:</span> <span>{pendingTasks.length}</span>
        </span>
        <span className="stat">
          <span>Completed:</span> <span>{completedTasks.length}</span>
        </span>
      </div>

      {pendingTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">Pending Tasks ({pendingTasks.length})</h3>
          {pendingTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">Completed Tasks ({completedTasks.length})</h3>
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
