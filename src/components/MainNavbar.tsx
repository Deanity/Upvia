import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Bell, Search, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logo from '../assets/UPVIALOGO.svg';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Peta Jalan', to: '/roadmap' },
  { label: 'Asisten AI', to: '/assistant' },
  { label: 'Portofolio', to: '/portfolio' },
];

export function MainNavbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-green-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Upvia Logo" className="w-10 h-10 object-contain" />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-bold transition-all hover:text-[hsl(var(--brand-primary))]",
                  isActive
                    ? "text-[hsl(var(--brand-primary))] border-b-2 border-[hsl(var(--brand-primary))] pb-1"
                    : "text-gray-400"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[hsl(var(--brand-primary))] hover:bg-green-100 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[hsl(var(--brand-primary))] hover:bg-green-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-white border-2 border-green-500 flex items-center justify-center text-green-600 shadow-sm overflow-hidden hover:scale-105 transition-transform"
            >
              <User className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-2xl border border-green-100 shadow-xl py-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Akun Saya</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
