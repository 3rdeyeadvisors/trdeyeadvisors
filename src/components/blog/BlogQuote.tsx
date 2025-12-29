import React from 'react';

interface BlogQuoteProps {
  children: React.ReactNode;
}

const BlogQuote: React.FC<BlogQuoteProps> = ({ children }) => {
  return (
    <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-foreground/80">
      {children}
    </blockquote>
  );
};

export default BlogQuote;
