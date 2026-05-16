import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Users, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', members: [] });

  const fetchProjects = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      // toast error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted successfully');
        setProjects(projects.filter(p => p._id !== id));
      } catch (error) {
        // Handled
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', formData);
      toast.success('Project created successfully');
      setProjects([...projects, data]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', members: [] });
    } catch (error) {
      // Handled
    }
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Projects</h1>
          <p className="text-textMuted text-sm mt-1">Manage all organization projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surfaceItem rounded-full flex items-center justify-center mb-4">
            <Folder size={28} className="text-textMuted" />
          </div>
          <h3 className="text-lg font-medium text-textMain mb-2">No projects found</h3>
          <p className="text-textMuted mb-6">Get started by creating your first project.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-secondary">Create Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-textMain font-bold text-xl border border-border">
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 text-textMuted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-textMain mb-2">{project.title}</h3>
                <p className="text-sm text-textMuted line-clamp-2 mb-6 flex-1">{project.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-textMuted">
                    <Users size={14} />
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                  <span className="text-xs text-textMuted">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="glass-panel w-full max-w-md p-6 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-textMain">Create Project</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-textMuted hover:text-textMain">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Project Title</label>
                  <input 
                    type="text" required
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="input-field" placeholder="e.g. Website Redesign" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Description</label>
                  <textarea 
                    required rows="3"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="input-field resize-none" placeholder="Project details..." 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textMain mb-2">Assign Team Members</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {users.map(user => (
                      <label key={user._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surfaceItem cursor-pointer transition-colors border border-transparent hover:border-border">
                        <input
                          type="checkbox"
                          checked={formData.members.includes(user._id)}
                          onChange={() => handleMemberToggle(user._id)}
                          className="w-4 h-4 rounded bg-black/50 border-border text-primary focus:ring-primary focus:ring-offset-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-textMain">{user.name}</span>
                          <span className="text-xs text-textMuted">{user.email}</span>
                        </div>
                      </label>
                    ))}
                    {users.length === 0 && <p className="text-sm text-textMuted">No users available.</p>}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Create Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
