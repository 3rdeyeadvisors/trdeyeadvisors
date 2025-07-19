import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "DeFi for Beginners: The Simple Guide to Understanding the Future of Finance",
      excerpt: "A beginner-friendly guide breaking down DeFi in plain English. Learn what it is, why it matters, and how to get started safely.",
      category: "Education",
      readTime: "8 min read",
      date: "2024-01-15",
      featured: true
    },
    {
      id: 2,
      title: "5 Common DeFi Mistakes New Investors Make (and How to Avoid Them)",
      excerpt: "Practical tips from real experiences. Learn from others' mistakes and protect your capital from day one.",
      category: "Security",
      readTime: "6 min read",
      date: "2024-01-12",
      featured: false
    },
    {
      id: 3,
      title: "The Safest DeFi Wallets for Beginners in 2025",
      excerpt: "Complete comparison of MetaMask, Trust Wallet, and hardware options. Which one is right for your needs?",
      category: "Tools",
      readTime: "10 min read",
      date: "2024-01-10",
      featured: false
    },
    {
      id: 4,
      title: "Is Yield Farming Still Worth It? What You Need to Know Before You Try",
      excerpt: "Balanced analysis of current yield farming opportunities. Real data, not hype, to help you make informed decisions.",
      category: "Analysis",
      readTime: "12 min read",
      date: "2024-01-08",
      featured: false
    },
    {
      id: 5,
      title: "The Top 3 DeFi Tools Every Beginner Should Use Right Now",
      excerpt: "Essential tools for portfolio tracking, transaction monitoring, and staying safe in DeFi. Links to our Resource Hub included.",
      category: "Tools",
      readTime: "7 min read",
      date: "2024-01-05",
      featured: false
    }
  ];

  const categories = ["All", "Education", "Security", "Tools", "Analysis"];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Education": return "bg-awareness/20 text-awareness border-awareness/30";
      case "Security": return "bg-primary/20 text-primary border-primary/30";
      case "Tools": return "bg-accent/20 text-accent border-accent/30";
      case "Analysis": return "bg-secondary/40 text-secondary-foreground border-secondary";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
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
                category === "All" 
                  ? "bg-primary/20 text-primary border-primary/30" 
                  : getCategoryColor(category)
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        {posts.filter(post => post.featured).map((post) => (
          <Card 
            key={post.id}
            className="p-8 mb-12 bg-gradient-consciousness border-primary/20 shadow-consciousness hover:shadow-awareness transition-all duration-cosmic"
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className="bg-primary/30 text-primary border-primary/40">
                Featured
              </Badge>
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-consciousness font-bold text-foreground mb-4">
              {post.title}
            </h2>
            
            <p className="text-lg text-muted-foreground font-consciousness mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
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
              <Button variant="cosmic" className="font-consciousness">
                Read Article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.filter(post => !post.featured).map((post, index) => (
            <Card 
              key={post.id}
              className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Badge className={`mb-4 ${getCategoryColor(post.category)}`}>
                {post.category}
              </Badge>
              
              <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed">
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
              
              <Button variant="awareness" size="sm" className="w-full font-consciousness">
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;