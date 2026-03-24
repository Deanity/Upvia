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
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-white/5 h-screen flex flex-col sticky top-0 transition-colors">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-[hsl(var(--brand-primary))] p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Upvia</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]",
                isActive
                  ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-white/5 flex flex-col gap-4">
        {isOffline && (
          <div className="bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-xl flex items-center gap-2 border border-amber-100 dark:border-amber-500/20 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest">Offline Mode</span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
