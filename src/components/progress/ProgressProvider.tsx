import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface CourseProgress {
  course_id: number;
  completed_modules: number[];
  started_at: string;
  last_accessed: string;
  completion_percentage: number;
}

interface ProgressContextType {
  courseProgress: Record<number, CourseProgress>;
  loading: boolean;
  updateModuleProgress: (courseId: number, moduleIndex: number) => Promise<void>;
  getCourseProgress: (courseId: number) => CourseProgress | null;
  getCompletionBadge: (courseId: number) => string | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [courseProgress, setCourseProgress] = useState<Record<number, CourseProgress>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setCourseProgress({});
      setLoading(false);
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      // Get fresh session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No valid session for loading progress');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;

      const progressMap: Record<number, CourseProgress> = {};
      data?.forEach((progress) => {
        progressMap[progress.course_id] = progress;
      });

      setCourseProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateModuleProgress = async (courseId: number, moduleIndex: number) => {
    if (!user) {
      console.log('[Progress] No user found');
      throw new Error('User not authenticated');
    }

    console.log('[Progress] Starting module completion:', { courseId, moduleIndex, userId: user.id });

    try {
      // Get existing progress to check if module already completed
      const { data: existingData } = await supabase
        .from('course_progress')
        .select('completed_modules, started_at')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      const completedModules = existingData?.completed_modules || [];
      
      // Don't add if already completed
      if (completedModules.includes(moduleIndex)) {
        console.log('[Progress] Module already completed');
        return;
      }

      const updatedModules = [...completedModules, moduleIndex].sort((a, b) => a - b);
      const totalModules = getCourseModuleCount(courseId);
      const completionPercentage = (updatedModules.length / totalModules) * 100;

      console.log('[Progress] Will upsert with:', { updatedModules, completionPercentage });

      // Use UPSERT to handle both insert and update in one operation
      const { error, data } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          completed_modules: updatedModules,
          last_accessed: new Date().toISOString(),
          completion_percentage: completionPercentage,
          started_at: existingData?.started_at || new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_id'
        })
        .select()
        .single();

      if (error) {
        console.error('[Progress] Error upserting progress:', error);
        throw error;
      }
      
      console.log('[Progress] Upsert successful:', data);

      // Update local state
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: data
      }));

      console.log('[Progress] Local state updated successfully');

    } catch (error) {
      console.error('[Progress] Error updating module progress:', error);
      throw error;
    }
  };

  const getCourseProgress = (courseId: number): CourseProgress | null => {
    return courseProgress[courseId] || null;
  };

  const getCompletionBadge = (courseId: number): string | null => {
    const progress = getCourseProgress(courseId);
    if (!progress) return null;

    if (progress.completion_percentage === 100) return '🏆 Completed';
    if (progress.completion_percentage >= 75) return '⭐ Almost There';
    if (progress.completion_percentage >= 50) return '💪 Making Progress';
    if (progress.completion_percentage >= 25) return '🚀 Getting Started';
    return '👋 Just Started';
  };

  const getCourseModuleCount = (courseId: number): number => {
    // This would ideally come from your course data
    // For now, using a default of 5 modules per course
    return 5;
  };

  const value = {
    courseProgress,
    loading,
    updateModuleProgress,
    getCourseProgress,
    getCompletionBadge,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};