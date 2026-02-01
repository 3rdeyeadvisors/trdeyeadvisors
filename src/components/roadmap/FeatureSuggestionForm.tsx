import { useState } from 'react';
import { Lightbulb, Send, Loader2, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FeatureSuggestionFormProps {
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: (title: string, description: string) => Promise<boolean>;
}

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

export const FeatureSuggestionForm = ({
  canSubmit,
  submitting,
  onSubmit
}: FeatureSuggestionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const success = await onSubmit(title, description);
    if (success) {
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      setTitle(value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  // Non-premium users see upgrade CTA
  if (!canSubmit) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-base font-consciousness font-medium mb-1">Premium Feature</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Annual and Founding 33 members can submit feature ideas for consideration.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/subscription">
              View Plans <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors rounded-t-lg">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">Submit Your Feature Idea</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Share your ideas and help shape the platform
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="mt-1">
                {isOpen ? 'Close' : 'Open'}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-6 flex flex-col items-center">
            <div className="w-full max-w-md space-y-4 mx-auto">
              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between w-full text-left">
                  <label className="text-sm font-medium">Title</label>
                  <span className="text-xs text-muted-foreground">
                    {title.length}/{MAX_TITLE_LENGTH}
                  </span>
                </div>
                <Input
                  placeholder="Brief feature title..."
                  value={title}
                  onChange={handleTitleChange}
                  disabled={submitting}
                  className="bg-background"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between w-full text-left">
                  <label className="text-sm font-medium">Description</label>
                  <span className="text-xs text-muted-foreground">
                    {description.length}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>
                <Textarea
                  placeholder="Describe your feature idea in detail..."
                  value={description}
                  onChange={handleDescriptionChange}
                  disabled={submitting}
                  rows={4}
                  className="bg-background resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !title.trim() || !description.trim()}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Idea
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
