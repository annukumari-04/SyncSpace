import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', project: '', priority: 'Medium', assignedTo: '' });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      if(projectsRes.data.length > 0) {
        setFormData(prev => ({ ...prev, project: projectsRes.data[0]._id }));
      }
    } catch (error) {
      // Error toast handles it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted');
        setTasks(tasks.filter(t => t._id !== id));
      } catch (error) {}
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.project) return toast.error('Please create a project first');
    
    try {
      const payload = { ...formData };
      if (!payload.assignedTo) {
        delete payload.assignedTo;
      }
      
      const { data } = await api.post('/tasks', payload);
      toast.success('Task created successfully');
      fetchData(); // Refetch to get populated fields
      setIsModalOpen(false);
      setFormData({ title: '', description: '', project: projects[0]?._id || '', priority: 'Medium', assignedTo: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      console.error(error);
    }
  };

  const priorityColors = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const statusColors = {
    'Todo': 'bg-gray-500/20 text-textMuted border-gray-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Completed': 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Tasks</h1>
          <p className="text-textMuted text-sm mt-1">Manage tasks across all projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surfaceItem">
                <th className="p-4 text-sm font-semibold text-textMain">Task</th>
                <th className="p-4 text-sm font-semibold text-textMain">Project</th>
                <th className="p-4 text-sm font-semibold text-textMain">Assignee</th>
                <th className="p-4 text-sm font-semibold text-textMain">Status</th>
                <th className="p-4 text-sm font-semibold text-textMain">Priority</th>
                <th className="p-4 text-sm font-semibold text-textMain text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-textMuted">No tasks available.</td>
                </tr>
              ) : (
                tasks.map((task, i) => (
                  <motion.tr 
                    key={task._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-border hover:bg-surfaceItem transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-sm font-medium text-textMain">{task.title}</p>
                    </td>
                    <td className="p-4 text-sm text-textMuted">
                      {task.project?.title || 'Unknown Project'}
                    </td>
                    <td className="p-4 text-sm text-textMuted">
                      {task.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <span className={`badge ${statusColors[task.status]}`}>{task.status}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(task._id)} className="p-2 text-textMuted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="glass-panel w-full max-w-md p-6 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-textMain">Create Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-textMuted hover:text-textMain"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Task Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="e.g. Design Homepage" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Description</label>
                  <textarea required rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" placeholder="Details..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Assign To</label>
                  <select value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="input-field bg-surface appearance-none">
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-textMain mb-1">Project</label>
                    <select required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="input-field bg-surface appearance-none">
                      {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMain mb-1">Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="input-field bg-surface appearance-none">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
