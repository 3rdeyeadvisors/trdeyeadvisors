import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BlogSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const BlogSection: React.FC<BlogSectionProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default BlogSection;
