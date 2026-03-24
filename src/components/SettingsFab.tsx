import React, { useState, useEffect, useRef } from 'react';
import { Settings, Moon, Sun, Type, Minus, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function SettingsFab() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('fontSize') || '16');
  });

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('fontFamily') || 'sans';
  });

  useEffect(() => {
    // Apply Theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply Font Size
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    // Apply Font Family
    const families: Record<string, string> = {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Monaco, monospace'
    };
    document.documentElement.style.fontFamily = families[fontFamily] || families.sans;
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, 12), 24));
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            className="absolute bottom-16 left-0 mb-4 w-72 glass-card bg-white/90 dark:bg-gray-900/90 dark:border-gray-800 rounded-3xl p-6 shadow-2xl border border-green-100"
          >
            <div className="space-y-6">
              <header className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Settings</h3>
                <Settings className="w-4 h-4 text-gray-400" />
              </header>

              {/* Theme Toggle */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Appearance</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                      theme === 'light' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                      theme === 'dark' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-400"
                    )}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Font Size</label>
                <div className="flex items-center justify-between gap-4 p-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
                  <button 
                    onClick={() => adjustFontSize(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-xl hover:scale-105 transition-all text-gray-900 dark:text-gray-100 shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{fontSize}px</span>
                  <button 
                    onClick={() => adjustFontSize(1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-xl hover:scale-105 transition-all text-gray-900 dark:text-gray-100 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Text Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['sans', 'serif', 'mono'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontFamily(f)}
                      className={cn(
                        "py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all",
                        fontFamily === f 
                          ? "bg-[hsl(var(--brand-primary))] text-white border-transparent" 
                          : "bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 relative group overflow-hidden",
          isOpen 
            ? "bg-gray-900 text-white" 
            : "bg-[hsl(var(--brand-primary))] text-white hover:scale-105"
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Settings className="w-7 h-7" />
        </motion.div>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
