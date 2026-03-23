import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateRoadmap } from '../lib/gemini';
import { db } from '../lib/db';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Onboarding() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      // Check if user already has an active roadmap
      if (user) {
        db.getActiveRoadmap(user.id).then((roadmap) => {
          if (roadmap) navigate('/');
        });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !user) return;

    setLoading(true);
    try {
      const roadmapData = await generateRoadmap(goal);
      await db.createRoadmap(user.id, { ...roadmapData, goal });
      navigate('/');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          What do you want to learn today?
        </h1>
        <p className="text-lg text-gray-600">
          Tell us your goal, and our AI will build a personalized roadmap just for you.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., I want to become a full-stack developer with React and Node.js"
            className="w-full h-40 p-6 text-lg border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
            disabled={loading}
          />
          <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
            AI-powered generation
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !goal.trim()}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Generating your roadmap...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate Roadmap
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Personalized', desc: 'Tailored to your current level and goals.' },
          { title: 'Structured', desc: 'Step-by-step modules for clear progress.' },
          { title: 'AI-Powered', desc: 'Get help anytime with our AI assistant.' },
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
