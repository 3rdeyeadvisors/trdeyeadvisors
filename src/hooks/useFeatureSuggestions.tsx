import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface FeatureSuggestion {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'promoted';
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  submitter_name?: string;
}

export const useFeatureSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  
  const [suggestions, setSuggestions] = useState<FeatureSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all suggestions
  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feature_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile names for submitters
      const userIds = [...new Set((data || []).map(s => s.user_id))];

      
      let profiles: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .rpc('get_profiles_batch', { user_ids: userIds });

        
        if (profileData) {
          profiles = profileData.reduce((acc: Record<string, string>, p: any) => {
            acc[p.user_id] = p.display_name || 'Anonymous';
            return acc;
          }, {});
        }
      }

      const processedSuggestions: FeatureSuggestion[] = (data || []).map(s => ({
        id: s.id,
        user_id: s.user_id,
        title: s.title,
        description: s.description,
        status: s.status as FeatureSuggestion['status'],
        admin_notes: s.admin_notes,
        created_at: s.created_at,
        reviewed_at: s.reviewed_at,
        submitter_name: profiles[s.user_id] || 'Anonymous',
      }));

      setSuggestions(processedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feature suggestions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Submit a new suggestion
  const submitSuggestion = useCallback(async (title: string, description: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit feature ideas',
        variant: 'destructive',
      });
      return false;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please provide both a title and description',
        variant: 'destructive',
      });
      return false;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('feature_suggestions')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
        });

      if (error) throw error;

      toast({
        title: 'Idea submitted!',
        description: 'Your feature suggestion has been sent for review',
      });

      await fetchSuggestions();
      return true;
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your suggestion',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, toast, fetchSuggestions]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    submitting,
    submitSuggestion,
    refreshSuggestions: fetchSuggestions,
  };
};

// Admin hook for managing suggestions
export const useFeatureSuggestionsAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (
    suggestionId: string,
    suggestionId: string, 
    status: FeatureSuggestion['status'],
    adminNotes?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('feature_suggestions')
        .update({
          status,
        .update({ 
          status, 
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', suggestionId);

      if (error) throw error;

      toast({
        title: 'Status updated',
        description: `Suggestion marked as ${status}`,
      });
      return true;
    } catch (error) {
      console.error('Error updating suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update suggestion',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const promoteToRoadmap = async (
    suggestion: FeatureSuggestion
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Set voting deadline to 7 days from now
      const votingEndsAt = new Date();
      votingEndsAt.setDate(votingEndsAt.getDate() + 7);

      // Create roadmap item
      const { error: createError } = await supabase
        .from('roadmap_items')
        .insert({
          title: suggestion.title,
          description: suggestion.description,
          status: 'proposed',
          voting_ends_at: votingEndsAt.toISOString(),
        });

      if (createError) throw createError;

      // Update suggestion status
      const { error: updateError } = await supabase
        .from('feature_suggestions')
        .update({
        .update({ 
          status: 'promoted',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', suggestion.id);

      if (updateError) throw updateError;

      toast({
        title: 'Promoted to Roadmap!',
        description: 'The suggestion is now available for voting',
      });
      return true;
    } catch (error) {
      console.error('Error promoting suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to promote suggestion',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateStatus,
    promoteToRoadmap,
  };
};
