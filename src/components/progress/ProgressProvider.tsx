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
      // Get fresh session and explicitly set it on the client
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[Progress] Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session?.user || !session?.access_token) {
        console.error('[Progress] No valid session or access token found');
        throw new Error('No valid session');
      }

      console.log('[Progress] Session verified:', session.user.id);
      console.log('[Progress] Session access token present:', !!session.access_token);

      // Explicitly set the session to ensure the access token is used
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });

      console.log('[Progress] Session explicitly set on client');

      // Query with fresh session user ID
      const { data: existingData, error: fetchError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (fetchError) {
        console.error('[Progress] Error fetching progress:', fetchError);
        throw fetchError;
      }

      console.log('[Progress] Existing data:', existingData);

      const completedModules = existingData?.completed_modules || [];
      
      // Don't add if already completed
      if (completedModules.includes(moduleIndex)) {
        console.log('[Progress] Module already completed');
        return;
      }

      const updatedModules = [...completedModules, moduleIndex].sort((a, b) => a - b);
      const totalModules = getCourseModuleCount(courseId);
      const completionPercentage = (updatedModules.length / totalModules) * 100;

      console.log('[Progress] Will update with:', { updatedModules, completionPercentage });

      if (existingData) {
        // Update existing record - use session user ID
        const { error, data } = await supabase
          .from('course_progress')
          .update({
            completed_modules: updatedModules,
            last_accessed: new Date().toISOString(),
            completion_percentage: completionPercentage,
          })
          .eq('user_id', session.user.id)
          .eq('course_id', courseId)
          .select();

        if (error) {
          console.error('[Progress] Error updating progress:', error);
          throw error;
        }
        console.log('[Progress] Update successful:', data);
      } else {
        // Insert new record - use session user ID
        const { error, data } = await supabase
          .from('course_progress')
          .insert({
            user_id: session.user.id,
            course_id: courseId,
            completed_modules: updatedModules,
            last_accessed: new Date().toISOString(),
            completion_percentage: completionPercentage,
            started_at: new Date().toISOString(),
          })
          .select();

        if (error) {
          console.error('[Progress] Error inserting progress:', error);
          throw error;
        }
        console.log('[Progress] Insert successful:', data);
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

      console.log('[Progress] Local state updated successfully');

    } catch (error) {
      console.error('[Progress] Error updating module progress:', error);
      throw error; // Re-throw so caller can handle it
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