import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/components/progress/ProgressProvider";
import { getCourseContent } from "@/data/courseContent";
import {
  Search,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  FileText,
  Video,
  Brain,
  Filter,
  List,
  Grid3X3,
  ChevronDown,
  Target
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedModuleNavigationProps {
  courseId: number;
  currentModuleId?: string;
  onModuleSelect?: (moduleId: string) => void;
  showProgress?: boolean;
  compact?: boolean;
}

export const EnhancedModuleNavigation = ({
  courseId,
  currentModuleId,
  onModuleSelect,
  showProgress = true,
  compact = false
}: EnhancedModuleNavigationProps) => {
  const navigate = useNavigate();
  const { getCourseProgress } = useProgress();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'video' | 'interactive'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showIncomplete, setShowIncomplete] = useState(true);

  const course = getCourseContent(courseId);
  const progress = getCourseProgress(courseId);

  if (!course) return null;

  const isModuleCompleted = (moduleIndex: number) => {
    return progress?.completed_modules?.includes(moduleIndex) || false;
  };

  const getModuleProgress = (moduleIndex: number) => {
    // Mock individual module progress - in a real app, this would come from detailed tracking
    if (isModuleCompleted(moduleIndex)) return 100;
    if (currentModuleId === course.modules[moduleIndex].id) return 45; // Current module
    return 0;
  };

  const filteredModules = course.modules.filter((module, index) => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || module.type === filterType;
    const isCompleted = isModuleCompleted(index);
    const matchesCompletion = (showCompleted && isCompleted) || (showIncomplete && !isCompleted);
    
    return matchesSearch && matchesType && matchesCompletion;
  });

  const handleModuleClick = (moduleId: string) => {
    if (onModuleSelect) {
      onModuleSelect(moduleId);
    } else {
      navigate(`/courses/${courseId}/module/${moduleId}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'interactive': return Brain;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-600 bg-red-50 border-red-200';
      case 'text': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'interactive': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const courseStats = {
    totalModules: course.modules.length,
    completedModules: course.modules.filter((_, index) => isModuleCompleted(index)).length,
    totalDuration: course.modules.reduce((sum, module) => sum + module.duration, 0),
    completedDuration: course.modules
      .filter((_, index) => isModuleCompleted(index))
      .reduce((sum, module) => sum + module.duration, 0)
  };

  const overallProgress = courseStats.totalModules > 0 
    ? (courseStats.completedModules / courseStats.totalModules) * 100 
    : 0;

  if (compact) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {course.modules.map((module, index) => {
            const isCompleted = isModuleCompleted(index);
            const isCurrent = module.id === currentModuleId;
            const Icon = getTypeIcon(module.type);
            
            return (
              <Button
                key={module.id}
                variant={isCurrent ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isCompleted ? "border-green-500 bg-green-50 hover:bg-green-100" : ""
                }`}
                onClick={() => handleModuleClick(module.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                        <span className="text-xs">{index + 1}</span>
                      </div>
                    )}
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{module.title}</p>
                    <p className="text-xs text-muted-foreground">{module.duration} min</p>
                  </div>
                  {isCurrent && <Play className="w-4 h-4 text-primary" />}
                </div>
              </Button>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-consciousness font-semibold mb-2">Course Navigation</h3>
        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{courseStats.completedModules} of {courseStats.totalModules} modules completed</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <p className="text-lg font-bold">{Math.round(overallProgress)}%</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-lg font-bold">{courseStats.completedModules}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Time Left</span>
          </div>
          <p className="text-lg font-bold">{courseStats.totalDuration - courseStats.completedDuration}m</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-lg font-bold">{courseStats.totalModules}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('text')}>
                Text Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('video')}>
                Video Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('interactive')}>
                Interactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Module List/Grid */}
      <div className={`space-y-3 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0' : ''}`}>
        {filteredModules.map((module, originalIndex) => {
          const moduleIndex = course.modules.findIndex(m => m.id === module.id);
          const isCompleted = isModuleCompleted(moduleIndex);
          const isCurrent = module.id === currentModuleId;
          const moduleProgress = getModuleProgress(moduleIndex);
          const Icon = getTypeIcon(module.type);
          
          return (
            <Card
              key={module.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isCurrent ? "border-primary bg-primary/5" : ""
              } ${isCompleted ? "border-green-500 bg-green-50" : ""}`}
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="flex items-center justify-center mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{moduleIndex + 1}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getTypeColor(module.type)}>
                        <Icon className="w-3 h-3 mr-1" />
                        {module.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {module.duration}m
                      </div>
                    </div>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {module.title}
                  </h4>

                  {/* Progress Bar */}
                  {moduleProgress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{moduleProgress}%</span>
                      </div>
                      <Progress value={moduleProgress} className="h-1.5" />
                    </div>
                  )}
                </div>

                {/* Action Icon */}
                <div className="flex items-center justify-center mt-1">
                  {isCompleted ? (
                    <Badge variant="outline" className="text-xs bg-green-100 border-green-300 text-green-700">
                      Done
                    </Badge>
                  ) : isCurrent ? (
                    <Play className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No modules match your search criteria.</p>
        </div>
      )}
    </Card>
  );
};