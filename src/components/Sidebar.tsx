import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, MessageSquare, Briefcase, LogOut, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Map, label: 'Roadmap', to: '/roadmap' },
  { icon: MessageSquare, label: 'AI Assistant', to: '/assistant' },
  { icon: Briefcase, label: 'Portfolio', to: '/portfolio' },
];

export function Sidebar() {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">EduChain</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 flex flex-col gap-4">
        {isOffline && (
          <div className="bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-2 border border-amber-100 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Offline Mode</span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
