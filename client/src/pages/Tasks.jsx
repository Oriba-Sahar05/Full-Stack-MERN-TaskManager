import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', sort: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, formData);
        setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
        setEditingTask(null);
      } else {
        const { data } = await api.post('/tasks', formData);
        setTasks((prev) => [data, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="page tasks-page">
      <h2>My Tasks</h2>
      <p className="page-subtitle">Create, filter, and update your tasks.</p>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm
        onSubmit={handleCreateOrUpdate}
        editingTask={editingTask}
        onCancelEdit={() => setEditingTask(null)}
        submitting={submitting}
      />

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <input
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort: Newest</option>
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      {loading ? (
        <Loader label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add one above.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
