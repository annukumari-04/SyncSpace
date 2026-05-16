import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Menu,
  ChevronLeft,
  X,
  Settings,
  User as UserIcon,
  Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { name: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Projects', icon: FolderKanban, path: '/admin/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/admin/tasks' },
    { name: 'Team', icon: Users, path: '/admin/team' },
  ];

  const memberLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/member/dashboard' },
    { name: 'My Tasks', icon: CheckSquare, path: '/member/tasks' },
  ];

  const bottomLinks = [
    { name: 'Profile', icon: UserIcon, path: `/${user?.role?.toLowerCase() || 'admin'}/profile` },
    { name: 'Settings', icon: Settings, path: `/${user?.role?.toLowerCase() || 'admin'}/settings` },
  ];

  const links = user?.role === 'Admin' ? adminLinks : memberLinks;

  const NavItem = ({ link }) => {
    const isActive = location.pathname.startsWith(link.path) && link.path !== '#';
    return (
      <NavLink
        to={link.path !== '#' ? link.path : location.pathname}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 mb-2 group relative border border-transparent",
          isActive 
            ? "bg-primary/10 border-primary/20 text-primary shadow-sm" 
            : "text-textMuted hover:text-textMain hover:bg-surfaceItem"
        )}
      >
        <link.icon size={18} className={cn("shrink-0", isActive ? "text-primary" : "text-textMuted group-hover:text-textMain")} />
        
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap font-medium text-sm overflow-hidden"
            >
              {link.name}
            </motion.span>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="absolute left-14 px-2 py-1 bg-surface border border-border text-textMain text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
            {link.name}
          </div>
        )}
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface/50 backdrop-blur-xl border-r border-border">
      <div className="h-20 flex items-center px-6 justify-between mt-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Layers size={20} className="text-textMain" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase leading-none mb-0.5">Workspace</span>
                <span className="font-extrabold text-textMain tracking-tight leading-none text-lg whitespace-nowrap">
                  SyncSpace
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Desktop Collapse Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-md hover:bg-surfaceItemHover text-textMuted hover:text-textMain transition-colors"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 rounded-md hover:bg-surfaceItemHover text-textMuted hover:text-textMain transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 py-6 px-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col justify-between">
        <div className="space-y-1">
          {links.map((link) => (
            <NavItem key={link.name} link={link} />
          ))}
        </div>
        
        <div className="space-y-1 mb-4">
           {bottomLinks.map((link) => (
            <NavItem key={link.name} link={link} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        className="hidden md:block h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[260px] z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
