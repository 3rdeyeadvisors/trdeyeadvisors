import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { KeyTakeaway } from './KeyTakeaway';
import { DidYouKnow } from './DidYouKnow';
import { StepBlock } from './StepBlock';
import { FlipCard } from './FlipCard';
import { ComparisonTable } from './ComparisonTable';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface EnhancedMarkdownRendererProps {
  content: string;
  heroImage?: string;
}

export const EnhancedMarkdownRenderer = ({ content, heroImage }: EnhancedMarkdownRendererProps) => {
  // Parse custom components from the markdown
  const renderContent = () => {
    const parts = content.split(/(\[COMPONENT:.*?\].*?\[\/COMPONENT\])/gs);
    
    return parts.map((part, index) => {
      // Check if this is a component marker
      const componentMatch = part.match(/\[COMPONENT:(.*?)\](.*?)\[\/COMPONENT\]/s);
      
      if (componentMatch) {
        const [, componentType, componentContent] = componentMatch;
        
        try {
          const data = JSON.parse(componentContent);
          
          switch (componentType) {
            case 'KEY_TAKEAWAY':
              return (
                <div key={index} className="my-6">
                  <KeyTakeaway title={data.title}>
                    {data.content}
                  </KeyTakeaway>
                </div>
              );
              
            case 'DID_YOU_KNOW':
              return (
                <div key={index} className="my-6">
                  <DidYouKnow fact={data.fact} />
                </div>
              );
              
            case 'STEP_BLOCK':
              return (
                <div key={index} className="my-6">
                  <StepBlock steps={data.steps} title={data.title} />
                </div>
              );
              
            case 'FLIP_CARDS':
              return (
                <div key={index} className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.cards.map((card: { front: string; back: string }, cardIndex: number) => (
                    <FlipCard key={cardIndex} front={card.front} back={card.back} />
                  ))}
                </div>
              );
              
            case 'COMPARISON_TABLE':
              return (
                <div key={index} className="my-6">
                  <ComparisonTable
                    title={data.title}
                    items={data.items}
                  />
                </div>
              );
              
            case 'ALERT':
              const icons = {
                warning: AlertTriangle,
                info: Info,
                success: CheckCircle
              };
              const Icon = icons[data.type as keyof typeof icons] || Info;
              
              return (
                <div key={index} className="my-6">
                  <Alert className={`border-${data.type === 'warning' ? 'destructive' : data.type === 'success' ? 'awareness' : 'accent'}`}>
                    <Icon className="h-4 w-4" />
                    <AlertDescription>{data.message}</AlertDescription>
                  </Alert>
                </div>
              );
              
            default:
              return null;
          }
        } catch (e) {
          console.error('Error parsing component:', e);
          return null;
        }
      }
      
      // Regular markdown content
      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-6 mt-8" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl md:text-3xl font-consciousness font-semibold text-foreground mb-4 mt-6" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl md:text-2xl font-consciousness font-semibold text-foreground mb-3 mt-4" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-lg md:text-xl font-consciousness font-medium text-foreground mb-2 mt-3" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-base text-foreground mb-4 leading-relaxed font-system" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-foreground ml-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground ml-4" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-base leading-relaxed font-system" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <Card className="my-4 border-l-4 border-primary">
                <CardContent className="p-4">
                  <blockquote className="text-muted-foreground italic" {...props} />
                </CardContent>
              </Card>
            ),
            code: ({ node, inline, ...props }: any) => 
              inline ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props} />
              ) : (
                <code className="block bg-muted p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm" {...props} />
              ),
            strong: ({ node, ...props }) => (
              <strong className="font-bold text-primary" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic text-accent" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-primary hover:text-primary/80 underline" {...props} />
            ),
          }}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className="prose prose-invert max-w-none">
      {heroImage && (
        <div className="w-full mb-8 rounded-lg overflow-hidden">
          <img 
            src={heroImage} 
            alt="Course module hero" 
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      )}
      {renderContent()}
    </div>
  );
};
