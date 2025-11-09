import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'moderator';
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ 
  children, 
  requireRole, 
  fallback = <div className="text-center p-8">Access denied. You don't have permission to view this page.</div> 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user || !requireRole) {
        setHasRole(true);
        setInitialCheckDone(true);
        return;
      }

      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', requireRole)
          .single();

        setHasRole(!error && !!roles);
      } catch (error) {
        console.error('Error checking user role:', error);
        setHasRole(false);
      } finally {
        setInitialCheckDone(true);
      }
    };

    // Only check on initial mount or if user ID changes
    if (!initialCheckDone) {
      checkUserRole();
    }
  }, [user?.id, requireRole, initialCheckDone]);

  if (loading || !initialCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground">Please sign in to access this page.</p>
      </div>
    );
  }

  if (requireRole && !hasRole) {
    return fallback;
  }

  return <>{children}</>;
};

export default ProtectedRoute;