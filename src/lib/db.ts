import { supabase } from './supabase';
import { Roadmap, Module, Task, PortfolioItem } from '../types';

export const db = {
  async getActiveRoadmap(userId: string) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*, modules(*, tasks(*))')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createRoadmap(userId: string, roadmapData: any) {
    const { data: roadmap, error: rError } = await supabase
      .from('roadmaps')
      .insert({
        user_id: userId,
        title: roadmapData.title,
        goal: roadmapData.goal,
        level: roadmapData.level,
        status: 'active'
      })
      .select()
      .single();

    if (rError) throw rError;

    for (let i = 0; i < roadmapData.modules.length; i++) {
      const mod = roadmapData.modules[i];
      const { data: module, error: mError } = await supabase
        .from('modules')
        .insert({
          roadmap_id: roadmap.id,
          title: mod.title,
          description: mod.description,
          order_index: i,
          is_locked: i > 0
        })
        .select()
        .single();

      if (mError) throw mError;

      for (let j = 0; j < mod.tasks.length; j++) {
        const task = mod.tasks[j];
        const { error: tError } = await supabase
          .from('tasks')
          .insert({
            module_id: module.id,
            title: task.title,
            description: task.description,
            challenge: task.challenge,
            order_index: j
          });
        if (tError) throw tError;
      }
    }

    return roadmap;
  },

  async toggleTaskCompletion(taskId: string, isCompleted: boolean) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: isCompleted })
      .eq('id', taskId);
    if (error) throw error;
  },

  async updateTaskMaterial(taskId: string, content: string, challenge: string) {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        description: content,
        challenge: challenge 
      })
      .eq('id', taskId);
    if (error) throw error;
  },

  async setModuleCompletion(moduleId: string, isCompleted: boolean) {
    const { error } = await supabase
      .from('modules')
      .update({ is_completed: isCompleted })
      .eq('id', moduleId);
    if (error) throw error;
  },

  async unlockNextModule(roadmapId: string, currentOrderIndex: number) {
    const { error } = await supabase
      .from('modules')
      .update({ is_locked: false })
      .eq('roadmap_id', roadmapId)
      .eq('order_index', currentOrderIndex + 1);
    if (error) throw error;
  },

  async completeRoadmap(roadmapId: string, userId: string, goal: string, title: string, summary: string) {
    const { error: rError } = await supabase
      .from('roadmaps')
      .update({ status: 'completed' })
      .eq('id', roadmapId);
    if (rError) throw rError;

    const { error: pError } = await supabase
      .from('portfolio')
      .insert({
        user_id: userId,
        roadmap_id: roadmapId,
        goal,
        title,
        summary
      });
    if (pError) throw pError;
  },

  async getPortfolio(userId: string) {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
