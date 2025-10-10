import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

interface NewsletterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
}

export const NewsletterPromptModal = ({ isOpen, onClose, userEmail, userName }: NewsletterPromptModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ 
          email: userEmail,
          name: userName || ''
        }]);

      if (error) throw error;

      toast({
        title: "Welcome to our newsletter!",
        description: "You've been successfully subscribed.",
      });
      onClose();
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-primary" />
            <DialogTitle className="font-consciousness">Stay Updated</DialogTitle>
          </div>
          <DialogDescription>
            Would you like to subscribe to our newsletter? Get the latest DeFi insights, tutorials, and exclusive content delivered to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-4">
          <Button 
            onClick={handleSubscribe} 
            disabled={loading}
            className="flex-1"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Subscribe
          </Button>
          <Button 
            onClick={handleDecline}
            variant="outline"
            disabled={loading}
            className="flex-1"
          >
            No Thanks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
