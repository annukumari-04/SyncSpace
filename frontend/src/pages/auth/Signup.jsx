import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    
    setIsLoading(true);
    try {
      const data = await signup(formData.name, formData.email, formData.password, formData.role);
      if (data.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-textMain mb-2">Create Account</h1>
              <p className="text-textMuted text-sm">Join SyncSpace to manage your projects</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-textMain">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-textMain">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-textMain">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-textMain">Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field pl-10 appearance-none bg-surface"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-textMuted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-textMain transition-colors font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
