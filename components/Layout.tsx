import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  BadgeDollarSign
} from 'lucide-react';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Borrowers', icon: Users, path: '/borrowers' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 text-white transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <BadgeDollarSign className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold tracking-wide text-slate-100">SKS Lending</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-slate-900 border-b border-slate-800 shadow-sm md:hidden flex items-center justify-between p-4 z-10">
          <div className="flex items-center space-x-2">
            <BadgeDollarSign className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-slate-100">SKS Lending</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;