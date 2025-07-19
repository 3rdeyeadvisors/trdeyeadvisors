import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Calculator, Filter } from "lucide-react";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const courses = [
    {
      id: 1,
      title: "DeFi Foundations: Understanding the New Financial System",
      description: "Complete beginner's guide from zero knowledge to confident understanding. Learn what DeFi is, why it exists, and how it works in plain English.",
      category: "free",
      type: "course",
      duration: "5 modules",
      modules: [
        "What is DeFi? (Simple explanation with comparisons to traditional banking)",
        "Why DeFi Exists (The problems it solves – fees, middlemen, accessibility)",
        "The Blockchain Basics You Actually Need to Know (No tech overload)",
        "The Key Players (Stablecoins, DEXs, lending protocols – explained simply)",
        "Risks and Myths (Separating facts from hype)"
      ],
      icon: BookOpen
    },
    {
      id: 2,
      title: "Staying Safe in DeFi: Wallets, Security, and Avoiding Scams",
      description: "Essential security course for beginners worried about hacks or losing funds. Learn to set up wallets correctly and keep funds safe.",
      category: "free",
      type: "course", 
      duration: "5 modules",
      modules: [
        "Choosing the Right Wallet (MetaMask, Trust Wallet, or Ledger?)",
        "Private Keys & Seed Phrases – The Rule You Can't Break",
        "Spotting Scams and Fake Projects Before You Click",
        "Safe Transactions – Sending, Receiving, and Testing Small First",
        "The Beginner's Checklist for DeFi Security"
      ],
      icon: BookOpen
    },
    {
      id: 3,
      title: "Earning with DeFi: Staking, Yield Farming, and Liquidity Pools Made Simple",
      description: "Ready to earn passive income? Understand different earning methods and choose what fits your risk level.",
      category: "paid",
      type: "course",
      duration: "5 modules",
      price: "$67",
      modules: [
        "How People Earn with DeFi (Overview)",
        "Staking vs Yield Farming – Which is Better for You?",
        "What Are Liquidity Pools (Explained Without Confusion)",
        "How to Calculate Risk vs Reward Before You Invest",
        "Beginner-Friendly Platforms to Start With"
      ],
      icon: BookOpen
    },
    {
      id: 4,
      title: "Managing Your Own DeFi Portfolio: From Beginner to Confident User",
      description: "Learn to actively manage a small DeFi portfolio. Track, adjust, and grow your investments responsibly.",
      category: "paid",
      type: "course",
      duration: "5 modules",
      price: "$97",
      modules: [
        "How to Build a Starter Portfolio (Even with $100)",
        "Tracking Your Investments (Best DeFi Portfolio Tools)",
        "When to Reinvest vs Take Profits",
        "Recognizing Market Trends Without Guessing",
        "Staying Consistent: The Long-Term DeFi Mindset"
      ],
      icon: BookOpen
    }
  ];

  const filters = [
    { id: "all", label: "All Resources" },
    { id: "free", label: "Free Courses" },
    { id: "paid", label: "Paid Courses" },
    { id: "tool", label: "Tools & Trackers" }
  ];

  const filteredCourses = activeFilter === "all" 
    ? courses 
    : courses.filter(course => course.category === activeFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "free": return "bg-awareness/20 text-awareness border-awareness/30";
      case "paid": return "bg-primary/20 text-primary border-primary/30";
      case "tool": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-4">
            Courses & Tools
          </h1>
          <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Reprogram your understanding with our curated learning resources and practical tools
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "cosmic" : "system"}
              onClick={() => setActiveFilter(filter.id)}
              className="font-consciousness"
            >
              <Filter className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <Card 
              key={course.id}
              className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <course.icon className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
                <Badge className={getCategoryColor(course.category)}>
                  {course.category === "free" ? "Free" : 
                   course.category === "paid" ? course.price : "Tool"}
                </Badge>
              </div>
              
              <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
                {course.title}
              </h3>
              
              <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-system">
                  {course.duration}
                </span>
                <Button 
                  variant={course.category === "paid" ? "cosmic" : "awareness"}
                  size="sm"
                  className="font-consciousness"
                >
                  {course.category === "tool" ? "Launch" : "Start Learning"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;