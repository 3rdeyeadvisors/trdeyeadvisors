/**
 * Example Course Page with SEO Automation
 * This demonstrates how to use the new SEO automation system for courses
 */

import { CourseSEOAutomation } from "@/components/SEOAutomation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, Star, Users, CheckCircle } from "lucide-react";

const ExampleAutomatedCourse = () => {
  // Course data - this would typically come from a database or API
  const course = {
    title: "Complete DeFi Mastery Course",
    description: "Master decentralized finance from beginner to advanced level. Learn yield farming, risk management, and portfolio optimization with hands-on projects and real-world strategies.",
    price: 97,
    level: "Beginner to Advanced",
    duration: "8 weeks",
    topics: ["yield farming", "liquidity pools", "risk assessment", "portfolio management", "smart contracts"],
    modules: [
      "DeFi Fundamentals",
      "Wallet Setup & Security", 
      "DEX Trading Strategies",
      "Yield Farming Techniques",
      "Risk Management",
      "Portfolio Optimization",
      "Advanced Protocols",
      "Real-World Applications"
    ],
    features: [
      "8 comprehensive modules",
      "25+ lessons", 
      "Hands-on projects",
      "Community access",
      "Certificate of completion",
      "Lifetime updates"
    ]
  };

  return (
    <>
      {/* SEO Automation - automatically handles Course schema and optimization */}
      <CourseSEOAutomation
        title={course.title}
        description={course.description}
        price={course.price}
        level={course.level}
        topics={course.topics}
      />

      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Course Header */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              {/* Only ONE H1 tag - automatically validated */}
              <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-6">
                {course.title}
              </h1>
              
              <p className="text-xl text-muted-foreground font-consciousness mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="default" className="px-4 py-2 bg-primary text-primary-foreground">
                  <Star className="w-4 h-4 mr-2" />
                  {course.level}
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {course.duration}
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  1,247 students
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-consciousness font-bold text-primary">
                  ${course.price}
                </span>
                <span className="text-muted-foreground line-through">$197</span>
                <Badge variant="secondary">50% Off</Badge>
              </div>

              <Button variant="default" size="lg" className="font-consciousness bg-primary hover:bg-primary/90">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Learning Now
              </Button>
            </div>

            <Card className="p-8 bg-gradient-consciousness border-primary/20">
              <h2 className="text-2xl font-consciousness font-bold text-foreground mb-6">
                What You'll Learn
              </h2>
              <div className="grid gap-4">
                {course.modules.map((module, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-consciousness text-foreground">
                      {module}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Course Features */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-consciousness font-bold text-foreground mb-6">
              Course Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-consciousness text-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* FAQ Section for additional schema */}
          <Card className="p-8">
            <h2 className="text-2xl font-consciousness font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-consciousness font-semibold text-foreground mb-2">
                  Is this course suitable for beginners?
                </h3>
                <p className="text-muted-foreground font-consciousness">
                  Yes! We start with the fundamentals and progressively build to advanced concepts. No prior DeFi experience required.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-consciousness font-semibold text-foreground mb-2">
                  How long do I have access to the course?
                </h3>
                <p className="text-muted-foreground font-consciousness">
                  You get lifetime access to all course materials, including future updates and new modules.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-consciousness font-semibold text-foreground mb-2">
                  Do you provide support during the course?
                </h3>
                <p className="text-muted-foreground font-consciousness">
                  Yes! You get access to our private community and direct support from our team.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ExampleAutomatedCourse;