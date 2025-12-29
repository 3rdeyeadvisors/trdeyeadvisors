import React from 'react';

interface BlogSubsectionProps {
  title: string;
  children: React.ReactNode;
}

const BlogSubsection: React.FC<BlogSubsectionProps> = ({ title, children }) => {
  return (
    <div className="border-l-4 border-primary/50 pl-6 mb-6">
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <div className="text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
};

export default BlogSubsection;
