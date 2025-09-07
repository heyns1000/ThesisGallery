import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Github, 
  File, 
  Folder, 
  Download, 
  Search, 
  RefreshCw, 
  Eye, 
  Clock,
  Star,
  GitFork,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Code,
  Video,
  Image,
  Database
} from "lucide-react";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  owner: string;
  isPrivate: boolean;
  defaultBranch: string;
  language: string;
  starCount: number;
  forkCount: number;
  topics: string[];
  lastSyncAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RepositoryFile {
  id: string;
  repositoryId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  content: string;
  rawUrl: string;
  htmlUrl: string;
  sha: string;
  encoding: string;
  isRenderable: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface SyncLog {
  id: string;
  repositoryId: string;
  syncType: string;
  status: string;
  filesProcessed: number;
  filesAdded: number;
  filesUpdated: number;
  filesDeleted: number;
  errorMessage: string;
  startedAt: string;
  completedAt: string;
}

export default function GitHubRepositoryBrowser() {
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [selectedFile, setSelectedFile] = useState<RepositoryFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch repositories
  const { data: repositories = [], isLoading: repositoriesLoading } = useQuery({
    queryKey: ['/api/github/repositories'],
    refetchInterval: 10000
  });

  // Fetch files for selected repository
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ['/api/github/repositories', selectedRepository?.id, 'files'],
    enabled: !!selectedRepository?.id
  });

  // Fetch sync logs
  const { data: syncLogs = [] } = useQuery({
    queryKey: ['/api/github/sync-logs'],
    refetchInterval: 5000
  });

  // Sync Baobab repository mutation
  const syncBaobabMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/github/sync-baobab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync repository');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Sync Complete!",
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['/api/github/repositories'] });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Sync Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter files based on search and type
  const filteredFiles = files.filter((file: RepositoryFile) => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.filePath.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || file.fileType === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  // Get unique file types for filter
  const fileTypes = [...new Set(files.map((file: RepositoryFile) => file.fileType))];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'html':
      case 'markdown':
        return <FileText className="h-4 w-4" />;
      case 'javascript':
      case 'typescript':
      case 'python':
        return <Code className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900" data-testid="github-repository-browser">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center">
          <Github className="h-12 w-12 mr-4" />
          GitHub Repository Browser
        </h1>
        <p className="mt-2 text-lg md:text-xl text-blue-200">
          Sacred Baobab™ Security Network • File Management System
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            <Database className="h-3 w-3 mr-1" />
            Database Integrated
          </Badge>
          <Badge variant="secondary" className="bg-green-600 text-white">
            <RefreshCw className="h-3 w-3 mr-1" />
            Auto-Sync Enabled
          </Badge>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="repositories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="files">File Browser</TabsTrigger>
            <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
          </TabsList>

          {/* Repositories Tab */}
          <TabsContent value="repositories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Github className="h-5 w-5 mr-2" />
                    GitHub Repositories
                  </span>
                  <Button 
                    onClick={() => syncBaobabMutation.mutate()}
                    disabled={syncBaobabMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncBaobabMutation.isPending ? 'animate-spin' : ''}`} />
                    {syncBaobabMutation.isPending ? 'Syncing...' : 'Sync Baobab™'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {repositoriesLoading ? (
                  <div className="text-center py-8">Loading repositories...</div>
                ) : repositories.length === 0 ? (
                  <div className="text-center py-8">
                    <Github className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No repositories synced yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click "Sync Baobab™" to import your repository.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {repositories.map((repo: Repository) => (
                      <Card 
                        key={repo.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedRepository?.id === repo.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => setSelectedRepository(repo)}
                        data-testid={`repository-card-${repo.name}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg">{repo.name}</h3>
                              <p className="text-sm text-muted-foreground">{repo.fullName}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                              {repo.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {repo.description || 'No description available'}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {repo.starCount}
                            </span>
                            <span className="flex items-center">
                              <GitFork className="h-3 w-3 mr-1" />
                              {repo.forkCount}
                            </span>
                            {repo.language && (
                              <Badge variant="secondary" className="text-xs">
                                {repo.language}
                              </Badge>
                            )}
                          </div>

                          {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {repo.topics.slice(0, 3).map((topic) => (
                                <Badge key={topic} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {repo.topics.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{repo.topics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            Last synced: {repo.lastSyncAt ? formatDate(repo.lastSyncAt) : 'Never'}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            {!selectedRepository ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a repository to browse files</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* File Browser Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Folder className="h-5 w-5 mr-2" />
                      {selectedRepository.name} Files
                    </CardTitle>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Search files..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <select
                        value={fileTypeFilter}
                        onChange={(e) => setFileTypeFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="all">All Types</option>
                        {fileTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardHeader>
                </Card>

                {/* File List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* File List Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Files ({filteredFiles.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filesLoading ? (
                        <div className="text-center py-8">Loading files...</div>
                      ) : filteredFiles.length === 0 ? (
                        <div className="text-center py-8">
                          <File className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No files found</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {filteredFiles.map((file: RepositoryFile) => (
                            <div
                              key={file.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                selectedFile?.id === file.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : ''
                              }`}
                              onClick={() => setSelectedFile(file)}
                              data-testid={`file-item-${file.fileName}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getFileIcon(file.fileType)}
                                  <span className="font-medium text-sm">{file.fileName}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {file.fileType}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {file.filePath} • {formatFileSize(file.fileSize)}
                              </div>
                              {file.tags && file.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {file.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* File Content Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Eye className="h-5 w-5 mr-2" />
                          File Preview
                        </span>
                        {selectedFile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedFile.htmlUrl, '_blank')}
                          >
                            <Github className="h-4 w-4 mr-2" />
                            View on GitHub
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!selectedFile ? (
                        <div className="text-center py-12">
                          <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Select a file to preview</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h4 className="font-medium">{selectedFile.fileName}</h4>
                            <p className="text-sm text-muted-foreground">{selectedFile.filePath}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>Size: {formatFileSize(selectedFile.fileSize)}</span>
                              <span>Type: {selectedFile.fileType}</span>
                              <span>Updated: {formatDate(selectedFile.updatedAt)}</span>
                            </div>
                          </div>

                          {selectedFile.isRenderable && selectedFile.content ? (
                            <div className="border rounded-lg p-4 bg-white dark:bg-slate-900">
                              <div className="mb-2 text-sm text-muted-foreground">File Content:</div>
                              <pre className="text-xs whitespace-pre-wrap max-h-96 overflow-y-auto bg-slate-50 dark:bg-slate-800 p-3 rounded">
                                {selectedFile.content}
                              </pre>
                            </div>
                          ) : (
                            <div className="text-center py-8 border rounded-lg">
                              <File className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Preview not available</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedFile.fileType === 'video' ? 'Video files' : 
                                 selectedFile.fileType === 'image' ? 'Image files' : 
                                 'Binary files'} cannot be previewed
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Sync Logs Tab */}
          <TabsContent value="sync-logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Synchronization Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {syncLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No sync logs available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {syncLogs.map((log: SyncLog) => (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.status)}
                            <span className="font-medium">
                              {log.syncType.charAt(0).toUpperCase() + log.syncType.slice(1)} Sync
                            </span>
                            <Badge variant="outline">{log.status}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(log.startedAt)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Processed:</span>
                            <p className="font-medium">{log.filesProcessed}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Added:</span>
                            <p className="font-medium text-green-600">{log.filesAdded}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Updated:</span>
                            <p className="font-medium text-blue-600">{log.filesUpdated}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deleted:</span>
                            <p className="font-medium text-red-600">{log.filesDeleted}</p>
                          </div>
                        </div>

                        {log.errorMessage && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600">
                            Error: {log.errorMessage}
                          </div>
                        )}

                        {log.completedAt && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Completed: {formatDate(log.completedAt)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}