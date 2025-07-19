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
      // Temporarily disabled until types are regenerated
      // const { data, error } = await supabase
      //   .from('course_progress')
      //   .select('*')
      //   .eq('user_id', user.id);

      // if (error) throw error;

      // const progressMap: Record<number, CourseProgress> = {};
      // data?.forEach((progress) => {
      //   progressMap[progress.course_id] = progress;
      // });

      // setCourseProgress(progressMap);
      setCourseProgress({});
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateModuleProgress = async (courseId: number, moduleIndex: number) => {
    if (!user) return;

    try {
      const existingProgress = courseProgress[courseId];
      const completedModules = existingProgress?.completed_modules || [];
      
      if (!completedModules.includes(moduleIndex)) {
        const updatedModules = [...completedModules, moduleIndex];
        const totalModules = getCourseModuleCount(courseId);
        const completionPercentage = (updatedModules.length / totalModules) * 100;

        const progressData = {
          user_id: user.id,
          course_id: courseId,
          completed_modules: updatedModules,
          last_accessed: new Date().toISOString(),
          completion_percentage: completionPercentage,
          started_at: existingProgress?.started_at || new Date().toISOString(),
        };

        // Temporarily disabled until types are regenerated
        // const { error } = await supabase
        //   .from('course_progress')
        //   .upsert(progressData);

        // if (error) throw error;

        setCourseProgress(prev => ({
          ...prev,
          [courseId]: progressData
        }));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
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