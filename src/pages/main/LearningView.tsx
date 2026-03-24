import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { generateTaskMaterial } from '../../lib/gemini';
import { 
  ArrowLeft, 
  BookOpen, 
  X, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ChevronRight,
  Play,
  CheckCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function LearningView() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'exercise'>('content');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);

  useEffect(() => {
    if (!taskId) return;

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const activeRoadmap = await db.getActiveRoadmap(user.id);
      setRoadmap(activeRoadmap);

      // Find the specific task
      let foundTask = null;
      for (const mod of activeRoadmap.modules) {
        const t = mod.tasks.find((t: any) => t.id === taskId);
        if (t) {
          foundTask = { ...t, moduleTitle: mod.title };
          break;
        }
      }

      if (foundTask) {
        setTask(foundTask);
        
        // If description is short (summary only) or task is fresh, generate detailed material
        if (foundTask.description.length < 500) {
          handleGenerateMaterial(foundTask, activeRoadmap.goal);
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [taskId]);

  const handleGenerateMaterial = async (targetTask: any, goal: string) => {
    setGenerating(true);
    try {
      const material = await generateTaskMaterial(targetTask.title, targetTask.moduleTitle, goal);
      await db.updateTaskMaterial(targetTask.id, material.content, JSON.stringify(material.exercises));
      setTask({ 
        ...targetTask, 
        description: material.content, 
        challenge: JSON.stringify(material.exercises) 
      });
    } catch (error) {
      console.error('Error generating material:', error);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!task.is_completed) {
      await db.toggleTaskCompletion(task.id, true);
    }
    navigate('/roadmap');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[hsl(var(--brand-primary))] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-500 font-medium animate-pulse">Menyiapkan materi belajar Anda...</p>
    </div>
  );

  const exercises = task.challenge ? JSON.parse(task.challenge) : [];
  const currentExercise = exercises[currentExerciseIdx];

  const handleExerciseSubmit = () => {
    if (selectedOption === null) return;
    setShowResult(true);
  };

  const nextExercise = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setActiveTab('content');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/roadmap" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </Link>
          <div className="h-4 w-px bg-gray-200 dark:bg-white/5"></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{task.moduleTitle}</p>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-none">{task.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 mr-4">
            <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[hsl(var(--brand-primary))]" 
                style={{ width: `${(roadmap?.modules.indexOf(roadmap.modules.find((m: any) => m.title === task.moduleTitle)) / roadmap?.modules.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-600">PROGRESS</span>
          </div>
          <button 
            onClick={handleCompleteTask}
            className="btn-primary py-2 px-6 rounded-full text-xs font-bold"
          >
            Selesaikan & Lanjut
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Sidebar Nav */}
        <aside className="w-80 border-r border-gray-100 dark:border-white/5 overflow-y-auto hidden lg:block bg-gray-50/30 dark:bg-gray-950/30">
          <div className="p-6">
            <h2 className="text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-6 px-2">Daftar Materi</h2>
            <div className="space-y-2">
              {roadmap.modules.map((mod: any) => (
                <div key={mod.id} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-2 text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter opacity-50">
                    {mod.title}
                  </div>
                  {mod.tasks.map((t: any) => (
                    <Link
                      key={t.id}
                      to={`/learning/${t.id}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all text-sm group",
                        t.id === taskId 
                          ? "bg-white dark:bg-gray-900 text-[hsl(var(--brand-primary))] border border-green-100 dark:border-green-500/20 shadow-sm font-bold" 
                          : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center border",
                        t.is_completed 
                          ? "bg-green-500 border-green-500 text-white" 
                          : t.id === taskId ? "border-[hsl(var(--brand-primary))]" : "border-gray-200 dark:border-white/10"
                      )}>
                        {t.is_completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Play className="w-2.5 h-2.5" />}
                      </div>
                      <span className="truncate">{t.title}</span>
                      {t.id === taskId && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand-primary))] ml-auto" />}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-white/5 px-8 bg-white dark:bg-gray-950 shrink-0">
            <button
              onClick={() => setActiveTab('content')}
              className={cn(
                "px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all",
                activeTab === 'content' ? "border-[hsl(var(--brand-primary))] text-gray-900 dark:text-white" : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              )}
            >
              Materi Pembelajaran
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={cn(
                "px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2",
                activeTab === 'exercise' ? "border-[hsl(var(--brand-primary))] text-gray-900 dark:text-white" : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              )}
            >
              Latihan Soal
              <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-500/10 text-[hsl(var(--brand-primary))] rounded text-[9px]">{exercises.length}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-20 bg-white dark:bg-gray-950 selection:bg-green-100">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'content' ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {generating && (
                      <div className="p-8 bg-green-50 dark:bg-green-500/10 rounded-[2rem] border border-green-100 dark:border-green-500/20 flex items-center gap-6 animate-pulse">
                        <Sparkles className="w-8 h-8 text-[hsl(var(--brand-primary))] animate-spin" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-bold text-green-900 dark:text-green-400">Upvia AI sedang menyusun materi terbaik untuk Anda...</p>
                          <div className="h-2 bg-green-200 dark:bg-green-800 rounded-full w-full"></div>
                        </div>
                      </div>
                    )}

                    {!generating && (
                      <div className="markdown-body prose dark:prose-invert prose-emerald prose-headings:font-black prose-headings:tracking-tight prose-a:text-[hsl(var(--brand-primary))] max-w-none transition-colors duration-300">
                        <ReactMarkdown>{task.description}</ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="exercise"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl mx-auto py-10"
                  >
                    {!currentExercise ? (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Sparkles className="w-8 h-8 text-[hsl(var(--brand-primary))]" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Bagus Sekali!</h2>
                        <p className="text-gray-500 dark:text-gray-400">Anda telah meninjau semua materi. Silakan coba latihan soal untuk menguji pemahaman Anda.</p>
                        <button 
                          onClick={() => setActiveTab('content')}
                          className="btn-primary px-8 py-3 rounded-xl font-bold mt-4"
                        >
                          Kembali ke Materi
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Pertanyaan {currentExerciseIdx + 1} dari {exercises.length}</span>
                          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                            {currentExercise.question}
                          </h2>
                        </div>

                        <div className="grid gap-3">
                          {currentExercise.options.map((option: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => !showResult && setSelectedOption(idx)}
                              disabled={showResult}
                              className={cn(
                                "text-left p-5 rounded-2xl border-2 transition-all font-bold text-sm flex items-center justify-between group",
                                selectedOption === idx 
                                  ? "border-[hsl(var(--brand-primary))] bg-green-50 dark:bg-green-500/10 text-[hsl(var(--brand-primary))]" 
                                  : "border-gray-100 dark:border-white/5 hover:border-green-200 dark:hover:border-green-500/20 hover:bg-gray-50/50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
                                showResult && idx === currentExercise.correctAnswer && "border-green-500 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400",
                                showResult && selectedOption === idx && idx !== currentExercise.correctAnswer && "border-red-500 bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                              )}
                            >
                              {option}
                              {showResult && idx === currentExercise.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              {showResult && selectedOption === idx && idx !== currentExercise.correctAnswer && <X className="w-5 h-5 text-red-500" />}
                            </button>
                          ))}
                        </div>

                        {showResult && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={cn(
                              "p-6 rounded-[2rem] border transition-colors",
                              selectedOption === currentExercise.correctAnswer 
                                ? "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-900 dark:text-green-300" 
                                : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-900 dark:text-red-300"
                            )}
                          >
                            <p className="text-xs font-black uppercase tracking-widest mb-2">Penjelasan</p>
                            <p className="text-sm font-medium leading-relaxed">{currentExercise.explanation || "Jawaban yang benar adalah pilihan yang paling tepat berdasarkan materi di atas."}</p>
                            <button 
                              onClick={nextExercise}
                              className="mt-6 px-8 py-3 bg-white dark:bg-gray-800 border border-black/10 dark:border-white/5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-900 dark:text-gray-100"
                            >
                              {currentExerciseIdx < exercises.length - 1 ? 'Pertanyaan Selanjutnya' : 'Selesai Latihan'}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}

                        {!showResult && (
                          <button
                            onClick={handleExerciseSubmit}
                            disabled={selectedOption === null}
                            className="w-full py-5 btn-primary rounded-2xl font-black text-base disabled:opacity-50 shadow-xl shadow-green-500/10"
                          >
                            Cek Jawaban
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
