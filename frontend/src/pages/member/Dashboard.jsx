import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, LayoutDashboard } from 'lucide-react';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-textMuted font-medium">{title}</h3>
      <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}><Icon size={20} /></div>
    </div>
    <div className="text-3xl font-bold text-textMain">{value}</div>
  </motion.div>
);

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (error) {} finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.filter(t => t.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textMain">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Assigned" value={tasks.length} icon={LayoutDashboard} color="primary" delay={0.1} />
        <StatCard title="Completed" value={completed} icon={CheckSquare} color="green" delay={0.2} />
        <StatCard title="Pending" value={pending} icon={Clock} color="orange" delay={0.3} />
      </div>

      <div className="glass-panel p-6 mt-8">
        <h2 className="text-lg font-semibold text-textMain mb-4">Upcoming Deadlines</h2>
        {pending === 0 ? (
          <p className="text-textMuted">No pending tasks at the moment.</p>
        ) : (
          <div className="space-y-4">
            {tasks.filter(t => t.status !== 'Completed').slice(0, 5).map(task => (
              <div key={task._id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-border">
                <div>
                  <h4 className="text-sm font-medium text-textMain">{task.title}</h4>
                  <p className="text-xs text-textMuted mt-1">Project: {task.project?.title}</p>
                </div>
                <span className={`badge ${task.priority === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
