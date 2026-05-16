import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
      toast.success('Task status updated');
      setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (error) {}
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textMain">My Tasks</h1>
      
      <div className="grid gap-4">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <p className="text-textMuted p-6 glass-panel text-center">No tasks assigned to you yet.</p>
          ) : (
            tasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1.5 rounded-full ${task.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-textMain">{task.title}</h3>
                    <p className="text-sm text-textMuted mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge bg-surfaceItem border-border text-textMain">
                        Project: {task.project?.title || 'Unknown'}
                      </span>
                      <span className={`badge ${task.priority === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-surfaceItem text-textMuted border-border'}`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <select 
                    value={task.status} 
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="input-field py-1.5 text-sm appearance-none bg-surface min-w-[140px]"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTasks;
