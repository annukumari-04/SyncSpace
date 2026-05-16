import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Settings</h1>
        <p className="text-textMuted text-sm mt-1">Manage your app preferences</p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-textMain mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-textMuted mb-3">Choose your preferred theme for the workspace.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Light Theme Option */}
              <button
                onClick={() => setTheme('light')}
                className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                  theme === 'light' 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                    : 'border-border bg-surfaceItem hover:bg-surfaceItemHover hover:border-textMuted'
                }`}
              >
                <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary text-white' : 'bg-surfaceItemHover text-textMuted'}`}>
                  <Sun size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-textMain">Light Mode</h3>
                  <p className="text-xs text-textMuted mt-1">Clean and bright workspace with an off-white background.</p>
                </div>
              </button>

              {/* Dark Theme Option */}
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                    : 'border-border bg-surfaceItem hover:bg-surfaceItemHover hover:border-textMuted'
                }`}
              >
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary text-white' : 'bg-surfaceItemHover text-textMuted'}`}>
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-textMain">Dark Mode</h3>
                  <p className="text-xs text-textMuted mt-1">Sleek, deep contrast workspace. Easy on the eyes.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
