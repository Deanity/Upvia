import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { Roadmap, Module, Task } from '../types';
import { CheckCircle2, Circle, Lock, ArrowRight, Trophy, Target, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getActiveRoadmap(user.id).then((data) => {
          if (!data) {
            navigate('/onboarding');
          } else {
            setRoadmap(data);
          }
          setLoading(false);
        });
      }
    });
  }, [navigate]);

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>;

  if (!roadmap) return null;

  const totalTasks = roadmap.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0);
  const completedTasks = roadmap.modules.reduce((acc: number, m: any) => acc + m.tasks.filter((t: any) => t.is_completed).length, 0);
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const currentModule = roadmap.modules.find((m: any) => !m.is_completed && !m.is_locked) || roadmap.modules[0];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back!</h1>
          <p className="text-gray-600 mt-1">You're making great progress on your learning journey.</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Goal</span>
          <p className="text-lg font-bold text-indigo-600">{roadmap.title}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <Target className="text-indigo-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Progress</p>
            <p className="text-2xl font-bold text-gray-900">{progress}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            <CheckCircle2 className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{completedTasks} / {totalTasks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl">
            <Trophy className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Level</p>
            <p className="text-2xl font-bold text-gray-900 capitalize">{roadmap.level}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            Continue Learning
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">{currentModule.title}</h3>
              <p className="text-sm text-indigo-700 mb-4 line-clamp-2">{currentModule.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  {currentModule.tasks.filter((t: any) => t.is_completed).length} / {currentModule.tasks.length} Tasks
                </span>
                <Link
                  to="/roadmap"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  Go to Roadmap
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">Upcoming Modules</p>
              {roadmap.modules.filter((m: any) => m.is_locked).slice(0, 2).map((m: any) => (
                <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 opacity-60">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">{m.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Goal</h2>
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-700 leading-relaxed italic">"{roadmap.goal}"</p>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                Complete all tasks in a module to unlock the next one.
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                Use the AI Assistant if you get stuck on a challenge.
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                Finish the roadmap to add it to your portfolio.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
