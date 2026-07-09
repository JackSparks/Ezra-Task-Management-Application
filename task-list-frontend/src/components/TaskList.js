import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const StatCard = ({ label, value, variant }) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div className="stat-card__icon" aria-hidden="true">
      {variant === 'total' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 9H12M6 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
      {variant === 'pending' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 5V9L11.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
      {variant === 'completed' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5.5 9L8 11.5L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <div className="stat-card__content">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </div>
  </div>
);

const TaskList = ({ tasks, onToggle, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner" role="status" aria-label="Loading">
          <div className="loading-spinner__ring" />
        </div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="8" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            <path d="M16 24H32M16 18H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <circle cx="36" cy="36" r="8" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="1.5"/>
            <path d="M33 36H39M36 33V39" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
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
        <StatCard label="Total:" value={tasks.length} variant="total" />
        <StatCard label="Pending:" value={pendingTasks.length} variant="pending" />
        <StatCard label="Completed:" value={completedTasks.length} variant="completed" />
      </div>

      {pendingTasks.length > 0 && (
        <section className="task-section">
          <h3 className="section-title">
            <span className="section-title__indicator section-title__indicator--pending" aria-hidden="true" />
            Pending Tasks ({pendingTasks.length})
          </h3>
          <div className="task-section__items">
            {pendingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section className="task-section">
          <h3 className="section-title">
            <span className="section-title__indicator section-title__indicator--completed" aria-hidden="true" />
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="task-section__items">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TaskList;
