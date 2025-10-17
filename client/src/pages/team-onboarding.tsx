import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Users, Star, CheckCircle, Clock, Upload, User, Briefcase, Mail, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { OptimizedImage } from "@/components/OptimizedImage";

// Professional portfolio image placeholders - using data URLs for demo
const portfolioImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZlYXR1cmVkIFByb2plY3Q8L3RleHQ+PC9zdmc+";
const aboutImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTZmM2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFib3V0IFdvcmtzcGFjZTwvdGV4dD48L3N2Zz4=";
const profileImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI2YwZjlmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9maWxlIFBob3RvPC90ZXh0Pjwvc3ZnPg==";

const teamOnboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  portfolioItems: z.string().optional(),
  socialLinks: z.string().optional(),
});

type TeamOnboardingForm = z.infer<typeof teamOnboardingSchema>;

export default function TeamOnboardingPage() {
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TeamOnboardingForm>({
    resolver: zodResolver(teamOnboardingSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      specialization: "",
      bio: "",
      experience: "",
      skills: "",
      portfolioItems: "",
      socialLinks: "",
    },
  });

  const onboardMutation = useMutation({
    mutationFn: async (data: TeamOnboardingForm & { 
      profileImage?: File; 
      aboutImage?: File; 
      projectImage?: File; 
    }) => {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profileImage' && key !== 'aboutImage' && key !== 'projectImage') {
          if (typeof value === 'string') {
            formData.append(key, value || "");
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        }
      });

      // Add image files
      if (data.profileImage) formData.append('profileImage', data.profileImage);
      if (data.aboutImage) formData.append('aboutImage', data.aboutImage);
      if (data.projectImage) formData.append('projectImage', data.projectImage);

      const response = await fetch('/api/team/onboard', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to onboard team member');
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Team Member Onboarded Successfully!",
        description: data.message || "Team member has been successfully onboarded",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      setOnboardingStep(5); // Show success step
    },
    onError: (error) => {
      toast({
        title: "Onboarding Failed",
        description: "There was an error onboarding the team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: TeamOnboardingForm) => {
    onboardMutation.mutate({
      ...data,
      profileImage: profileImageFile || undefined,
      aboutImage: aboutImageFile || undefined,
      projectImage: projectImageFile || undefined,
    });
  };

  const nextStep = () => {
    setOnboardingStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setOnboardingStep(prev => Math.max(prev - 1, 1));
  };

  const handleImageUpload = (file: File, type: 'profile' | 'about' | 'project') => {
    switch (type) {
      case 'profile':
        setProfileImageFile(file);
        break;
      case 'about':
        setAboutImageFile(file);
        break;
      case 'project':
        setProjectImageFile(file);
        break;
    }
  };

  const renderStepContent = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Fruitful Global</h2>
                <p className="text-gray-600 dark:text-gray-300">Your comprehensive business ecosystem integration platform</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Sacred Baobab™ Foundation
                  </CardTitle>
                  <CardDescription>
                    Spiritual cornerstone from Kruger National Park serving as our technical foundation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizedImage 
                    src={aboutImage} 
                    alt="Sacred Baobab Foundation" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    Our Ecosystem
                  </CardTitle>
                  <CardDescription>
                    188 FAA-Certified Core Scroll Brands with CodeNest™ Web Dev Studio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI & Logic Grid Systems</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global View GPT</span>
                    <Badge variant="secondary">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VaultMesh™ Diamond Tier</span>
                    <Badge variant="secondary">9s-sync</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={nextStep} className="px-8">
                Begin Onboarding Process
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Let's get to know you better</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" data-testid="label-name">Full Name</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    {...form.register("name")}
                    placeholder="Enter your full name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" data-testid="label-email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    data-testid="input-email"
                    {...form.register("email")}
                    placeholder="your.email@fruitfulglobal.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="role" data-testid="label-role">Role</Label>
                  <Input
                    id="role"
                    data-testid="input-role"
                    {...form.register("role")}
                    placeholder="e.g., Senior Developer, UI/UX Designer"
                  />
                  {form.formState.errors.role && (
                    <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department" data-testid="label-department">Department</Label>
                  <Select onValueChange={(value) => form.setValue("department", value)}>
                    <SelectTrigger data-testid="select-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-logic-grid">AI & Logic Grid Systems</SelectItem>
                      <SelectItem value="codenest">CodeNest™ Web Dev Studio</SelectItem>
                      <SelectItem value="vaultmesh">VaultMesh™ Operations</SelectItem>
                      <SelectItem value="global-view">Global View GPT</SelectItem>
                      <SelectItem value="wildlife-grid">Wildlife Grid Management</SelectItem>
                      <SelectItem value="education">Education Sector Intelligence</SelectItem>
                      <SelectItem value="housing">Housing Sector Intelligence</SelectItem>
                      <SelectItem value="america">Fruitful America™</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.department && (
                    <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="specialization" data-testid="label-specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    data-testid="input-specialization"
                    {...form.register("specialization")}
                    placeholder="e.g., React Development, Machine Learning"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" data-testid="label-experience">Experience Level</Label>
                  <Select onValueChange={(value) => form.setValue("experience", value)}>
                    <SelectTrigger data-testid="select-experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skills" data-testid="label-skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    data-testid="input-skills"
                    {...form.register("skills")}
                    placeholder="React, TypeScript, Node.js, Python"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" data-testid="label-bio">Bio</Label>
                  <Textarea
                    id="bio"
                    data-testid="textarea-bio"
                    {...form.register("bio")}
                    placeholder="Tell us about yourself and your passion for technology..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} data-testid="button-prev-step">
                Previous
              </Button>
              <Button onClick={nextStep} data-testid="button-next-step">
                Next: Portfolio Setup
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio & Images</h2>
              <p className="text-gray-600 dark:text-gray-300">Showcase your professional work</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Image
                  </CardTitle>
                  <CardDescription>Professional headshot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <OptimizedImage 
                      src={profileImageFile ? URL.createObjectURL(profileImageFile) : profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileImage" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Upload className="h-4 w-4" />
                        Upload New Image
                      </div>
                    </Label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-testid="input-profile-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'profile');
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    About Image
                  </CardTitle>
                  <CardDescription>Lifestyle or workspace photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <OptimizedImage 
                      src={aboutImageFile ? URL.createObjectURL(aboutImageFile) : aboutImage} 
                      alt="About" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aboutImage" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Upload className="h-4 w-4" />
                        Upload New Image
                      </div>
                    </Label>
                    <Input
                      id="aboutImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-testid="input-about-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'about');
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Project Image
                  </CardTitle>
                  <CardDescription>Featured work sample</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <OptimizedImage 
                      src={projectImageFile ? URL.createObjectURL(projectImageFile) : portfolioImage} 
                      alt="Project" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectImage" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Upload className="h-4 w-4" />
                        Upload New Image
                      </div>
                    </Label>
                    <Input
                      id="projectImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-testid="input-project-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'project');
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="portfolioItems" data-testid="label-portfolio">Portfolio Items (JSON format)</Label>
                <Textarea
                  id="portfolioItems"
                  data-testid="textarea-portfolio"
                  {...form.register("portfolioItems")}
                  placeholder='[{"title": "Project Name", "description": "Project description", "url": "https://example.com"}]'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="socialLinks" data-testid="label-social">Social Links (JSON format)</Label>
                <Textarea
                  id="socialLinks"
                  data-testid="textarea-social"
                  {...form.register("socialLinks")}
                  placeholder='{"linkedin": "https://linkedin.com/in/username", "github": "https://github.com/username"}'
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} data-testid="button-prev-step-2">
                Previous
              </Button>
              <Button onClick={nextStep} data-testid="button-next-step-2">
                Next: Review & Submit
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Confirm</h2>
              <p className="text-gray-600 dark:text-gray-300">Please review your information before submitting</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Member Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="text-lg">{form.watch("name")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-lg">{form.watch("email")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Role</Label>
                      <p className="text-lg">{form.watch("role")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Department</Label>
                      <p className="text-lg">{form.watch("department")}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <OptimizedImage 
                        src={profileImageFile ? URL.createObjectURL(profileImageFile) : profileImage} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {form.watch("bio") && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bio</Label>
                    <p>{form.watch("bio")}</p>
                  </div>
                )}

                {form.watch("skills") && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("skills")?.split(",").map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                By submitting this form, you agree to join the Fruitful Global team and follow our code of conduct.
              </p>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} data-testid="button-prev-step-3">
                  Previous
                </Button>
                <Button 
                  onClick={() => {
                    const formData = form.getValues();
                    handleSubmit(formData);
                  }} 
                  disabled={onboardMutation.isPending}
                  className="px-8"
                  data-testid="button-submit-onboarding"
                >
                  {onboardMutation.isPending ? "Processing..." : "Complete Onboarding"}
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to the Team!</h2>
              <p className="text-gray-600 dark:text-gray-300">Your onboarding has been completed successfully</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Profile Setup Complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>System Access Setup (Pending)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>Team Introduction (Pending)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>First Project Assignment (Pending)</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => window.location.href = '/advanced-payroll-dashboard'} 
              className="px-8"
              data-testid="button-goto-dashboard"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Onboarding</h1>
              <p className="text-gray-600 dark:text-gray-300">Fruitful Global Master Hub</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">Step {onboardingStep} of 5</p>
              <Progress value={(onboardingStep / 5) * 100} className="w-32" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= onboardingStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {step < onboardingStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div className={`w-20 h-1 mx-2 ${
                    step < onboardingStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}