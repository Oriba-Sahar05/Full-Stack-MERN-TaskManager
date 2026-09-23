import { useState, useEffect } from 'react';

const emptyTask = {
  title: '',
  description: '',
  category: 'General',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
};

export default function TaskForm({ onSubmit, editingTask, onCancelEdit, submitting }) {
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        category: editingTask.category || 'General',
        priority: editingTask.priority || 'medium',
        status: editingTask.status || 'todo',
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyTask);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
    if (!editingTask) setForm(emptyTask);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>

      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />

      <div className="form-row">
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
