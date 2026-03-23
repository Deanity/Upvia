import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { Briefcase, Calendar, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

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

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    {[1, 2].map(i => <div key={i} className="h-48 bg-gray-200 rounded"></div>)}
  </div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Portfolio</h1>
        <p className="text-gray-600 mt-2">A record of your completed learning achievements.</p>
      </header>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
          <div className="mx-auto bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No achievements yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-6">
            Complete your first learning roadmap to start building your professional portfolio.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award className="w-32 h-32 text-indigo-600" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Completed Achievement</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.completed_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      Goal: {item.goal}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">
                    {item.summary}
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-2 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 min-w-[160px]">
                  <Award className="w-8 h-8 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Certified Mastery</span>
                  <div className="h-px w-full bg-indigo-200 my-2" />
                  <span className="text-[10px] text-indigo-500 font-medium">EduChain Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
