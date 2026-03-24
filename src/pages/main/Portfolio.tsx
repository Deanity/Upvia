import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { Briefcase, Calendar, CheckCircle2, Award, Sparkles, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Portfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getPortfolio(user.id).then((data) => {
          setItems(data);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse p-4">
      <div className="h-10 bg-gray-200 rounded-xl w-1/4"></div>
      {[1, 2].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl"></div>)}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 pb-12"
    >
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center md:text-left">Your Portfolio</h1>
        <p className="text-gray-500 mt-2 font-medium text-center md:text-left">A showcase of your learning achievements and mastered skills.</p>
      </header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[2.5rem] border border-dashed border-gray-200 text-center premium-shadow"
        >
          <div className="mx-auto bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 animate-bounce-subtle">
            <Briefcase className="text-indigo-400 w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your story starts here</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
            Complete your first learning roadmap to unlock your achievements and build your professional portfolio.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            Start Learning Now
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden group border-b-4 border-b-indigo-500/20"
            >
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 transform duration-700">
                <Award className="w-64 h-64 text-indigo-600" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                <div className="space-y-6 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Completed Achievement</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{item.title}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {new Date(item.completed_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      {item.goal}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600 leading-relaxed text-sm">
                    "{item.summary}"
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 min-w-[200px] premium-shadow group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Award className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">Certified Mastery</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">EduChain Protocol</p>
                  </div>
                  <div className="h-px w-full bg-indigo-100" />
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase tracking-tighter">
                    <CheckCircle2 className="w-3 h-3" />
                    ID-{item.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
