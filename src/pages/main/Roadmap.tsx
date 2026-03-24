import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Sparkles, Trophy, BookOpen, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function RoadmapView() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const navigate = useNavigate();

  const fetchRoadmap = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // Assuming App.tsx handles redirection if no user is found,
    // so we can proceed directly if a user is present.
    if (user) {
      const data = await db.getActiveRoadmap(user.id);
      if (data) {
        setRoadmap(data);
        // Expand the first unlocked, incomplete module
        const active = data.modules.find((m: any) => !m.is_completed && !m.is_locked);
        if (active) setExpandedModule(active.id);
      }
      setLoading(false);
    } else {
      // If for some reason user is null here, and App.tsx didn't redirect,
      // we should still stop loading and perhaps show a message or redirect.
      // For now, just stop loading.
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

      // Check if module completion state should change
      const allTasksCompleted = module.tasks.every((t: any) => t.is_completed);
      if (allTasksCompleted !== module.is_completed) {
        await db.setModuleCompletion(moduleId, allTasksCompleted);
        module.is_completed = allTasksCompleted;
        
        // Unlock next module if it's now complete and next exists
        if (allTasksCompleted && module.order_index < updatedRoadmap.modules.length - 1) {
          await db.unlockNextModule(roadmap.id, module.order_index);
          const nextModule = updatedRoadmap.modules.find((m: any) => m.order_index === module.order_index + 1);
          if (nextModule) nextModule.is_locked = false;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{roadmap.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Follow the path to master your goal.</p>
        </div>
        {isRoadmapComplete && (
          <button
            onClick={handleCompleteRoadmap}
            disabled={completing}
            className="px-6 py-3 bg-[hsl(var(--brand-primary))] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            {completing ? 'Memproses...' : 'Complete the Roadmap'}
          </button>
        )}
      </header>

      <div className="space-y-4">
        {roadmap.modules.sort((a: any, b: any) => a.order_index - b.order_index).map((module: any) => {
          const isModuleReallyCompleted = module.tasks.every((t: any) => t.is_completed);
          
          return (
            <div
              key={module.id}
              className={cn(
                "glass-card bg-white/50 dark:bg-gray-900/50 rounded-2xl border transition-all overflow-hidden",
                module.is_locked ? "border-gray-100 dark:border-white/5 opacity-60" : "border-white/60 dark:border-white/10 shadow-sm",
                expandedModule === module.id && "ring-2 ring-[hsl(var(--brand-primary))] ring-opacity-20 border-transparent"
              )}
            >
              <button
                onClick={() => !module.is_locked && setExpandedModule(expandedModule === module.id ? null : module.id)}
                disabled={module.is_locked}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                    isModuleReallyCompleted ? "bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600" :
                      module.is_locked ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-white/5 text-gray-400" : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-500"
                  )}>
                    {isModuleReallyCompleted ? <CheckCircle2 className="w-6 h-6" /> :
                      module.is_locked ? <Lock className="w-5 h-5" /> : <X className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{module.title}</h3>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{module.tasks.length} {module.tasks.length === 1 ? 'TASK' : 'TASKS'}</p>
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
                  className="border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/30"
                >
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{module.description}</p>
                    <div className="space-y-3">
                      {module.tasks.sort((a: any, b: any) => a.order_index - b.order_index).map((task: any) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors"
                        >
                          <button
                            onClick={() => handleToggleTask(task.id, task.is_completed, module.id)}
                            className={cn(
                              "mt-0.5 transition-colors",
                              task.is_completed ? "text-green-500" : "text-gray-300 dark:text-gray-700 hover:text-[hsl(var(--brand-primary))]"
                            )}
                          >
                            {task.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                          </button>
                          <div className="flex-1">
                            <h4 className={cn(
                              "font-bold text-gray-900 dark:text-white transition-all",
                              task.is_completed && "line-through text-gray-400 dark:text-gray-600 opacity-60"
                            )}>
                              {task.title}
                            </h4>
                            {!task.is_completed && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                {task.description.replace(/[#*`]/g, '').trim()}
                              </p>
                            )}
                            
                            <div className="mt-4 flex items-center gap-3">
                              <Link
                                to={`/learning/${task.id}`}
                                className={cn(
                                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm",
                                  task.is_completed 
                                    ? "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:bg-gray-100" 
                                    : "bg-[hsl(var(--brand-primary))] text-white hover:shadow-lg hover:shadow-green-500/20"
                                )}
                              >
                                {task.is_completed ? <Play className="w-3 h-3 text-gray-300" /> : <BookOpen className="w-3 h-3" />}
                                {task.is_completed ? 'Review' : 'Start Learning'}
                              </Link>
                              
                              {task.challenge && !task.is_completed && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 rounded-full border border-amber-100 dark:border-amber-500/20">
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  <span className="text-[10px] font-bold uppercase tracking-tight">
                                    {task.challenge.startsWith('[') 
                                      ? `${JSON.parse(task.challenge).length} Latihan` 
                                      : 'Practice'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          );
        })}
      </div>
    </div>
  );
}

