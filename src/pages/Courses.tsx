import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, LogIn } from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { BookOpen } from "lucide-react";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

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

  const handleStartCourse = (courseId: number) => {
    // Here you would navigate to the course detail page
    console.log(`Starting course ${courseId}`);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground">
              Courses & Tools
            </h1>
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="font-consciousness"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Track Progress
              </Button>
            )}
          </div>
          <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Reprogram your understanding with our curated learning resources and practical tools
          </p>
          {user && (
            <p className="text-awareness font-consciousness mt-2">
              Welcome back! Your progress is being tracked.
            </p>
          )}
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
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onStartCourse={handleStartCourse}
              onAuthRequired={handleAuthRequired}
            />
          ))}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Courses;