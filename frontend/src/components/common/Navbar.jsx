import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ setIsMobileOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel w-full p-4 md:p-5 flex items-center justify-between mt-4 md:mt-8 mx-auto max-w-7xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-lg text-textMuted hover:bg-surfaceItemHover hover:text-textMain transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Workspace</span>
          <span className="font-extrabold text-textMain leading-tight">SyncSpace</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-textMain leading-tight">{user?.name}</p>
            <p className="text-xs text-textMuted font-medium leading-tight">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-textMain font-bold text-sm shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="h-8 w-px bg-surfaceItemHover hidden sm:block mx-2"></div>
        
        <button 
          onClick={logout}
          className="text-sm font-semibold text-textMuted hover:text-textMain transition-colors bg-surfaceItem hover:bg-surfaceItemHover px-4 py-2 rounded-lg border border-border"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
