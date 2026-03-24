import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { generateRoadmap } from '../../lib/gemini';
import { db } from '../../lib/db';
import { Sparkles, ArrowRight, Loader2, Target, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Onboarding() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !user) return;

    setLoading(true);
    try {
      const roadmapData = await generateRoadmap(goal);
      await db.createRoadmap(user.id, { ...roadmapData, goal });
      navigate('/');
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      alert(error.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4" />
          Powered by Gemini 2.0
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          What do you want to <span className="text-indigo-600">master</span> today?
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Tell us your ambition, and our AI will architect a personalized, structured roadmap to take you from zero to expert.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., I want to become a world-class Full Stack Developer specializing in React and Scalable Systems..."
            className="relative w-full h-56 p-10 text-xl border-0 rounded-[2rem] shadow-2xl focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition-all placeholder:text-gray-300 font-medium"
            disabled={loading}
          />
          <div className="absolute bottom-6 right-8 text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Ready
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !goal.trim()}
          className="w-full py-6 px-10 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-indigo-300 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              Architecting your future...
            </>
          ) : (
            <>
              <Sparkles className="w-8 h-8" />
              Generate My Path
              <ArrowRight className="w-6 h-6 ml-2" />
            </>
          )}
        </button>
      </motion.form>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: 'Precision', desc: 'Algorithmically tailored to your current knowledge level.' },
          { icon: Zap, title: 'Speed', desc: 'Focus only on what matters. No fluff, just pure skill building.' },
          { icon: Shield, title: 'Mastery', desc: 'Step-by-step challenges ensure you truly own every concept.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="p-8 bg-white rounded-[2rem] border border-gray-50 premium-shadow group hover:border-indigo-100 transition-all"
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="text-indigo-600 w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
