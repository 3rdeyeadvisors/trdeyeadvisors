import { useState } from "react";
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

  const categories = ["All", "DeFi Education", "Innovation", "Security", "Education", "Analysis", "Web3 Gaming", "DeFAI"];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "DeFi Education":
      case "Education": 
        return "bg-awareness/20 text-awareness border-awareness/30 hover:bg-awareness/30";
      case "Security": 
        return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30";
      case "Innovation": 
        return "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30";
      case "Tools": 
        return "bg-secondary/40 text-secondary-foreground border-secondary/30 hover:bg-secondary/50";
      case "Analysis": 
        return "bg-muted/30 text-foreground border-border hover:bg-muted/40";
      case "Web3 Gaming":
        return "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30";
      default: 
        return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30";
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
                  ? "bg-primary/20 text-primary border-primary/30" 
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
          <div className="mt-12">
            <h2 className="text-2xl font-consciousness font-bold text-foreground mb-6">Featured This Week</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {featuredPosts.map((post) => (
                <Card 
                  key={post.id}
                  className="w-full p-6 bg-gradient-consciousness border-primary/20 shadow-consciousness hover:shadow-awareness transition-all duration-cosmic flex-shrink-0"
                >
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Badge className="bg-primary text-primary-foreground border-primary shadow-cosmic">
                      Featured
                    </Badge>
                    <Badge className={`${getCategoryColor(post.category)}`}>
                      {post.category}
                    </Badge>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge 
                          key={`${post.id}-tag-${tagIndex}`} 
                          variant="outline" 
                          className="text-xs bg-background/50 text-foreground border-primary/30 hover:bg-primary/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-consciousness font-bold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-base text-muted-foreground font-consciousness mb-4 leading-relaxed line-clamp-3 break-words overflow-hidden w-full">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                      className="font-consciousness"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
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