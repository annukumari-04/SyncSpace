import { useState, useEffect } from 'react';
import { Users, Mail, Briefcase, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users', formData);
      toast.success('Member added successfully');
      setMembers([...members, data]);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'Member' });
    } catch (error) {
      // Error toast handled by interceptor
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Team Members</h1>
          <p className="text-textMuted text-sm mt-1">Manage your organization's members</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <div key={member._id} className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-textMain font-bold text-xl mb-4 shadow-lg">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-textMain">{member.name}</h3>
            <span className="badge mt-2 mb-4">{member.role}</span>
            
            <div className="w-full space-y-2 text-sm text-left">
              <div className="flex items-center gap-2 text-textMuted">
                <Mail size={14} className="text-primary" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-textMuted">
                <Briefcase size={14} className="text-primary" />
                <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
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
              className="glass-panel w-full max-w-md p-6 relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-textMain">Add Team Member</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-textMuted hover:text-textMain"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Temporary Password</label>
                  <input type="password" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field bg-surface appearance-none">
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Add Member</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;
