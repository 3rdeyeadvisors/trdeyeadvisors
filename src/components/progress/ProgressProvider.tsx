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
    if (!user) return;

    try {
      // Get fresh session to ensure auth.uid() matches
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No valid session found');
        return;
      }

      // Query with fresh session user ID
      const { data: existingData, error: fetchError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching progress:', fetchError);
        throw fetchError;
      }

      const completedModules = existingData?.completed_modules || [];
      
      // Don't add if already completed
      if (completedModules.includes(moduleIndex)) {
        return;
      }

      const updatedModules = [...completedModules, moduleIndex].sort((a, b) => a - b);
      const totalModules = getCourseModuleCount(courseId);
      const completionPercentage = (updatedModules.length / totalModules) * 100;

      if (existingData) {
        // Update existing record - use session user ID
        const { error } = await supabase
          .from('course_progress')
          .update({
            completed_modules: updatedModules,
            last_accessed: new Date().toISOString(),
            completion_percentage: completionPercentage,
          })
          .eq('user_id', session.user.id)
          .eq('course_id', courseId);

        if (error) {
          console.error('Error updating progress:', error);
          throw error;
        }
      } else {
        // Insert new record - use session user ID
        const { error } = await supabase
          .from('course_progress')
          .insert({
            user_id: session.user.id,
            course_id: courseId,
            completed_modules: updatedModules,
            last_accessed: new Date().toISOString(),
            completion_percentage: completionPercentage,
            started_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error inserting progress:', error);
          throw error;
        }
      }

      // Update local state
      const progressData = {
        user_id: session.user.id,
        course_id: courseId,
        completed_modules: updatedModules,
        last_accessed: new Date().toISOString(),
        completion_percentage: completionPercentage,
        started_at: existingData?.started_at || new Date().toISOString(),
      };

      setCourseProgress(prev => ({
        ...prev,
        [courseId]: progressData
      }));

    } catch (error) {
      console.error('Error updating module progress:', error);
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