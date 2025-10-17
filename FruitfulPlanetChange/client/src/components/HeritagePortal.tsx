import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, History } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface HeritagePortalProps {
  newFamilyMember: {
    name: string;
    relationship: string;
    birthDate: string;
    location: string;
  };
  setNewFamilyMember: (member: any) => void;
  newEvent: {
    title: string;
    date: string;
    description: string;
    type: string;
  };
  setNewEvent: (event: any) => void;
  toast: any;
  queryClient: any;
}

export default function HeritagePortal({ 
  newFamilyMember, 
  setNewFamilyMember, 
  newEvent, 
  setNewEvent, 
  toast, 
  queryClient 
}: HeritagePortalProps) {
  // Heritage API queries
  const { data: familyMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ['/api/heritage/family-members'],
    queryFn: () => apiRequest('GET', '/api/heritage/family-members'),
  });

  const { data: heritageMetrics = {}, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/heritage/metrics'],
    queryFn: () => apiRequest('GET', '/api/heritage/metrics'),
  });

  const { data: familyEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/heritage/events'],
    queryFn: () => apiRequest('GET', '/api/heritage/events'),
  });

  // Heritage mutations
  const addFamilyMemberMutation = useMutation({
    mutationFn: (memberData) => apiRequest('POST', '/api/heritage/family-members', memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/heritage/family-members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/heritage/metrics'] });
      setNewFamilyMember({ name: '', relationship: '', birthDate: '', location: '' });
      toast({ title: "Success", description: "Family member added successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add family member. Please try again.", variant: "destructive" });
    },
  });

  const addEventMutation = useMutation({
    mutationFn: (eventData) => apiRequest('POST', '/api/heritage/events', eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/heritage/events'] });
      setNewEvent({ title: '', date: '', description: '', type: '' });
      toast({ title: "Success", description: "Family event added successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add family event. Please try again.", variant: "destructive" });
    },
  });

  const handleAddFamilyMember = () => {
    if (!newFamilyMember.name || !newFamilyMember.relationship) {
      toast({ title: "Error", description: "Please fill in name and relationship fields.", variant: "destructive" });
      return;
    }
    addFamilyMemberMutation.mutate(newFamilyMember);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({ title: "Error", description: "Please fill in title and date fields.", variant: "destructive" });
      return;
    }
    addEventMutation.mutate(newEvent);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <span className="text-4xl">👤</span>
          AncestorTag™ Heritage Portal
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
          Experience AncestorTag: Linking Generations in the Digital Cosmos. Seamlessly connect your invaluable cultural content to its ancestral lineage, providing irrefutable digital provenance and enriching history for eons to come.
        </p>
        <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-bold">
          ➕ Tag New Ancestral Content
        </Button>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Live Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Dashboard Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span>Total Tags:</span>
                    <span className="font-bold">{heritageMetrics.totalTags || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Unique Ancestors:</span>
                    <span className="font-bold">{heritageMetrics.uniqueAncestors || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Documents Tagged:</span>
                    <span className="font-bold">{heritageMetrics.documentsTagged || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Oral Histories:</span>
                    <span className="font-bold">{heritageMetrics.oralHistories || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rituals Tagged:</span>
                    <span className="font-bold">{heritageMetrics.ritualsTagged || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Artifacts Preserved:</span>
                    <span className="font-bold">{heritageMetrics.artifactsPreserved || 0}</span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Family Tree Management */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Family Tree Management 🌳</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Family Member</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., John Doe" 
                      value={newFamilyMember.name}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Relationship</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Father, Sister" 
                      value={newFamilyMember.relationship}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, relationship: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <input 
                      type="date" 
                      value={newFamilyMember.birthDate}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, birthDate: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g., London, UK" 
                      value={newFamilyMember.location}
                      onChange={(e) => setNewFamilyMember({...newFamilyMember, location: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <Button 
                    onClick={handleAddFamilyMember}
                    disabled={addFamilyMemberMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {addFamilyMemberMutation.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Family Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {membersLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : familyMembers.length > 0 ? (
                      familyMembers.map((member) => (
                        <div key={member.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {member.relationship} • Born: {member.birthDate ? new Date(member.birthDate).getFullYear() : 'Unknown'} • {member.location || 'Location unknown'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No family members added yet.</p>
                        <p className="text-sm">Add your first family member to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Family Events */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Family Events 📅</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Wedding Anniversary" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input 
                      type="date" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      placeholder="Event details..." 
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Type</label>
                    <select 
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    >
                      <option value="">Select type...</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="wedding">Wedding</option>
                      <option value="graduation">Graduation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Button 
                    onClick={handleAddEvent}
                    disabled={addEventMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {addEventMutation.isPending ? "Adding..." : "Add Event"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Family Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {eventsLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : familyEvents.length > 0 ? (
                      familyEvents.map((event) => (
                        <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString()} • {event.type || 'Event'}
                          </div>
                          {event.description && (
                            <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No family events recorded yet.</p>
                        <p className="text-sm">Add your first family event to start building your timeline!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Digital Provenance Features */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Shield className="w-5 h-5" />
                AncestorTag™ Digital Provenance
              </CardTitle>
              <CardDescription>
                Blockchain-secured heritage preservation with irrefutable digital provenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="text-3xl mb-3">🔗</div>
                  <h4 className="font-semibold mb-2">Blockchain Security</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Every family artifact and document is secured with blockchain technology for permanent preservation
                  </p>
                </div>
                <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="text-3xl mb-3">🌍</div>
                  <h4 className="font-semibold mb-2">Global Heritage Network</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Connect with other families worldwide and discover shared ancestry through our heritage network
                  </p>
                </div>
                <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="text-3xl mb-3">⏰</div>
                  <h4 className="font-semibold mb-2">Eternal Preservation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your family legacy is preserved for future generations with atomic-level digital provenance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}