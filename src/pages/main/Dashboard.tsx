import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { CheckCircle2, Trophy, Target, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse p-4">
      <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
      </div>
      <div className="h-96 bg-gray-200 rounded-3xl"></div>
    </div>
  );

  if (!roadmap) return null;

  const totalTasks = roadmap.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0);
  const completedTasks = roadmap.modules.reduce((acc: number, m: any) => acc + m.tasks.filter((t: any) => t.is_completed).length, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentModule = roadmap.modules.find((m: any) => !m.is_completed && !m.is_locked) || roadmap.modules[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 pb-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-gray-900 tracking-tight"
          >
            Dashboard
          </motion.h1>
          <p className="text-gray-500 mt-2 font-medium">Tracking your path to mastery.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl premium-shadow border border-gray-100 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Current Goal</span>
            <p className="text-sm font-bold text-indigo-600">{roadmap.title}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, label: 'Overall Progress', value: `${progress}%`, color: 'indigo' },
          { icon: CheckCircle2, label: 'Tasks Done', value: `${completedTasks}/${totalTasks}`, color: 'emerald' },
          { icon: Trophy, label: 'Current Level', value: roadmap.level, color: 'amber', capitalize: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 premium-shadow group hover:border-indigo-200 transition-colors"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
              stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className={cn("text-3xl font-black text-gray-900 mt-1", stat.capitalize && "capitalize")}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content: Progress Cards */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 premium-shadow">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <LayoutDashboard className="w-7 h-7 text-indigo-600" />
                Next Up
              </h2>
              <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-widest">
                Active Module
              </span>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-32 h-32" />
              </div>

              <h3 className="text-2xl font-bold mb-3">{currentModule.title}</h3>
              <p className="text-indigo-100 mb-8 leading-relaxed line-clamp-2 text-sm">
                {currentModule.description}
              </p>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:w-48">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-indigo-200">
                    <span>Task Progress</span>
                    <span>{Math.round((currentModule.tasks.filter((t: any) => t.is_completed).length / currentModule.tasks.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentModule.tasks.filter((t: any) => t.is_completed).length / currentModule.tasks.length) * 100}%` }}
                      className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </div>

                <Link
                  to="/roadmap"
                  className="w-full md:w-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/20 active:scale-95"
                >
                  Continue Learning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 premium-shadow">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Learning Path Overview</h3>
            <div className="space-y-4">
              {roadmap.modules.map((m: any, idx: number) => (
                <div key={m.id} className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border transition-all",
                  m.is_completed ? "bg-emerald-50/50 border-emerald-100" :
                    m.is_locked ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-indigo-100 ring-1 ring-indigo-50"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm",
                    m.is_completed ? "bg-emerald-100 text-emerald-600" :
                      m.is_locked ? "bg-gray-200 text-gray-400" : "bg-indigo-600 text-white"
                  )}>
                    {m.is_completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-bold text-sm truncate", m.is_locked ? "text-gray-400" : "text-gray-900")}>
                      {m.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.tasks.length} tasks</p>
                  </div>
                  {!m.is_locked && !m.is_completed && (
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar Analysis/Insights */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 premium-shadow h-full">
            <h2 className="text-xl font-black text-gray-900 mb-6">Your Motivation</h2>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 italic text-amber-900 text-sm leading-relaxed relative">
              <span className="absolute -top-3 -left-2 text-4xl text-amber-200 opacity-50 font-serif">"</span>
              {roadmap.goal}
              <span className="absolute -bottom-6 -right-2 text-4xl text-amber-200 opacity-50 font-serif">"</span>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 space-y-6">
              <h3 className="font-black text-gray-900 tracking-tight">Daily Insight</h3>
              <div className="space-y-4">
                {[
                  { title: 'Consistency is Key', desc: 'Even 15 minutes a day keeps the brain sharp.' },
                  { title: 'AI Support', desc: 'Stuck? Your AI Assistant knows exactly where you are.' },
                  { title: 'Goal Milestone', desc: 'You are just a few tasks away from your next big step!' }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{tip.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Mastery Badge</p>
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center premium-shadow mb-4">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-indigo-900">Level {roadmap.level ? roadmap.level.toUpperCase() : 'BEGINNER'}</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
