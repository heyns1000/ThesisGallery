import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInteractivity } from "@/lib/useInteractivity";
import { 
  Trophy, Users, Calendar, MapPin, Star, Music, Award, 
  TrendingUp, Heart, Target, Zap, Sparkles, Crown, Globe,
  Plus, UserPlus, Clock, CheckCircle, AlertCircle, PlayCircle
} from "lucide-react";

const CrateDanceAfrica = () => {
  const { trigger } = useInteractivity();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  // Live platform data
  const platformStats = {
    totalEvents: 24,
    activeContestants: 1847,
    registrationsThisMonth: 312,
    upcomingAuditions: 8,
    qualifiedDancers: 156,
    provinces: 9,
    danceStyles: 12,
    totalPrizeMoney: "R850,000"
  };

  const upcomingEvents = [
    {
      id: "cd-limpopo-2025",
      name: "Limpopo Provincial Championship",
      location: "Polokwane, Limpopo",
      date: "2025-09-15",
      type: "championship",
      status: "registration-open",
      participants: 89,
      maxParticipants: 150,
      prizeMoney: "R75,000",
      sponsors: ["King Price", "Fruitful Holdings", "Local Municipality"],
      categories: ["Junior", "Teen", "Adult", "Open"],
      danceStyles: ["Hip-Hop", "Contemporary", "Traditional", "Freestyle"]
    },
    {
      id: "cd-gauteng-audition",
      name: "Gauteng Regional Auditions",
      location: "Johannesburg, Gauteng",
      date: "2025-09-22",
      type: "audition",
      status: "upcoming",
      participants: 245,
      maxParticipants: 300,
      prizeMoney: "R50,000",
      sponsors: ["King Price", "Fruitful Global"],
      categories: ["Teen", "Adult"],
      danceStyles: ["Hip-Hop", "Freestyle", "Contemporary"]
    },
    {
      id: "cd-kzn-showcase",
      name: "KwaZulu-Natal Cultural Showcase",
      location: "Durban, KZN",
      date: "2025-10-05",
      type: "showcase",
      status: "planning",
      participants: 67,
      maxParticipants: 200,
      prizeMoney: "R45,000",
      sponsors: ["Traditional Council", "Fruitful Cultural Fund"],
      categories: ["All Ages"],
      danceStyles: ["Traditional", "Fusion", "Contemporary"]
    }
  ];

  const topContestants = [
    {
      id: "ct-001",
      name: "Thabo Mthembu",
      province: "KZN",
      danceStyle: "Hip-Hop",
      averageScore: 8.9,
      competitions: 5,
      status: "qualified",
      achievements: ["2024 Regional Winner", "Best Technique Award"]
    },
    {
      id: "ct-002", 
      name: "Nomsa Dlamini",
      province: "Gauteng",
      danceStyle: "Contemporary",
      averageScore: 9.2,
      competitions: 7,
      status: "champion",
      achievements: ["2024 National Champion", "People's Choice Award"]
    },
    {
      id: "ct-003",
      name: "Sipho Ngcobo", 
      province: "Limpopo",
      danceStyle: "Traditional",
      averageScore: 8.7,
      competitions: 4,
      status: "qualified",
      achievements: ["Cultural Heritage Award", "Community Choice"]
    }
  ];

  const recentActivity = [
    { type: "registration", message: "125 new registrations for Limpopo Championship", time: "2 hours ago" },
    { type: "audition", message: "Gauteng Regional Auditions - 89% completion rate", time: "4 hours ago" },
    { type: "winner", message: "Nomsa Dlamini advanced to National Finals", time: "6 hours ago" },
    { type: "event", message: "KZN Cultural Showcase venue confirmed", time: "1 day ago" },
    { type: "sponsor", message: "King Price renewed Tier-1 sponsorship", time: "2 days ago" }
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "registration-open": return <PlayCircle className="h-4 w-4 text-green-500" />;
      case "upcoming": return <Clock className="h-4 w-4 text-blue-500" />;
      case "in-progress": return <Zap className="h-4 w-4 text-yellow-500" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Music className="h-10 w-10" />
                Crate Dance™ Africa
              </h1>
              <p className="text-lg opacity-90 mt-2">
                Experience the Rhythm, Embrace the Culture, Dance Your Way to Stardom!
              </p>
              <div className="flex items-center gap-6 mt-3 text-sm">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  fruitfulcratedance.com
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {platformStats.activeContestants.toLocaleString()} Active Contestants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {platformStats.totalEvents} Events This Year
                </span>
              </div>
            </div>
            <div className="text-right">
              <Button 
                className="bg-white text-orange-600 hover:bg-gray-100"
                size="lg"
                onClick={() => setRegistrationOpen(true)}
                data-testid="button-register-now"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                  <p className="text-3xl font-bold text-orange-600">{platformStats.totalEvents}</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Contestants</p>
                  <p className="text-3xl font-bold text-blue-600">{platformStats.activeContestants.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registrations This Month</p>
                  <p className="text-3xl font-bold text-green-600">{platformStats.registrationsThisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Prize Money</p>
                  <p className="text-3xl font-bold text-purple-600">{platformStats.totalPrizeMoney}</p>
                </div>
                <Crown className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="contestants">Top Contestants</TabsTrigger>
            <TabsTrigger value="judges">Judge Panel</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Upcoming Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {event.name}
                          <StatusIcon status={event.status} />
                          <Badge variant={event.status === "registration-open" ? "default" : "secondary"}>
                            {event.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            {event.prizeMoney}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedEvent(event.id)}
                        data-testid={`button-view-event-${event.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Registration Progress</span>
                          <span>{event.participants}/{event.maxParticipants}</span>
                        </div>
                        <Progress value={(event.participants / event.maxParticipants) * 100} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Categories</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Dance Styles</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.danceStyles.map((style) => (
                              <Badge key={style} variant="outline" className="text-xs">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Sponsors</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.sponsors.map((sponsor) => (
                            <Badge key={sponsor} className="text-xs bg-gradient-to-r from-orange-500 to-red-500">
                              {sponsor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Contestants Tab */}
          <TabsContent value="contestants" className="space-y-6">
            <div className="grid gap-4">
              {topContestants.map((contestant, index) => (
                <Card key={contestant.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{contestant.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{contestant.province}</span>
                            <span>{contestant.danceStyle}</span>
                            <span>{contestant.competitions} competitions</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-2xl font-bold">{contestant.averageScore}</span>
                          <span className="text-sm text-gray-500">/10</span>
                        </div>
                        <Badge 
                          variant={contestant.status === "champion" ? "default" : "secondary"}
                          className={contestant.status === "champion" ? "bg-yellow-500" : ""}
                        >
                          {contestant.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {contestant.achievements.map((achievement, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="judges">
            <Card>
              <CardHeader>
                <CardTitle>Expert Judge Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Our expert judges bring decades of experience in dance, choreography, and performance arts.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors">
            <Card>
              <CardHeader>
                <CardTitle>Our Sponsors & Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Proud partnerships with leading brands supporting South African dance talent.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive performance metrics and competition insights.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity Feed */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "registration" && <UserPlus className="h-4 w-4 text-green-500" />}
                    {activity.type === "audition" && <PlayCircle className="h-4 w-4 text-blue-500" />}
                    {activity.type === "winner" && <Trophy className="h-4 w-4 text-yellow-500" />}
                    {activity.type === "event" && <Calendar className="h-4 w-4 text-purple-500" />}
                    {activity.type === "sponsor" && <Heart className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Modal */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register for Crate Dance™ Africa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" data-testid="input-first-name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" data-testid="input-last-name" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" data-testid="input-email" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province">Province</Label>
                <Select>
                  <SelectTrigger data-testid="select-province">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gauteng">Gauteng</SelectItem>
                    <SelectItem value="kzn">KwaZulu-Natal</SelectItem>
                    <SelectItem value="limpopo">Limpopo</SelectItem>
                    <SelectItem value="western-cape">Western Cape</SelectItem>
                    <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                    <SelectItem value="northern-cape">Northern Cape</SelectItem>
                    <SelectItem value="free-state">Free State</SelectItem>
                    <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                    <SelectItem value="north-west">North West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="danceStyle">Preferred Dance Style</Label>
                <Select>
                  <SelectTrigger data-testid="select-dance-style">
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="freestyle">Freestyle</SelectItem>
                    <SelectItem value="fusion">Fusion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="goals">Your Goals & Aspirations</Label>
              <Textarea 
                id="goals" 
                placeholder="Tell us about your dance goals and what you hope to achieve..."
                data-testid="textarea-goals"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500" 
                onClick={() => trigger('Crate Dance Africa registration submitted!')}
                data-testid="button-submit-registration"
              >
                Submit Registration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrateDanceAfrica;