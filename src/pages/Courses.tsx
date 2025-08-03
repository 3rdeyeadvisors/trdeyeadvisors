import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, LogIn, Search, Star } from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { BookOpen } from "lucide-react";
import SEO from "@/components/SEO";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "DeFi Foundations: Understanding the New Financial System",
      description: "Complete beginner's guide from zero knowledge to confident understanding. Learn what DeFi is, why it exists, and how it works in plain English.",
      category: "free",
      type: "course",
      duration: "5 modules",
      difficulty: "Beginner",
      rating: 4.8,
      students: 1234,
      modules: [
        "What is DeFi? (Simple explanation with comparisons to traditional banking)",
        "Why DeFi Exists (The problems it solves – fees, middlemen, accessibility)",
        "The Blockchain Basics You Actually Need to Know (No tech overload)",
        "The Key Players (Stablecoins, DEXs, lending protocols – explained simply)",
        "Risks and Myths (Separating facts from hype)"
      ],
      icon: BookOpen,
      offers: [],
      hasCourseInstance: true
    },
    {
      id: 2,
      title: "Staying Safe in DeFi: Wallets, Security, and Avoiding Scams",
      description: "Essential security course for beginners worried about hacks or losing funds. Learn to set up wallets correctly and keep funds safe.",
      category: "free",
      type: "course", 
      duration: "5 modules",
      difficulty: "Beginner",
      rating: 4.9,
      students: 987,
      modules: [
        "Choosing the Right Wallet (MetaMask, Trust Wallet, or Ledger?)",
        "Private Keys & Seed Phrases – The Rule You Can't Break",
        "Spotting Scams and Fake Projects Before You Click",
        "Safe Transactions – Sending, Receiving, and Testing Small First",
        "The Beginner's Checklist for DeFi Security"
      ],
      icon: BookOpen,
      offers: [],
      hasCourseInstance: true
    },
    {
      id: 3,
      title: "Earning with DeFi: Staking, Yield Farming, and Liquidity Pools Made Simple",
      description: "Ready to earn passive income? Understand different earning methods and choose what fits your risk level.",
      category: "paid",
      type: "course",
      duration: "5 modules",
      difficulty: "Intermediate",
      rating: 4.7,
      students: 756,
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
      difficulty: "Advanced",
      rating: 4.6,
      students: 543,
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
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" }
  ];

  const getFilteredCourses = () => {
    let filtered = courses;
    
    // Filter by category or difficulty
    if (activeFilter !== "all") {
      if (["free", "paid", "tool"].includes(activeFilter)) {
        filtered = filtered.filter(course => course.category === activeFilter);
      } else {
        filtered = filtered.filter(course => 
          course.difficulty?.toLowerCase() === activeFilter
        );
      }
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  const handleStartCourse = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <SEO 
        title="DeFi Courses & Cryptocurrency Education - Learn Blockchain Investing"
        description="Comprehensive DeFi courses from beginner to advanced. Learn yield farming, staking, DeFi protocols, and passive income strategies. Free and paid courses available for cryptocurrency education."
        keywords="DeFi courses, cryptocurrency education, blockchain courses, yield farming course, DeFi beginner guide, crypto passive income, DeFi training, blockchain investing course"
        url="https://the3rdeyeadvisors.com/courses"
        schema={{
          type: 'Course',
          data: {
            provider: {
              "@type": "Organization",
              name: "3rdeyeadvisors",
              url: "https://the3rdeyeadvisors.com"
            },
            educationalLevel: "Beginner to Advanced",
            teaches: [
              "Decentralized Finance (DeFi)",
              "Yield Farming Strategies",
              "Cryptocurrency Investing",
              "Blockchain Technology",
              "Financial Independence"
            ],
            offers: {
              price: "0",
              priceCurrency: "USD"
            },
            hasCourseInstance: true,
            coursePrerequisites: "No prior experience required",
            timeRequired: "2-8 hours per course"
          }
        }}
        faq={[
          {
            question: "What DeFi courses do you offer?",
            answer: "We offer comprehensive DeFi courses ranging from beginner foundations to advanced protocol analysis. Topics include yield farming, staking, portfolio management, risk assessment, and safe DeFi practices."
          },
          {
            question: "Are your cryptocurrency courses suitable for beginners?",
            answer: "Yes! Our courses start with the absolute basics of blockchain and cryptocurrency, requiring no prior knowledge. We guide you step-by-step from understanding what DeFi is to implementing advanced strategies."
          },
          {
            question: "How can I earn passive income through DeFi?",
            answer: "Our courses teach multiple DeFi passive income strategies including yield farming (5-50% APY), liquidity providing, staking rewards, and DeFi lending protocols. Learn to safely navigate opportunities while managing risks."
          },
          {
            question: "Do you offer free DeFi education?",
            answer: "Yes, we provide free foundational courses covering DeFi basics, wallet setup, and essential security practices. Premium courses dive deeper into advanced strategies and portfolio management techniques."
          }
        ]}
      />
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

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-consciousness"
            />
          </div>
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
        {filteredCourses.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-consciousness font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground font-consciousness mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="font-consciousness"
            >
              Clear filters
            </Button>
          </div>
        )}
        </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      </div>
    </>
  );
};

export default Courses;