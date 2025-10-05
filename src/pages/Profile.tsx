import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Trophy,
  BookOpen,
  Brain,
  TrendingUp,
  Shield,
  Settings,
  Camera,
  Upload,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  quizzesPassed: number;
  averageScore: number;
  totalLearningTime: number;
  joinDate: string;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    quizzesPassed: 0,
    averageScore: 0,
    totalLearningTime: 0,
    joinDate: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    bio: "",
    avatar_url: ""
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Load user profile and stats
  useEffect(() => {
    if (user) {
      loadProfile();
      loadUserStats();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setEditForm({
          display_name: data.display_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || ""
        });
      } else {
        // Create profile if it doesn't exist
        await createProfile();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          display_name: user.email?.split('@')[0] || 'User',
          bio: null,
          avatar_url: null
        }])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setEditForm({
        display_name: data.display_name || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || ""
      });
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Load course progress
      const { data: courseProgress, error: courseError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (courseError) throw courseError;

      // Load quiz attempts
      const { data: quizAttempts, error: quizError } = await supabase
        .from('quiz_attempts')
        .select('score, passed')
        .eq('user_id', user.id);

      if (quizError) throw quizError;

      const coursesEnrolled = courseProgress?.length || 0;
      const coursesCompleted = courseProgress?.filter(p => p.completion_percentage === 100).length || 0;
      const quizzesPassed = quizAttempts?.filter(q => q.passed).length || 0;
      const averageScore = quizAttempts?.length 
        ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
        : 0;

      setUserStats({
        coursesEnrolled,
        coursesCompleted,
        quizzesPassed,
        averageScore,
        totalLearningTime: coursesCompleted * 120, // Mock calculation: 2 hours per course
        joinDate: user.created_at
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, WebP, or GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Delete old avatar if it exists and is from our storage
      if (profile?.avatar_url && profile.avatar_url.includes('supabase.co/storage')) {
        const oldPath = profile.avatar_url.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data);
      setEditForm(prev => ({ ...prev, avatar_url: publicUrl }));
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name || null,
          bio: editForm.bio || null,
          avatar_url: editForm.avatar_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (userStats.coursesCompleted >= 1) {
      achievements.push({
        title: "First Course Complete",
        description: "Completed your first course",
        icon: Trophy,
        color: "text-yellow-600"
      });
    }
    
    if (userStats.quizzesPassed >= 5) {
      achievements.push({
        title: "Quiz Master",
        description: "Passed 5 quizzes",
        icon: Brain,
        color: "text-purple-600"
      });
    }
    
    if (userStats.averageScore >= 90) {
      achievements.push({
        title: "High Achiever",
        description: "Average quiz score above 90%",
        icon: TrendingUp,
        color: "text-green-600"
      });
    }
    
    if (userStats.coursesCompleted >= 4) {
      achievements.push({
        title: "DeFi Master",
        description: "Completed all courses",
        icon: Shield,
        color: "text-blue-600"
      });
    }

    return achievements;
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const achievements = getAchievements();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-consciousness">
                    {(profile?.display_name || user.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Upload new avatar"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="display_name">Display Name</Label>
                          <Input
                            id="display_name"
                            value={editForm.display_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                            placeholder="Your display name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="avatar_url">Avatar URL</Label>
                          <Input
                            id="avatar_url"
                            value={editForm.avatar_url}
                            onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-consciousness font-bold text-foreground mb-2">
                          {profile?.display_name || user.email?.split('@')[0] || 'User'}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {profile?.bio && (
                          <p className="text-muted-foreground mb-4">{profile.bio}</p>
                        )}
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Edit Controls */}
                  <div className="flex gap-2 justify-center sm:self-start">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          size="sm"
                        >
                          <Save className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              display_name: profile?.display_name || "",
                              bio: profile?.bio || "",
                              avatar_url: profile?.avatar_url || ""
                            });
                          }}
                          size="sm"
                        >
                          <X className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Cancel</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        size="sm"
                      >
                        <Edit className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit Profile</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{userStats.coursesEnrolled}</p>
            <p className="text-sm text-muted-foreground">Courses Enrolled</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Trophy className="w-8 h-8 text-awareness mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{userStats.coursesCompleted}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{userStats.quizzesPassed}</p>
            <p className="text-sm text-muted-foreground">Quizzes Passed</p>
          </Card>
          
          <Card className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{userStats.averageScore}%</p>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              Your learning milestones and accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                    <div>
                      <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No achievements yet. Start completing courses to earn your first badge!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => navigate("/dashboard")}
              >
                <User className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
              
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => navigate("/tutorials")}
              >
                <Brain className="w-4 h-4 mr-2" />
                Tutorials
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;