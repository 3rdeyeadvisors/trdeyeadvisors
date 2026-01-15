import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

// Point values for different actions
export const POINT_VALUES = {
  // One-time actions
  account_creation: 100,
  first_course_started: 50,
  complete_profile: 50,
  accept_referral_terms: 25,
  
  // Repeatable actions
  daily_login: 10,
  module_completion: 25,
  course_completion: 100,
  quiz_passed: 50,
  quiz_perfect: 75, // Bonus for 100% score
  tutorial_completed: 20,
  comment_posted: 15,
  discussion_started: 25,
  discussion_reply: 10,
  rate_course: 20,
  
  // Referral points
  referral_signup: 50,
  referral_monthly_conversion: 150,
  referral_annual_conversion: 300,
  referral_founding33_conversion: 500,
} as const;

export type PointActionType = keyof typeof POINT_VALUES;

interface PointTransaction {
  id: string;
  points: number;
  action_type: string;
  action_id: string | null;
  metadata: unknown;
  created_at: string;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  rank: number;
}

interface UserRank {
  total_points: number;
  rank: number;
  total_users: number;
}

export const usePoints = () => {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayPoints, setTodayPoints] = useState(0);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    return new Date().toISOString().slice(0, 7);
  };

  // Load user's current points and rank
  const loadPoints = useCallback(async () => {
    if (!user) {
      setTotalPoints(0);
      setRank(null);
      setLoading(false);
      return;
    }

    try {
      // Get user's monthly total
      const { data: monthlyData } = await supabase
        .from('user_points_monthly')
        .select('total_points')
        .eq('user_id', user.id)
        .eq('month_year', getCurrentMonth())
        .maybeSingle();

      setTotalPoints(monthlyData?.total_points || 0);

      // Get user's rank using database function
      const { data: rankData } = await supabase
        .rpc('get_user_points_rank', { _user_id: user.id });

      if (rankData && rankData.length > 0) {
        setRank({
          total_points: rankData[0].total_points,
          rank: rankData[0].rank,
          total_users: rankData[0].total_users,
        });
      }

      // Get today's points
      const today = new Date().toISOString().slice(0, 10);
      const { data: todayData } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      const todayTotal = todayData?.reduce((sum, p) => sum + p.points, 0) || 0;
      setTodayPoints(todayTotal);

    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  // Award points for an action
  const awardPoints = useCallback(async (
    actionType: PointActionType,
    actionId?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; pointsAwarded: number; message: string }> => {
    if (!user) {
      return { success: false, pointsAwarded: 0, message: 'User not authenticated' };
    }

    const basePoints = POINT_VALUES[actionType];
    if (!basePoints) {
      return { success: false, pointsAwarded: 0, message: 'Invalid action type' };
    }

    try {
      const { data, error } = await supabase.rpc('award_user_points', {
        _user_id: user.id,
        _points: basePoints,
        _action_type: actionType,
        _action_id: actionId || null,
        _metadata: metadata || {},
      });

      if (error) {
        console.error('Error awarding points:', error);
        return { success: false, pointsAwarded: 0, message: error.message };
      }

      const result = data?.[0];
      if (result?.success) {
        // Refresh points
        await loadPoints();
        return { 
          success: true, 
          pointsAwarded: result.points_awarded, 
          message: result.message 
        };
      }

      return { 
        success: false, 
        pointsAwarded: 0, 
        message: result?.message || 'Failed to award points' 
      };

    } catch (error) {
      console.error('Error awarding points:', error);
      return { success: false, pointsAwarded: 0, message: 'Error awarding points' };
    }
  }, [user, loadPoints]);

  // Check and award daily login points
  const checkDailyLogin = useCallback(async (): Promise<{ 
    alreadyLoggedIn: boolean; 
    pointsAwarded: number 
  }> => {
    if (!user) {
      return { alreadyLoggedIn: true, pointsAwarded: 0 };
    }

    try {
      const { data, error } = await supabase.rpc('check_daily_login', {
        _user_id: user.id,
      });

      if (error) {
        console.error('Error checking daily login:', error);
        return { alreadyLoggedIn: true, pointsAwarded: 0 };
      }

      const result = data?.[0];
      if (result && !result.already_logged_in) {
        await loadPoints();
        return { 
          alreadyLoggedIn: false, 
          pointsAwarded: result.points_awarded 
        };
      }

      return { alreadyLoggedIn: true, pointsAwarded: 0 };

    } catch (error) {
      console.error('Error checking daily login:', error);
      return { alreadyLoggedIn: true, pointsAwarded: 0 };
    }
  }, [user, loadPoints]);

  // Get point history
  const getPointHistory = useCallback(async (limit = 50): Promise<PointTransaction[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', getCurrentMonth())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error fetching point history:', error);
      return [];
    }
  }, [user]);

  // Get leaderboard
  const getLeaderboard = useCallback(async (limit = 10): Promise<LeaderboardEntry[]> => {
    try {
      const { data, error } = await supabase.rpc('get_points_leaderboard', {
        _limit: limit,
      });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }, []);

  // Get days remaining in month
  const getDaysRemaining = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return endOfMonth.getDate() - now.getDate();
  };

  // Get action display name
  const getActionDisplayName = (actionType: string): string => {
    const displayNames: Record<string, string> = {
      account_creation: 'Account Created',
      first_course_started: 'First Course Started',
      complete_profile: 'Profile Completed',
      accept_referral_terms: 'Referral Terms Accepted',
      daily_login: 'Daily Login',
      module_completion: 'Module Completed',
      course_completion: 'Course Completed',
      quiz_passed: 'Quiz Passed',
      quiz_perfect: 'Perfect Quiz Score',
      tutorial_completed: 'Tutorial Completed',
      comment_posted: 'Comment Posted',
      discussion_started: 'Discussion Started',
      discussion_reply: 'Discussion Reply',
      rate_course: 'Course Rated',
      referral_signup: 'Referral Signup',
      referral_monthly_conversion: 'Referral Subscribed (Monthly)',
      referral_annual_conversion: 'Referral Subscribed (Annual)',
      referral_founding33_conversion: 'Founding 33 Referral',
    };
    return displayNames[actionType] || actionType;
  };

  return {
    totalPoints,
    rank,
    loading,
    todayPoints,
    awardPoints,
    checkDailyLogin,
    getPointHistory,
    getLeaderboard,
    getDaysRemaining,
    getActionDisplayName,
    refreshPoints: loadPoints,
    POINT_VALUES,
  };
};
