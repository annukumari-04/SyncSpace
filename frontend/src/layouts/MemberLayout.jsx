import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const MemberLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      
      <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${collapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'}`}>
        <div className="px-4 lg:px-8">
          <Navbar setIsMobileOpen={setIsMobileOpen} />
        </div>
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
