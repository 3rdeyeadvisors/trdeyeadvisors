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
      title: "DeFi Fundamentals",
      description: "Understanding the core protocols that power decentralized finance",
      category: "free",
      type: "course",
      duration: "4 hours",
      icon: BookOpen
    },
    {
      id: 2,
      title: "Smart Contract Analysis Tool",
      description: "Analyze and audit smart contracts before interaction",
      category: "tool",
      type: "utility",
      duration: "Web App",
      icon: Code
    },
    {
      id: 3,
      title: "Yield Farming Mastery",
      description: "Advanced strategies for sustainable yield generation",
      category: "paid",
      type: "course",
      duration: "8 hours",
      price: "$97",
      icon: BookOpen
    },
    {
      id: 4,
      title: "DeFi Portfolio Tracker",
      description: "Track your positions across multiple protocols and chains",
      category: "tool",
      type: "utility",
      duration: "Dashboard",
      icon: Calculator
    },
    {
      id: 5,
      title: "Liquidity Mining Optimization",
      description: "Maximize returns while minimizing impermanent loss",
      category: "paid",
      type: "course",
      duration: "6 hours",
      price: "$67",
      icon: BookOpen
    },
    {
      id: 6,
      title: "Gas Fee Optimizer",
      description: "Time your transactions for optimal gas costs",
      category: "tool",
      type: "utility",
      duration: "Chrome Extension",
      icon: Code
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