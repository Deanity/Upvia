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
    if (user) {
      const data = await db.getActiveRoadmap(user.id);
      if (data) {
        setRoadmap(data);
        const sortedModules = [...data.modules].sort((a: any, b: any) => a.order_index - b.order_index);
        const active = sortedModules.find((m: any) => !m.is_completed && !m.is_locked);
        if (active) setExpandedModule(active.id);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [navigate]);

  const handleToggleTask = async (taskId: string, currentStatus: boolean, moduleId: string) => {
    try {
      await db.toggleTaskCompletion(taskId, !currentStatus);

      const updatedRoadmap = { ...roadmap };
      const module = updatedRoadmap.modules.find((m: any) => m.id === moduleId);
      const task = module.tasks.find((t: any) => t.id === taskId);
      task.is_completed = !currentStatus;

      const allTasksCompleted = module.tasks.every((t: any) => t.is_completed);
      if (allTasksCompleted !== module.is_completed) {
        await db.setModuleCompletion(moduleId, allTasksCompleted);
        module.is_completed = allTasksCompleted;

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

      <div className="relative py-4 md:py-8 mt-4 md:mt-8">
        {/* Main Vertical Line */}
        <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-[3px] bg-gray-200 dark:bg-gray-800 transform md:-translate-x-1/2 rounded-full"></div>

        <div className="space-y-6 md:space-y-0 text-left">
          {roadmap.modules.sort((a: any, b: any) => a.order_index - b.order_index).map((module: any, index: number) => {
            const isModuleReallyCompleted = module.tasks.every((t: any) => t.is_completed);
            const isLeft = index % 2 === 0;

            return (
              <div key={module.id} className="relative w-full md:min-h-[160px] pb-6 md:pb-12 group">

                {/* Node / Dot */}
                <div className={cn(
                  "absolute left-6 md:left-[50%] top-[38px] transform -translate-x-1/2 z-10 w-5 h-5 rounded-full border-[3px] bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300",
                  isModuleReallyCompleted ? "border-green-500" : module.is_locked ? "border-gray-300 dark:border-gray-700" : "border-[hsl(var(--brand-primary))]"
                )}>
                  {!module.is_locked && !isModuleReallyCompleted && (
                    <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[hsl(var(--brand-primary))] animate-pulse" />
                  )}
                </div>

                {/* Card Container */}
                <div className={cn(
                  "w-full pl-14 md:pl-0 md:w-[calc(50%-3rem)] relative",
                  isLeft ? "md:mr-auto" : "md:ml-auto"
                )}>
                  {/* Horizontal Connector Line */}
                  <div className={cn(
                    "absolute top-12 -mt-[1px] border-t-2 border-dashed border-gray-200 dark:border-gray-800 -z-10 transition-colors",
                    "left-8 w-6 md:hidden",
                    isLeft ? "md:block md:w-12 md:-right-12 md:left-auto" : "md:block md:w-12 md:-left-12 md:right-auto"
                  )} />

                  {/* Card Element */}
                  <div
                    className={cn(
                      "glass-card bg-white/50 dark:bg-gray-900/50 rounded-2xl border transition-all overflow-hidden relative group-hover:shadow-md",
                      module.is_locked ? "border-gray-100 dark:border-white/5 opacity-60" : "border-white/60 dark:border-white/10 shadow-sm hover:border-[hsl(var(--brand-primary))]/30",
                      expandedModule === module.id && "ring-2 ring-[hsl(var(--brand-primary))] ring-opacity-20 border-transparent shadow-lg"
                    )}
                  >
                    <button
                      onClick={() => !module.is_locked && setExpandedModule(expandedModule === module.id ? null : module.id)}
                      disabled={module.is_locked}
                      className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left gap-4"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border transition-all shrink-0",
                          isModuleReallyCompleted ? "bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600" :
                            module.is_locked ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-white/5 text-gray-400" : "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-[hsl(var(--brand-primary))]"
                        )}>
                          {isModuleReallyCompleted ? <CheckCircle2 className="w-6 h-6" /> :
                            module.is_locked ? <Lock className="w-5 h-5" /> : <div className="font-bold text-lg">{index + 1}</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight break-words">{module.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                              <BookOpen className="w-3 h-3" />
                              {module.tasks.length} {module.tasks.length === 1 ? 'TASK' : 'TASKS'}
                            </div>
                            {isModuleReallyCompleted && (
                              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">Completed</span>
                            )}
                          </div>
                        </div>
                        {!module.is_locked && (
                          <div className={cn(
                            "shrink-0 p-2 rounded-full transition-colors hidden sm:block",
                            expandedModule === module.id
                              ? "bg-[hsl(var(--brand-primary))] text-white"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                          )}>
                            {expandedModule === module.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        )}
                      </div>

                      {/* Mobile Expand chevron */}
                      {!module.is_locked && (
                        <div className="sm:hidden w-full flex justify-center mt-2 border-t border-gray-100 dark:border-white/5 pt-2">
                          {expandedModule === module.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedModule === module.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/30"
                        >
                          <div className="p-6 space-y-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{module.description}</p>
                            <div className="space-y-3">
                              {module.tasks.sort((a: any, b: any) => a.order_index - b.order_index).map((task: any) => (
                                <div
                                  key={task.id}
                                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors hover:border-gray-200 dark:hover:border-white/10"
                                >
                                  <button
                                    onClick={() => handleToggleTask(task.id, task.is_completed, module.id)}
                                    className={cn(
                                      "mt-0.5 transition-colors",
                                      task.is_completed ? "text-green-500" : "text-gray-300 dark:text-gray-700 hover:text-[hsl(var(--brand-primary))]"
                                    )}
                                  >
                                    {task.is_completed ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <Circle className="w-6 h-6 shrink-0" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <h4 className={cn(
                                      "font-bold text-gray-900 dark:text-white transition-all break-words leading-tight",
                                      task.is_completed && "line-through text-gray-400 dark:text-gray-600 opacity-60"
                                    )}>
                                      {task.title}
                                    </h4>
                                    {!task.is_completed && (
                                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1.5 leading-relaxed line-clamp-2 break-words">
                                        {task.description.replace(/[#*`]/g, '').trim()}
                                      </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                      <Link
                                        to={`/learning/${task.id}`}
                                        className={cn(
                                          "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm",
                                          task.is_completed
                                            ? "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:bg-gray-100"
                                            : "bg-[hsl(var(--brand-primary))] text-white hover:shadow-lg hover:shadow-[hsl(var(--brand-primary))]/20"
                                        )}
                                      >
                                        {task.is_completed ? <Play className="w-3 h-3 text-gray-300" /> : <BookOpen className="w-3 h-3" />}
                                        {task.is_completed ? 'Review' : 'Mulai Belajar'}
                                      </Link>

                                      {task.challenge && !task.is_completed && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 rounded-full border border-amber-100 dark:border-amber-500/20">
                                          <Sparkles className="w-3 h-3 text-amber-500" />
                                          <span className="text-[10px] font-bold uppercase tracking-tight">
                                            {task.challenge.startsWith('[')
                                              ? `${JSON.parse(task.challenge).length} Latihan`
                                              : 'Praktek'}
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

