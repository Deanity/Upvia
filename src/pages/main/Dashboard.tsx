import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { CheckCircle2, Trophy, Target, LayoutDashboard, ArrowRight, Sparkles, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Dashboard() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getActiveRoadmap(user.id).then((data) => {
          setRoadmap(data);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
      </div>
      <div className="h-96 bg-gray-200 rounded-3xl"></div>
    </div>
  );

  if (!roadmap) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 shadow-sm">
        <Target className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-black text-gray-900">No active roadmap found</h2>
      <p className="text-gray-500 max-w-sm">Start your learning journey by creating a new roadmap now.</p>
      <Link to="/onboarding" className="btn-primary px-8 py-4 rounded-2xl font-bold">Get Started</Link>
    </div>
  );

  const totalTasks = roadmap.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0);
  const completedTasks = roadmap.modules.reduce((acc: number, m: any) => acc + m.tasks.filter((t: any) => t.is_completed).length, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentModule = roadmap.modules.find((m: any) => !m.is_completed && !m.is_locked) || roadmap.modules[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
        <Link to="/" className="hover:text-[hsl(var(--brand-primary))] transition-colors">Roadmaps</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 dark:text-gray-100">Dashboard</span>
      </nav>

      {/* 3 Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, label: 'Total Progress', value: `${progress}%`, color: 'emerald' },
          { icon: CheckCircle2, label: 'Completed Tasks', value: `${completedTasks}/${totalTasks}`, color: 'emerald' },
          { icon: Trophy, label: 'Current Level', value: roadmap.level || 'Beginner', color: 'emerald', capitalize: true },
        ].map((stat, i) => (stat &&
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card bg-white/50 dark:bg-gray-900/50 p-6 rounded-3xl flex items-center gap-5 premium-shadow border-white/40 dark:border-white/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm shrink-0 border border-green-50 dark:border-white/5">
              <stat.icon className="w-8 h-8 text-[hsl(var(--brand-primary))]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className={cn("text-2xl font-black text-gray-900 dark:text-white", stat.capitalize && "capitalize")}>
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Filtered By :</span>
        <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-xl text-[hsl(var(--brand-primary))] text-xs font-bold shadow-sm border border-green-50 dark:border-white/5 flex items-center gap-2">
          Active
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand-primary))] animate-pulse"></div>
        </div>
      </div>

      {/* Main Large Content Area */}
      <div className="glass-card bg-white/80 dark:bg-gray-900/80 p-8 rounded-[2.5rem] min-h-[400px] border-white/60 dark:border-white/5 premium-shadow transition-colors duration-300">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-[hsl(var(--brand-primary))]" />
            Next Step
          </h2>
          <Link to="/roadmap" className="text-xs font-bold text-[hsl(var(--brand-primary))] hover:underline flex items-center gap-1 group">
            View All Roadmaps
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content Inside */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-10 bg-white dark:bg-gray-900 rounded-[2rem] border border-green-50 dark:border-white/5 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="flex-1 space-y-6">
                <div>
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-[hsl(var(--brand-primary))] rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block border border-green-100 dark:border-green-500/20">
                    Active Module
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{currentModule.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium leading-relaxed">
                    {currentModule.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                    <span>Module Progress</span>
                    <span className="text-[hsl(var(--brand-primary))]">{Math.round((currentModule.tasks.filter((t: any) => t.is_completed).length / currentModule.tasks.length) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-green-50 dark:bg-gray-800 rounded-full overflow-hidden border border-green-100 dark:border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentModule.tasks.filter((t: any) => t.is_completed).length / currentModule.tasks.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    to="/roadmap"
                    className="px-10 py-4 bg-[hsl(var(--brand-primary))] text-white rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0 transition-all flex items-center gap-3"
                  >
                    Continue Learning
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/assistant"
                    className="px-10 py-4 bg-white dark:bg-gray-800 text-[hsl(var(--brand-primary))] border-2 border-green-500/20 rounded-2xl font-black text-sm hover:bg-green-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                  >
                    Ask AI Assistant
                    <Sparkles className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Visual Decoration */}
              <div className="w-full lg:w-72 aspect-square bg-green-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center p-8 relative overflow-hidden shrink-0 border border-green-100 dark:border-white/5 shadow-inner transition-colors duration-300">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[hsl(var(--brand-primary))] opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 opacity-10 rounded-full blur-2xl"></div>
                <div className="relative z-10 p-6 bg-white dark:bg-gray-700 rounded-3xl premium-shadow border border-green-50 dark:border-white/5">
                  <Trophy className="w-16 h-16 text-amber-500 animate-float" />
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-[10px] font-black text-green-300 dark:text-green-800 uppercase tracking-widest">Mastery Ahead</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
