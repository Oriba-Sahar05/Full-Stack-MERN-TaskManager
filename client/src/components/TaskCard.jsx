import { Tag, Calendar } from 'lucide-react';

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const isOverdue =
    task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`task-card ${task.status === 'done' ? 'task-done' : ''}`}
      data-priority={task.priority}
    >
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <span className="priority-badge" data-priority={task.priority}>
          {task.priority}
        </span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className="tag">
          <Tag size={11} /> {task.category}
        </span>
        <span className="tag">{statusLabels[task.status]}</span>
        {task.dueDate && (
          <span className={`tag ${isOverdue ? 'tag-overdue' : ''}`}>
            <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-actions">
        <select value={task.status} onChange={(e) => onToggleStatus(task._id, e.target.value)}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button className="btn-secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
