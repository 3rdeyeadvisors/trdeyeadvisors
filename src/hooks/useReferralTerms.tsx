import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const CURRENT_TERMS_VERSION = "v1.0";

interface TermsAcceptance {
  id: string;
  terms_version: string;
  accepted_at: string;
}

export const useReferralTerms = () => {
  const { user } = useAuth();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptance, setAcceptance] = useState<TermsAcceptance | null>(null);

  const checkTermsAcceptance = useCallback(async () => {
    if (!user) {
      setHasAcceptedTerms(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("referral_terms_acceptance")
        .select("id, terms_version, accepted_at")
        .eq("user_id", user.id)
        .eq("terms_version", CURRENT_TERMS_VERSION)
        .maybeSingle();

      if (error) {
        console.error("Error checking terms acceptance:", error);
        setHasAcceptedTerms(false);
      } else if (data) {
        setHasAcceptedTerms(true);
        setAcceptance(data);
      } else {
        setHasAcceptedTerms(false);
      }
    } catch (error) {
      console.error("Error checking terms acceptance:", error);
      setHasAcceptedTerms(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkTermsAcceptance();
  }, [checkTermsAcceptance]);

  const refreshTermsStatus = useCallback(() => {
    setLoading(true);
    checkTermsAcceptance();
  }, [checkTermsAcceptance]);

  return {
    hasAcceptedTerms,
    loading,
    acceptance,
    refreshTermsStatus,
    currentVersion: CURRENT_TERMS_VERSION,
  };
};

export default useReferralTerms;
