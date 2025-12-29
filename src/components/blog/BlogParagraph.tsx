import React from 'react';

interface BlogParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const BlogParagraph: React.FC<BlogParagraphProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-foreground/90 leading-relaxed mb-4 ${className}`}>
      {children}
    </p>
  );
};

export default BlogParagraph;
