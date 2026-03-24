import React from 'react';
import { 
  Layers, 
  Brain, 
  Layout, 
  Download, 
  PieChart, 
  BookOpen, 
  Zap, 
  GraduationCap, 
  Users, 
  Target, 
  Briefcase 
} from 'lucide-react';

export const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Users', href: '#users' },
  { name: 'Our Values', href: '#values' },
];

export const features = [
  {
    title: "AI-Powered Learning Roadmap",
    description: "Personalized step-by-step learning path with daily/weekly goals and tailored challenges.",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "AI Learning Assistant (24/7)",
    description: "Your personal tutor to answer questions, help debugging, and simplify complex topics in real-time.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Inclusive Learning Interface",
    description: "Accessible UI designed for everyone with simple and user-friendly navigation.",
    icon: <Layout className="w-6 h-6" />,
    color: "bg-teal-100 text-teal-600"
  },
  {
    title: "Progressive Web App (PWA)",
    description: "Installable on any device with offline support and low data usage.",
    icon: <Download className="w-6 h-6" />,
    color: "bg-green-50 text-emerald-500"
  },
  {
    title: "Smart Dashboard & Portfolio",
    description: "Track your progress, save your projects, and build a professional portfolio.",
    icon: <PieChart className="w-6 h-6" />,
    color: "bg-emerald-50 text-teal-600"
  }
];

export const steps = [
  { title: "Set your goal", description: "Tell Upvia what you want to achieve" },
  { title: "AI analyzes your level", description: "We understand your current knowledge" },
  { title: "Generate roadmap", description: "Get your personalized learning path" },
  { title: "Start learning", description: "Dive into bite-sized modules" },
  { title: "Complete challenges", description: "Validate your skills with tasks" },
  { title: "Build your portfolio", description: "Showcase your work to the world" }
];

export const targetUsers = [
  { 
    type: "High School Students", 
    description: "Build a strong foundation for future careers and exams.",
    icon: <BookOpen className="w-8 h-8" />
  },
  { 
    type: "Vocational Students", 
    description: "Practical skills for immediate industry readiness.",
    icon: <Zap className="w-8 h-8" />
  },
  { 
    type: "University Students", 
    description: "Deepen specialization and research.",
    icon: <GraduationCap className="w-8 h-8" />
  },
  { 
    type: "Self Learners", 
    description: "Curated paths for hobbies or career switching.",
    icon: <Users className="w-8 h-8" />
  }
];

export const valuesList = [
  { title: "Personalized Learning", icon: <Target className="w-5 h-5" /> },
  { title: "Flexible Topics", icon: <Layers className="w-5 h-5" /> },
  { title: "AI-Powered System", icon: <Brain className="w-5 h-5" /> },
  { title: "Inclusive Access", icon: <Layout className="w-5 h-5" /> },
  { title: "Career-Ready Output", icon: <Briefcase className="w-5 h-5" /> }
];