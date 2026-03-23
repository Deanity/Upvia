export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Roadmap {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'completed';
  created_at: string;
}

export interface Module {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  order_index: number;
  is_locked: boolean;
  is_completed: boolean;
}

export interface Task {
  id: string;
  module_id: string;
  title: string;
  description: string;
  challenge?: string;
  is_completed: boolean;
  order_index: number;
}

export interface PortfolioItem {
  id: string;
  user_id: string;
  roadmap_id: string;
  goal: string;
  title: string;
  summary: string;
  completed_at: string;
}
