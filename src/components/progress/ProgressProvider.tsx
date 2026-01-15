import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { courseContent } from '@/data/courseContent';
import { usePoints } from '@/hooks/usePoints';

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
  const { awardPoints } = usePoints();

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
      const { data: existingData, error: fetchError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (fetchError) {
        console.error('[Progress] Error fetching existing data:', fetchError);
        throw fetchError;
      }

      console.log('[Progress] BEFORE - Existing data:', existingData);
      console.log('[Progress] BEFORE - Completed modules:', existingData?.completed_modules);

      // Ensure we have a valid array
      const completedModules = Array.isArray(existingData?.completed_modules) 
        ? existingData.completed_modules 
        : [];
      
      console.log('[Progress] Validated completed modules array:', completedModules);
      
      // Don't add if already completed
      if (completedModules.includes(moduleIndex)) {
        console.log('[Progress] Module already completed, skipping');
        return;
      }

      // Build updated modules array
      const updatedModules = [...completedModules, moduleIndex].sort((a, b) => a - b);
      const totalModules = getCourseModuleCount(courseId);
      const completionPercentage = (updatedModules.length / totalModules) * 100;

      console.log('[Progress] AFTER - Will save these modules:', updatedModules);
      console.log('[Progress] Completion percentage:', completionPercentage);

      let resultData;

      if (existingData) {
        // Record exists - UPDATE it
        console.log('[Progress] Record exists, performing UPDATE');
        const { error: updateError, data: updateData } = await supabase
          .from('course_progress')
          .update({
            completed_modules: updatedModules,
            last_accessed: new Date().toISOString(),
            completion_percentage: completionPercentage,
          })
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .select()
          .single();

        if (updateError) {
          console.error('[Progress] Error updating progress:', updateError);
          throw updateError;
        }
        
        resultData = updateData;
        console.log('[Progress] UPDATE successful! Saved data:', resultData);
      } else {
        // Record doesn't exist - INSERT it
        console.log('[Progress] No existing record, performing INSERT');
        const { error: insertError, data: insertData } = await supabase
          .from('course_progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            completed_modules: updatedModules,
            last_accessed: new Date().toISOString(),
            completion_percentage: completionPercentage,
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error('[Progress] Error inserting progress:', insertError);
          throw insertError;
        }
        
        resultData = insertData;
        console.log('[Progress] INSERT successful! Saved data:', resultData);
        
        // Award points for first course started
        if (updatedModules.length === 1) {
          try {
            await awardPoints('first_course_started', `course_${courseId}`);
          } catch (e) {
            console.log('[Progress] Could not award first_course_started points');
          }
        }
      }

      console.log('[Progress] Confirmed saved modules:', resultData.completed_modules);

      // Award points for module completion
      try {
        const result = await awardPoints('module_completion', `${courseId}_${moduleIndex}`);
        console.log('[Progress] Module completion points:', result);
      } catch (e) {
        console.log('[Progress] Could not award module completion points');
      }

      // Check if course is now complete and award course completion points
      if (resultData.completion_percentage === 100) {
        try {
          await awardPoints('course_completion', `course_${courseId}`);
          console.log('[Progress] Course completion points awarded');
        } catch (e) {
          console.log('[Progress] Could not award course completion points');
        }
      }

      // Update local state with the exact data from database
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: resultData
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
    const course = courseContent.find(c => c.id === courseId);
    return course?.modules.length || 5;
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