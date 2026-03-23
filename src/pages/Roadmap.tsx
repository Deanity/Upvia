import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function RoadmapView() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const navigate = useNavigate();

  const fetchRoadmap = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const data = await db.getActiveRoadmap(user.id);
      if (!data) {
        navigate('/onboarding');
      } else {
        setRoadmap(data);
        // Expand the first unlocked, incomplete module
        const active = data.modules.find((m: any) => !m.is_completed && !m.is_locked);
        if (active) setExpandedModule(active.id);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [navigate]);

  const handleToggleTask = async (taskId: string, currentStatus: boolean, moduleId: string) => {
    try {
      await db.toggleTaskCompletion(taskId, !currentStatus);
      
      // Update local state for immediate feedback
      const updatedRoadmap = { ...roadmap };
      const module = updatedRoadmap.modules.find((m: any) => m.id === moduleId);
      const task = module.tasks.find((t: any) => t.id === taskId);
      task.is_completed = !currentStatus;

      // Check if module is now complete
      const allTasksCompleted = module.tasks.every((t: any) => t.is_completed);
      if (allTasksCompleted && !module.is_completed) {
        await db.completeModule(moduleId);
        module.is_completed = true;
        
        // Unlock next module if it exists
        if (module.order_index < updatedRoadmap.modules.length - 1) {
          await db.unlockNextModule(roadmap.id, module.order_index);
          const nextModule = updatedRoadmap.modules.find((m: any) => m.order_index === module.order_index + 1);
          nextModule.is_locked = false;
        }
      }

      setRoadmap(updatedRoadmap);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleCompleteRoadmap = async () => {
    setCompleting(true);
    try {
      const summary = `Successfully completed the learning roadmap for "${roadmap.goal}". Finished ${roadmap.modules.length} modules and mastered key concepts in ${roadmap.title}.`;
      await db.completeRoadmap(roadmap.id, roadmap.user_id, roadmap.goal, roadmap.title, summary);
      navigate('/portfolio');
    } catch (error) {
      console.error('Error completing roadmap:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
  </div>;

  if (!roadmap) return null;

  const isRoadmapComplete = roadmap.modules.every((m: any) => m.is_completed);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{roadmap.title}</h1>
          <p className="text-gray-600 mt-2">Follow the path to master your goal.</p>
        </div>
        {isRoadmapComplete && (
          <button
            onClick={handleCompleteRoadmap}
            disabled={completing}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Trophy className="w-5 h-5" />
            {completing ? 'Finalizing...' : 'Complete Roadmap'}
          </button>
        )}
      </header>

      <div className="space-y-4">
        {roadmap.modules.sort((a: any, b: any) => a.order_index - b.order_index).map((module: any) => (
          <div
            key={module.id}
            className={cn(
              "bg-white rounded-2xl border transition-all overflow-hidden",
              module.is_locked ? "border-gray-100 opacity-60" : "border-gray-200 shadow-sm",
              expandedModule === module.id && "ring-2 ring-indigo-500 ring-offset-0 border-transparent"
            )}
          >
            <button
              onClick={() => !module.is_locked && setExpandedModule(expandedModule === module.id ? null : module.id)}
              disabled={module.is_locked}
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  module.is_completed ? "bg-green-100 text-green-600" : 
                  module.is_locked ? "bg-gray-100 text-gray-400" : "bg-indigo-100 text-indigo-600"
                )}>
                  {module.is_completed ? <CheckCircle2 className="w-6 h-6" /> : 
                   module.is_locked ? <Lock className="w-5 h-5" /> : <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.tasks.length} Tasks</p>
                </div>
              </div>
              {!module.is_locked && (
                expandedModule === module.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedModule === module.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-100 bg-gray-50/50"
                >
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 text-sm mb-6">{module.description}</p>
                    <div className="space-y-3">
                      {module.tasks.sort((a: any, b: any) => a.order_index - b.order_index).map((task: any) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                        >
                          <button
                            onClick={() => handleToggleTask(task.id, task.is_completed, module.id)}
                            className={cn(
                              "mt-0.5 transition-colors",
                              task.is_completed ? "text-green-500" : "text-gray-300 hover:text-indigo-400"
                            )}
                          >
                            {task.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                          </button>
                          <div className="flex-1">
                            <h4 className={cn(
                              "font-bold text-gray-900",
                              task.is_completed && "line-through text-gray-400"
                            )}>
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            {task.challenge && !task.is_completed && (
                              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">Challenge</p>
                                <p className="text-sm text-amber-900">{task.challenge}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
