import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogHeaderProps {
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: string;
  tags: string[];
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  excerpt,
  author,
  publishedDate,
  readTime,
  category,
  tags
}) => {
  return (
    <Card className="bg-gradient-consciousness border-primary/20 mb-8">
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {category}
          </Badge>
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-primary/30 text-foreground/70">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          {title}
        </h1>
        
        <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{publishedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogHeader;
