import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListTodo, Loader2, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function ProgressRing({ percent, size = 84, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-ring-wrap">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="progress-ring-label">{percent}%</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const now = new Date();
  const overdue = tasks.filter(
    (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now
  ).length;
  const dueToday = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== 'done' &&
      new Date(t.dueDate).toDateString() === now.toDateString()
  ).length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="page dashboard-page">
      <h2>Welcome back, {user?.name}</h2>
      <p className="page-subtitle">Here's where things stand today.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="progress-card">
        <ProgressRing percent={completionRate} />
        <div className="progress-text">
          <h3>{completed} of {tasks.length || 0} tasks completed</h3>
          <p>
            {tasks.length === 0
              ? 'Add your first task to start tracking progress.'
              : completionRate === 100
              ? 'Everything is done. Nice work.'
              : `${tasks.length - completed} task${tasks.length - completed === 1 ? '' : 's'} left to go.`}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon">
            <ListTodo size={18} />
          </span>
          <div>
            <span className="stat-number">{tasks.length}</span>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card stat-info">
          <span className="stat-icon">
            <Loader2 size={18} />
          </span>
          <div>
            <span className="stat-number">{inProgress}</span>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card stat-success">
          <span className="stat-icon">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <span className="stat-number">{completed}</span>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <span className="stat-icon">
            <Clock size={18} />
          </span>
          <div>
            <span className="stat-number">{dueToday}</span>
            <div className="stat-label">Due Today</div>
          </div>
        </div>
        <div className="stat-card stat-danger">
          <span className="stat-icon">
            <AlertTriangle size={18} />
          </span>
          <div>
            <span className="stat-number">{overdue}</span>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      <Link to="/tasks" className="btn-primary dashboard-cta">
        Go to Tasks <ArrowRight size={15} />
      </Link>
    </div>
  );
}
