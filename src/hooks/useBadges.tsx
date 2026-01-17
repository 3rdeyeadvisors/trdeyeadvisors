import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { BADGE_DEFINITIONS, BadgeType, getBadgeDefinition } from '@/lib/badges';
import { toast } from 'sonner';

interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
  metadata: unknown;
}

export const useBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's badges
  const loadBadges = useCallback(async () => {
    if (!user) {
      setBadges([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  // Check if user has a specific badge
  const hasBadge = useCallback((badgeType: BadgeType): boolean => {
    return badges.some(b => b.badge_type === badgeType);
  }, [badges]);

  // Award a badge to the user
  const awardBadge = useCallback(async (
    badgeType: BadgeType,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; isNew: boolean }> => {
    if (!user) {
      return { success: false, isNew: false };
    }

    // Check if already has badge
    if (hasBadge(badgeType)) {
      return { success: true, isNew: false };
    }

    const definition = getBadgeDefinition(badgeType);
    if (!definition) {
      console.error('Unknown badge type:', badgeType);
      return { success: false, isNew: false };
    }

    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_type: badgeType,
          badge_name: definition.name,
          badge_description: definition.description,
          metadata: metadata || null,
        });

      if (error) {
        // Handle duplicate error gracefully
        if (error.code === '23505') {
          return { success: true, isNew: false };
        }
        throw error;
      }

      // Show toast notification
      toast.success(`🏆 Badge Earned: ${definition.name}`, {
        description: definition.description,
        duration: 4000,
      });

      // Reload badges
      await loadBadges();
      return { success: true, isNew: true };
    } catch (error) {
      console.error('Error awarding badge:', error);
      return { success: false, isNew: false };
    }
  }, [user, hasBadge, loadBadges]);

  // Check and award badges based on current progress
  const checkBadgeProgress = useCallback(async (progressData: {
    completedCourses?: number;
    passedQuizzes?: number;
    hasPerfectQuiz?: boolean;
    loginStreak?: number;
    hasComment?: boolean;
    isFirstModule?: boolean;
    totalCourses?: number;
  }) => {
    if (!user) return;

    const {
      completedCourses = 0,
      passedQuizzes = 0,
      hasPerfectQuiz = false,
      loginStreak = 0,
      hasComment = false,
      isFirstModule = false,
      totalCourses = 4,
    } = progressData;

    // First Steps - Started first course
    if (isFirstModule && !hasBadge('first_steps')) {
      await awardBadge('first_steps');
    }

    // Course Graduate - Completed a course
    if (completedCourses >= 1 && !hasBadge('course_graduate')) {
      await awardBadge('course_graduate');
    }

    // Quiz Master - Passed 5 quizzes
    if (passedQuizzes >= 5 && !hasBadge('quiz_master')) {
      await awardBadge('quiz_master');
    }

    // Perfectionist - Got 100% on a quiz
    if (hasPerfectQuiz && !hasBadge('perfectionist')) {
      await awardBadge('perfectionist');
    }

    // Scholar - Completed 3 courses
    if (completedCourses >= 3 && !hasBadge('scholar')) {
      await awardBadge('scholar');
    }

    // DeFi Master - Completed all courses
    if (completedCourses >= totalCourses && !hasBadge('defi_master')) {
      await awardBadge('defi_master');
    }

    // Streak badges
    if (loginStreak >= 3 && !hasBadge('streak_3')) {
      await awardBadge('streak_3');
    }

    if (loginStreak >= 7 && !hasBadge('streak_7')) {
      await awardBadge('streak_7');
    }

    // Contributor - Posted first comment
    if (hasComment && !hasBadge('contributor')) {
      await awardBadge('contributor');
    }
  }, [user, hasBadge, awardBadge]);

  // Get count of earned badges
  const getBadgeCount = useCallback((): number => {
    return badges.length;
  }, [badges]);

  // Get all possible badges with earned status
  const getAllBadgesWithStatus = useCallback(() => {
    return Object.entries(BADGE_DEFINITIONS).map(([type, definition]) => ({
      ...definition,
      earned: badges.some(b => b.badge_type === type),
      earnedAt: badges.find(b => b.badge_type === type)?.earned_at,
    }));
  }, [badges]);

  return {
    badges,
    loading,
    hasBadge,
    awardBadge,
    checkBadgeProgress,
    getBadgeCount,
    getAllBadgesWithStatus,
    refreshBadges: loadBadges,
  };
};
