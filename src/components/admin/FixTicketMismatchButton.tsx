import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Wrench, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface FixTicketMismatchButtonProps {
  raffleId: string;
  onFixed?: () => void;
}

export const FixTicketMismatchButton = ({ raffleId, onFixed }: FixTicketMismatchButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFix = async () => {
    setFixing(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('fix-specific-ticket-mismatches', {
        body: { raffleId }
      });

      if (error) throw error;

      setResults(data);

      if (data.success) {
        toast({
          title: "Ticket Mismatches Fixed",
          description: `Fixed ${data.summary.usersFixed} user(s) successfully`,
        });
        
        if (onFixed) {
          onFixed();
        }
      }
    } catch (error) {
      console.error('Error fixing tickets:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fix ticket mismatches",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wrench className="h-4 w-4" />
          Fix Ticket Mismatches
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Fix Ticket Mismatches
          </DialogTitle>
          <DialogDescription>
            This will correct ticket counts for 2 users identified in the audit with mismatched entry counts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!results && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will add missing tickets for users:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>User ending in ...8643 (needs 1 additional ticket)</li>
                  <li>User ending in ...9d22 (needs 7 additional tickets)</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{results.summary.usersFixed}</p>
                  <p className="text-xs text-muted-foreground">Fixed</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-awareness">{results.summary.usersAlreadyCorrect}</p>
                  <p className="text-xs text-muted-foreground">Already Correct</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-destructive">{results.summary.errors}</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-2">
                {results.results.map((result: any) => (
                  <div key={result.userId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          ...{result.userId.slice(-8)}
                        </code>
                        {result.status === 'fixed' && (
                          <Badge className="bg-awareness/20 text-awareness">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Fixed
                          </Badge>
                        )}
                        {result.status === 'no_action_needed' && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Already Correct
                          </Badge>
                        )}
                        {result.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>
                      {result.verified !== undefined && (
                        <Badge variant={result.verified ? "secondary" : "destructive"}>
                          {result.verified ? "Verified ✓" : "Verification Failed"}
                        </Badge>
                      )}
                    </div>

                    {result.status === 'fixed' && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Expected</p>
                          <p className="font-semibold">{result.expectedTickets} tickets</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Previous</p>
                          <p className="font-semibold">{result.previousTickets} tickets</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Added</p>
                          <p className="font-semibold text-primary">+{result.ticketsAdded} tickets</p>
                        </div>
                      </div>
                    )}

                    {result.message && (
                      <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!results ? (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={fixing}>
                Cancel
              </Button>
              <Button onClick={handleFix} disabled={fixing}>
                {fixing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {fixing ? "Fixing..." : "Fix Mismatches"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsOpen(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};