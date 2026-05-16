import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StatCard = ({ title, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="glass-panel p-6 flex flex-col justify-between min-h-[120px]"
  >
    <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">{title}</h3>
    <div className="text-5xl font-extrabold text-textMain tracking-tighter mt-4">{value}</div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/users')
        ]);
        
        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        setStats({
          projects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'Completed').length,
          pendingTasks: tasks.filter(t => t.status !== 'Completed').length,
        });

        setAllTasks(tasks);
        setRecentTasks(tasks.slice(-5).reverse());
        setTeamMembers(usersRes.data.slice(-5).reverse());
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Calculate task stats for a specific user
  const getMemberTaskStats = (userId) => {
    const userTasks = allTasks.filter(t => t.assignedTo?._id === userId);
    const completed = userTasks.filter(t => t.status === 'Completed').length;
    return { total: userTasks.length, completed };
  };

  return (
    <div className="space-y-6 cursor-default">
      {/* Top Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <span className="text-[11px] font-bold text-primary tracking-widest uppercase block mb-1">Admin Workspace</span>
        <h1 className="text-4xl font-extrabold text-textMain tracking-tight mb-2">Overview</h1>
        <p className="text-textMuted font-medium">Track all projects, tasks, and team activity from the same unified shell.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} delay={0.1} />
        <StatCard title="Completed Tasks" value={stats.completedTasks} delay={0.2} />
        <StatCard title="Pending Tasks" value={stats.pendingTasks} delay={0.3} />
        <StatCard title="Active Projects" value={stats.projects} delay={0.4} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks Table Box */}
        <motion.div 
          onClick={() => navigate('/admin/tasks')}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-panel p-6 flex flex-col min-h-[250px] cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-textMain">Recent Tasks</h2>
            <span className="text-xs text-primary font-medium group-hover:underline">View All &rarr;</span>
          </div>
          {recentTasks.length === 0 ? (
             <p className="text-textMuted text-sm">No recent tasks.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 font-semibold text-textMuted uppercase text-[10px] tracking-wider">Task</th>
                    <th className="pb-3 font-semibold text-textMuted uppercase text-[10px] tracking-wider">Project</th>
                    <th className="pb-3 font-semibold text-textMuted uppercase text-[10px] tracking-wider">Priority</th>
                    <th className="pb-3 font-semibold text-textMuted uppercase text-[10px] tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map(task => (
                    <tr key={task._id} className="border-b border-border last:border-0 hover:bg-surfaceItem transition-colors">
                      <td className="py-3 font-medium text-textMain truncate max-w-[150px]">{task.title}</td>
                      <td className="py-3 text-textMuted truncate max-w-[120px]">{task.project?.title || '-'}</td>
                      <td className="py-3"><span className="badge">{task.priority}</span></td>
                      <td className="py-3"><span className="badge bg-surfaceItemHover">{task.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Recent Activity Box */}
        <motion.div 
          onClick={() => navigate('/admin/projects')}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-panel p-6 min-h-[250px] cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-textMain">Project Progress</h2>
            <span className="text-xs text-primary font-medium group-hover:underline">View All &rarr;</span>
          </div>
          <div className="flex flex-col gap-4">
             {/* Progress Placeholder for now */}
             <p className="text-sm text-textMuted">Overall task completion ratio across all active projects.</p>
             {stats.projects > 0 ? (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-textMain">Total Progress</span>
                    <span className="text-textMuted">{stats.totalTasks > 0 ? Math.round((stats.completedTasks/stats.totalTasks)*100) : 0}%</span>
                  </div>
                  <div className="w-full bg-surfaceItem rounded-full h-3 overflow-hidden border border-border">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks/stats.totalTasks)*100 : 0}%` }}></div>
                  </div>
                  <p className="text-xs text-textMuted mt-4">{stats.completedTasks} out of {stats.totalTasks} tasks completed.</p>
                </div>
             ) : (
                <p className="text-xs text-textMuted">No projects to track.</p>
             )}
          </div>
        </motion.div>

        {/* Team Members Box */}
        <motion.div 
          onClick={() => navigate('/admin/team')}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-panel p-6 min-h-[200px] lg:col-span-2 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-textMain">Team Member Performance</h2>
            <span className="text-xs text-primary font-medium group-hover:underline">Manage Team &rarr;</span>
          </div>
          {teamMembers.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-sm font-medium text-textMuted">
              No team members found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teamMembers.map(member => {
                const { total, completed } = getMemberTaskStats(member._id);
                return (
                  <div key={member._id} className="flex flex-col justify-between p-4 rounded-xl bg-surfaceItem border border-border">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shadow-inner">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-textMain">{member.name}</p>
                            <p className="text-xs text-textMuted">{member.role}</p>
                          </div>
                       </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-textMuted">Tasks Completed</span>
                          <span className="text-textMain">{completed} / {total}</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${total > 0 ? (completed/total)*100 : 0}%` }}
                          />
                        </div>
                     </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
