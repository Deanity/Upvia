import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { chatWithAI } from '../../lib/gemini';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Halo! Saya Upvia AI, asisten pembelajaran pribadi Anda. Ada yang bisa saya bantu dengan peta jalan belajar Anda hari ini?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getActiveRoadmap(user.id).then(setRoadmap);
      }
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const totalTasks = roadmap?.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0) || 0;
      const completedTasks = roadmap?.modules.reduce((acc: number, m: any) => acc + m.tasks.filter((t: any) => t.is_completed).length, 0) || 0;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Pass the previous messages as history (excluding the very last one we just added)
      const response = await chatWithAI(userMessage, { roadmap, progress }, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error('Error chatting with AI:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: error.message || "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col glass-card bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl overflow-hidden">
      <header className="p-6 border-b border-green-100 bg-white/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[hsl(var(--brand-primary))] p-2.5 rounded-xl shadow-lg shadow-green-500/20 text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-gray-900 tracking-tight">Asisten Upvia AI</h2>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse border-2 border-white" />
              Online & Siap Membantu
            </p>
          </div>
        </div>
        {roadmap && (
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tujuan Saat Ini</p>
            <p className="text-sm font-bold text-[hsl(var(--brand-primary))]">{roadmap.title}</p>
          </div>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-white border border-gray-100 text-gray-600" : "bg-green-50 border border-green-100 text-[hsl(var(--brand-primary))]"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-5 rounded-3xl text-sm leading-relaxed shadow-sm",
                msg.role === 'user'
                  ? "bg-[hsl(var(--brand-primary))] text-white rounded-tr-none"
                  : "bg-white border border-green-50 text-gray-800 rounded-tl-none"
              )}>
                <div className="markdown-body prose prose-sm max-w-none prose-emerald">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 text-[hsl(var(--brand-primary))] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-green-50 p-5 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--brand-primary))]" />
              <span className="text-sm text-gray-500 font-medium">Upvia AI sedang berpikir...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya saya apa saja tentang peta jalan belajar Anda..."
            className="w-full pl-6 pr-14 py-4 bg-white border border-green-100 rounded-2xl focus:ring-2 focus:ring-[hsl(var(--brand-primary))] focus:border-[hsl(var(--brand-primary))] outline-none transition-all shadow-sm font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[hsl(var(--brand-primary))] text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-bold">
          Powered by Gemini AI
        </p>
      </form>
    </div>
  );
}
