import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getBlogPosts, getBlogPostsByCategory } from "@/data/blogContent";
import SEO from "@/components/SEO";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const posts = getBlogPostsByCategory(selectedCategory);
  
  // Debug logging
  console.log("Blog component - selectedCategory:", selectedCategory);
  console.log("Blog component - posts:", posts);
  console.log("Blog component - posts length:", posts.length);
  
  const now = new Date();
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const featuredPosts = posts.filter(post => {
    const d = new Date(post.date);
    return !isNaN(d.getTime()) && d >= cutoff;
  });
  console.log("Featured posts (last 7 days):", featuredPosts);
  
  const regularPosts = posts.filter(post => {
    const d = new Date(post.date);
    return isNaN(d.getTime()) || d < cutoff;
  });
  console.log("Regular posts:", regularPosts);

  const categories = ["All", "DeFi Education", "Innovation", "Security", "Education", "Analysis", "Web3 Gaming", "DeFAI", "DeFi Tools"];

  // Simplified sliding handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (translateX > threshold && currentFeaturedIndex > 0) {
      setCurrentFeaturedIndex(currentFeaturedIndex - 1);
    } else if (translateX < -threshold && currentFeaturedIndex < featuredPosts.length - 1) {
      setCurrentFeaturedIndex(currentFeaturedIndex + 1);
    }
    setTranslateX(0);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "DeFi Education":
      case "Education": 
        return "bg-awareness/30 text-awareness border-awareness/50 hover:bg-awareness/40";
      case "Security": 
        return "bg-primary/30 text-primary border-primary/50 hover:bg-primary/40";
      case "Innovation": 
        return "bg-accent/30 text-accent border-accent/50 hover:bg-accent/40";
      case "DeFi Tools":
      case "Tools": 
        return "bg-secondary/60 text-secondary-foreground border-secondary/50 hover:bg-secondary/70";
      case "Analysis": 
        return "bg-muted/50 text-foreground border-border hover:bg-muted/60";
      case "Web3 Gaming":
        return "bg-accent/25 text-accent border-accent/40 hover:bg-accent/35";
      case "DeFAI":
        return "bg-primary/25 text-primary border-primary/40 hover:bg-primary/35";
      default: 
        return "bg-primary/30 text-primary border-primary/50 hover:bg-primary/40";
    }
  };

  return (
    <>
      <SEO 
        title="DeFi Blog - Cryptocurrency Articles & Blockchain Education"
        description="Expert DeFi blog with cryptocurrency analysis, yield farming insights, blockchain education, and DeFi security guides. Stay updated with the latest decentralized finance trends and strategies."
        keywords="DeFi blog, cryptocurrency articles, blockchain education, DeFi analysis, crypto news, yield farming insights, DeFi security, cryptocurrency trends, blockchain analysis"
        url="https://www.the3rdeyeadvisors.com/blog"
        schema={{
          type: 'WebPage',
          data: {
            mainEntity: {
              "@type": "Blog",
              name: "3rdeyeadvisors DeFi Blog",
              description: "Educational content about decentralized finance, cryptocurrency, and blockchain technology"
            }
          }
        }}
        faq={[
          {
            question: "What topics does your DeFi blog cover?",
            answer: "Our DeFi blog covers yield farming strategies, cryptocurrency analysis, blockchain technology insights, DeFi security best practices, market trends, and educational content for all skill levels."
          },
          {
            question: "How often do you publish new cryptocurrency articles?",
            answer: "We regularly publish new articles covering the latest DeFi developments, market analysis, and educational content. Our blog is updated with fresh insights on decentralized finance trends and opportunities."
          },
          {
            question: "Are your DeFi articles suitable for beginners?",
            answer: "Yes! Our blog features content for all levels, from beginner-friendly explanations of DeFi concepts to advanced analysis for experienced crypto investors. Each article is clearly marked by difficulty level."
          }
        ]}
      />
      <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 mobile-typography-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-4">
            Blog & Articles
          </h1>
          <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Insights, analysis, and consciousness expansion for the evolving DeFi ecosystem
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              className={`px-4 py-2 cursor-pointer transition-all duration-cosmic hover:scale-105 ${
                category === selectedCategory 
                  ? "bg-primary/40 text-primary border-primary/60" 
                  : getCategoryColor(category)
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Debug Info */}
        {posts.length === 0 && (
          <div className="text-center p-8 bg-red-100 text-red-800 rounded">
            <p>No blog posts found! Debug info:</p>
            <p>Selected Category: {selectedCategory}</p>
            <p>Posts array length: {posts.length}</p>
          </div>
        )}
        

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl section-heading mb-6">Featured This Week</h2>
            <div className="max-w-xs mx-auto">
              <Card 
                className="p-4 bg-gradient-consciousness border-primary/20 shadow-consciousness cursor-grab active:cursor-grabbing select-none"
                ref={sliderRef}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
              >
                <div className="overflow-hidden">
                  <div 
                    className={`flex ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
                    style={{ 
                      transform: `translateX(${-currentFeaturedIndex * 100 + (isDragging ? (translateX / 320) * 100 : 0)}%)` 
                    }}
                  >
                    {featuredPosts.map((post) => (
                      <div key={post.id} className="w-full flex-shrink-0 flex flex-col min-h-[200px]">
                        {/* Badge */}
                        <Badge className={`mb-3 w-fit ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </Badge>

                        {/* Content */}
                        <h3 className="text-lg font-consciousness font-semibold text-foreground mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground font-consciousness mb-3 leading-relaxed flex-grow line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-system">{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="font-system">{post.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="px-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full font-consciousness text-sm h-8 bg-background/90 hover:bg-primary/10 border-primary/40"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                          >
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation dots */}
                {featuredPosts.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3 pt-3 border-t border-primary/20">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeaturedIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentFeaturedIndex 
                            ? 'bg-awareness' 
                            : 'bg-foreground/20 hover:bg-awareness/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <Card 
              key={post.id}
              className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Badge className={`mb-4 ${getCategoryColor(post.category)}`}>
                {post.category}
              </Badge>
              
              <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed flex-grow">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-system">{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-system">{post.readTime}</span>
                </div>
              </div>
              
              <Button 
                variant="cosmic" 
                size="sm" 
                className="w-full font-consciousness"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Blog;