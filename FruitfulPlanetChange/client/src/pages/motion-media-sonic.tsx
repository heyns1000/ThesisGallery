import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/queryClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Play, Pause, Upload, Download, Settings, Activity, Zap, Mic, Video, Music, Image, Film } from "lucide-react"

interface MediaProject {
  id: string
  name: string
  type: 'audio' | 'video' | 'motion' | 'sonic'
  status: 'draft' | 'processing' | 'completed' | 'published'
  progress: number
  description: string
  tags: string[]
  createdAt: string
  fileUrl?: string
}

interface ProcessingEngine {
  id: string
  name: string
  type: string
  status: 'active' | 'idle' | 'maintenance'
  usage: number
  lastActivity: string
}

export default function MotionMediaSonic() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedProject, setSelectedProject] = useState<MediaProject | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Fetch media projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<MediaProject[]>({
    queryKey: ['/api/media/projects'],
    retry: false,
  })

  // Fetch processing engines
  const { data: engines = [], isLoading: enginesLoading } = useQuery<ProcessingEngine[]>({
    queryKey: ['/api/media/engines'],
    retry: false,
  })

  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<MediaProject>) => {
      return await apiRequest('POST', '/api/media/projects', projectData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media/projects'] })
      toast({
        title: "Project Created",
        description: "Your media project has been created successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Process media mutation
  const processMediaMutation = useMutation({
    mutationFn: async ({ projectId, settings }: { projectId: string, settings: any }) => {
      return await apiRequest('POST', `/api/media/projects/${projectId}/process`, settings)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media/projects'] })
      toast({
        title: "Processing Started",
        description: "Your media is now being processed.",
      })
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
      toast({
        title: "File Selected",
        description: `Selected: ${file.name}`,
      })
    }
  }

  const createNewProject = (type: MediaProject['type']) => {
    if (!uploadFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload first.",
        variant: "destructive",
      })
      return
    }

    createProjectMutation.mutate({
      name: uploadFile.name,
      type,
      status: 'draft',
      progress: 0,
      description: `New ${type} project`,
      tags: [type, 'new'],
      createdAt: new Date().toISOString(),
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Music className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'motion': return <Film className="h-4 w-4" />
      case 'sonic': return <Mic className="h-4 w-4" />
      default: return <Image className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'published': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Motion, Media & Sonic Studio</h1>
          <p className="text-muted-foreground">Advanced media processing and sonic engineering platform</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500">
            <Activity className="h-3 w-3 mr-1" />
            Live Processing
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">
            <Zap className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="upload">Upload & Create</TabsTrigger>
          <TabsTrigger value="engines">Processing Engines</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
            ) : projects.length > 0 ? (
              projects.map((project: MediaProject) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedProject(project)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTypeIcon(project.type)}
                        {project.name}
                      </CardTitle>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">Start by uploading media files to create your first project</p>
                <Button onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Create New Project</CardTitle>
              <CardDescription>Upload media files and create new processing projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="file-upload">Select Media File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="audio/*,video/*,image/*"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                {uploadFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: 'audio' as const, icon: Music, title: 'Audio Project', desc: 'Process audio files, apply effects, and enhance sound quality' },
                  { type: 'video' as const, icon: Video, title: 'Video Project', desc: 'Edit videos, apply filters, and optimize for different platforms' },
                  { type: 'motion' as const, icon: Film, title: 'Motion Graphics', desc: 'Create animated graphics and motion design elements' },
                  { type: 'sonic' as const, icon: Mic, title: 'Sonic Engineering', desc: 'Advanced audio processing and sonic manipulation' }
                ].map(({ type, icon: Icon, title, desc }) => (
                  <Card key={type} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => createNewProject(type)}>
                    <CardContent className="p-4 text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engines" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'SonicCore™ Engine', type: 'Audio Processing', status: 'active', usage: 87 },
              { name: 'MotionFlow™ Renderer', type: 'Video Processing', status: 'active', usage: 62 },
              { name: 'MediaSync™ Processor', type: 'Multi-media', status: 'active', usage: 45 },
              { name: 'VoiceAI™ Enhancer', type: 'Voice Processing', status: 'idle', usage: 12 },
              { name: 'VideoAI™ Optimizer', type: 'Video AI', status: 'active', usage: 78 },
              { name: 'AudioMaster™ Suite', type: 'Audio Mastering', status: 'maintenance', usage: 0 }
            ].map((engine) => (
              <Card key={engine.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{engine.name}</CardTitle>
                    <Badge 
                      variant={engine.status === 'active' ? 'default' : engine.status === 'idle' ? 'secondary' : 'destructive'}
                    >
                      {engine.status}
                    </Badge>
                  </div>
                  <CardDescription>{engine.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usage</span>
                        <span>{engine.usage}%</span>
                      </div>
                      <Progress value={engine.usage} className="h-2" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Projects', value: '1,247', change: '+12%', icon: Film },
              { title: 'Processing Hours', value: '8,934', change: '+23%', icon: Activity },
              { title: 'Active Users', value: '156', change: '+8%', icon: Zap },
              { title: 'Files Processed', value: '4,521', change: '+15%', icon: Upload }
            ].map(({ title, value, change, icon: Icon }) => (
              <Card key={title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{title}</p>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-green-600">{change} from last month</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Processing Activity</CardTitle>
              <CardDescription>Real-time processing statistics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <Activity className="h-8 w-8 mr-2" />
                <span>Real-time processing chart would be rendered here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProject(null)}>
          <Card className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedProject.type)}
                  {selectedProject.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>×</Button>
              </div>
              <CardDescription>{selectedProject.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Status</Label>
                <Badge className={`${getStatusColor(selectedProject.status)} ml-2`}>{selectedProject.status}</Badge>
              </div>
              
              <div>
                <Label>Progress</Label>
                <div className="mt-2">
                  <Progress value={selectedProject.progress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">{selectedProject.progress}% complete</p>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProject.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={() => processMediaMutation.mutate({ projectId: selectedProject.id, settings: {} })}
                  disabled={processMediaMutation.isPending}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {processMediaMutation.isPending ? 'Processing...' : 'Start Processing'}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}