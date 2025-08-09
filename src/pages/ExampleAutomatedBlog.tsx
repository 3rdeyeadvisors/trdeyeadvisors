/**
 * Example Blog Post with SEO Automation
 * This demonstrates how to use the new SEO automation system for blog posts
 */

import { BlogSEOAutomation } from "@/components/SEOAutomation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";

const ExampleAutomatedBlog = () => {
  // Blog post data - this would typically come from a CMS or API
  const blogPost = {
    title: "Advanced DeFi Yield Strategies for 2025",
    excerpt: "Discover cutting-edge yield farming techniques and portfolio optimization strategies for maximizing DeFi returns while managing risk effectively.",
    author: "3rdeyeadvisors Team",
    publishedDate: "2025-07-26",
    category: "DeFi Strategies",
    tags: ["yield farming", "DeFi", "portfolio optimization", "risk management", "cryptocurrency"],
    content: `
# Advanced DeFi Yield Strategies for 2025

The DeFi landscape continues to evolve rapidly, presenting new opportunities for sophisticated yield generation. In this comprehensive guide, we'll explore advanced strategies that go beyond basic yield farming.

## Key Strategies Covered

### 1. Delta-Neutral Yield Farming
Learn how to generate yield while minimizing price exposure through sophisticated hedging techniques.

### 2. Cross-Chain Arbitrage
Discover opportunities across different blockchain networks and how to capitalize on price discrepancies.

### 3. Liquidity Mining Optimization
Master the art of timing entries and exits in liquidity pools for maximum rewards.

## Risk Management Framework

Every strategy must be evaluated through our proprietary risk assessment matrix...
    `
  };

  return (
    <>
      {/* SEO Automation - automatically handles all SEO optimization */}
      <BlogSEOAutomation
        title={blogPost.title}
        excerpt={blogPost.excerpt}
        author={blogPost.author}
        publishedDate={blogPost.publishedDate}
        category={blogPost.category}
        tags={blogPost.tags}
      />

      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Article Header */}
          <Card className="p-8 mb-8 bg-gradient-consciousness border-primary/20 mobile-typography-center">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {blogPost.category}
              </Badge>
              {blogPost.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Only ONE H1 tag - automatically validated */}
            <h1 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-6">
              {blogPost.title}
            </h1>

            <p className="text-lg text-muted-foreground font-consciousness mb-6 leading-relaxed">
              {blogPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blogPost.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <Card className="p-8">
            <div className="prose prose-lg max-w-none mobile-typography-center">
              <div dangerouslySetInnerHTML={{ __html: blogPost.content.replace(/\n/g, '<br/>').replace(/#{1,6}\s/g, '') }} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ExampleAutomatedBlog;