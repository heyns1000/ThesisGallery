import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Github, 
  RefreshCw, 
  Download, 
  Eye, 
  Star, 
  GitFork, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
  Folder,
  Code
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  owner: string;
  language: string;
  starCount: number;
  forkCount: number;
  topics: string[];
  lastSyncAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha?: string;
  children?: FileTreeItem[];
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
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

interface RepositoryStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
}

export default function GitHubRepositoryBrowser() {
  const [activeTab, setActiveTab] = useState("repositories");
  const [selectedRepo, setSelectedRepo] = useState<{ owner: string; repo: string } | null>(null);
  const [showFileTreeModal, setShowFileTreeModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch repositories from database
  const { data: dbRepositories = [], isLoading: isLoadingDb } = useQuery<Repository[]>({
    queryKey: ["/api/github/repositories"],
  });

  // Fetch repository stats
  const { data: stats } = useQuery<RepositoryStats>({
    queryKey: ["/api/github/repository-stats"],
  });

  // Fetch sync logs
  const { data: syncLogs = [] } = useQuery<SyncLog[]>({
    queryKey: ["/api/github/sync-logs"],
  });

  // Fetch file tree for selected repository
  const { data: fileTreeData, isLoading: isLoadingFileTree } = useQuery({
    queryKey: ["/api/github/repositories", selectedRepo?.owner, selectedRepo?.repo, "file-tree"],
    queryFn: async () => {
      if (!selectedRepo) return null;
      const response = await fetch(
        `/api/github/repositories/${selectedRepo.owner}/${selectedRepo.repo}/file-tree`
      );
      return response.json();
    },
    enabled: !!selectedRepo && showFileTreeModal,
  });

  // Refresh all repositories mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/github/repositories/refresh", {
        method: "POST",
        body: JSON.stringify({ username: "heyns1000" }),
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/github/repositories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/github/repository-stats"] });
      toast({
        title: "✅ Repositories Refreshed",
        description: `Successfully refreshed ${data.count} repositories from GitHub`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Refresh Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Clone repository mutation
  const cloneMutation = useMutation({
    mutationFn: async ({ owner, repo }: { owner: string; repo: string }) => {
      return await apiRequest(`/api/github/repositories/${owner}/${repo}/clone`, {
        method: "POST",
      });
    },
    onSuccess: (data: any, variables) => {
      toast({
        title: "✅ Repository Cloned",
        description: `${variables.owner}/${variables.repo} cloned to ${data.path}`,
      });
    },
    onError: (error: Error, variables) => {
      toast({
        title: "❌ Clone Failed",
        description: `Failed to clone ${variables.owner}/${variables.repo}: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Sync repository mutation
  const syncMutation = useMutation({
    mutationFn: async ({ owner, repo }: { owner: string; repo: string }) => {
      return await apiRequest("/api/github/sync", {
        method: "POST",
        body: JSON.stringify({ owner, repo }),
      });
    },
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/github/repositories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/github/sync-logs"] });
      toast({
        title: "✅ Repository Synced",
        description: `${variables.owner}/${variables.repo} synced successfully`,
      });
    },
    onError: (error: Error, variables) => {
      toast({
        title: "❌ Sync Failed",
        description: `Failed to sync ${variables.owner}/${variables.repo}: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleViewFiles = (repo: Repository) => {
    setSelectedRepo({ owner: repo.owner, repo: repo.name });
    setShowFileTreeModal(true);
  };

  const handleClone = (repo: Repository) => {
    cloneMutation.mutate({ owner: repo.owner, repo: repo.name });
  };

  const handleSync = (repo: Repository) => {
    syncMutation.mutate({ owner: repo.owner, repo: repo.name });
  };

  const getStatusBadge = (repo: Repository) => {
    if (syncMutation.isPending) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Syncing
        </Badge>
      );
    }
    if (repo.isActive) {
      return (
        <Badge variant="default" className="bg-green-600 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const renderFileTree = (items: FileTreeItem[], level = 0) => {
    if (!items || items.length === 0) return null;

    return (
      <div className={`space-y-1 ${level > 0 ? 'ml-4 border-l pl-2' : ''}`}>
        {items.map((item, index) => (
          <div key={`${item.path}-${index}`}>
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-accent rounded text-sm">
              {item.type === 'dir' ? (
                <Folder className="h-4 w-4 text-blue-500" />
              ) : (
                <FileCode className="h-4 w-4 text-gray-500" />
              )}
              <span className="flex-1">{item.name}</span>
              {item.size && (
                <span className="text-xs text-muted-foreground">
                  {(item.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
            {item.children && item.children.length > 0 && renderFileTree(item.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Github className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold" data-testid="heading-github-browser">
                GitHub Repository Browser
              </h1>
              <p className="text-muted-foreground">
                Sacred Baobab™ Security Network + File Management System
              </p>
            </div>
          </div>
          <Button
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            size="lg"
            data-testid="button-refresh-all"
            className="gap-2"
          >
            {refreshMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Refresh All
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-repo-count">
                {stats?.totalRepos || dbRepositories.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                {stats?.totalStars || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                <GitFork className="h-6 w-6 text-blue-500" />
                {stats?.totalForks || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.languages ? Object.keys(stats.languages).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="repositories" data-testid="tab-repositories">
            <Code className="h-4 w-4 mr-2" />
            Repositories
          </TabsTrigger>
          <TabsTrigger value="file-browser" data-testid="tab-file-browser">
            <Folder className="h-4 w-4 mr-2" />
            File Browser
          </TabsTrigger>
          <TabsTrigger value="sync-logs" data-testid="tab-sync-logs">
            <Clock className="h-4 w-4 mr-2" />
            Sync Logs
          </TabsTrigger>
        </TabsList>

        {/* Repositories Tab */}
        <TabsContent value="repositories">
          {isLoadingDb ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbRepositories.map((repo) => (
                <Card key={repo.id} className="hover:shadow-lg transition-shadow" data-testid={`card-repo-${repo.name}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          <a
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-2"
                          >
                            <Github className="h-5 w-5" />
                            {repo.name}
                          </a>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {repo.description || "No description available"}
                        </CardDescription>
                      </div>
                      {getStatusBadge(repo)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Language and Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {repo.language && (
                          <Badge variant="outline">{repo.language}</Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {repo.starCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          {repo.forkCount}
                        </div>
                      </div>

                      {/* Last Sync */}
                      {repo.lastSyncAt && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Last synced {formatDistanceToNow(new Date(repo.lastSyncAt))} ago
                        </div>
                      )}

                      {/* Topics */}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {repo.topics.slice(0, 3).map((topic, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFiles(repo)}
                          className="flex-1 gap-1"
                          data-testid={`button-view-${repo.name}`}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClone(repo)}
                          disabled={cloneMutation.isPending}
                          className="flex-1 gap-1"
                          data-testid={`button-clone-${repo.name}`}
                        >
                          {cloneMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Clone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(repo)}
                          disabled={syncMutation.isPending}
                          className="flex-1 gap-1"
                          data-testid={`button-sync-${repo.name}`}
                        >
                          {syncMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Sync
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* File Browser Tab */}
        <TabsContent value="file-browser">
          <Card>
            <CardHeader>
              <CardTitle>File Browser</CardTitle>
              <CardDescription>
                Select a repository from the Repositories tab and click "View" to browse its files
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="sync-logs">
          <Card>
            <CardHeader>
              <CardTitle>Sync Operation Logs</CardTitle>
              <CardDescription>Track all repository synchronization operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No sync operations yet. Click "Sync" on any repository to start.
                  </p>
                ) : (
                  syncLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`log-entry-${log.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{log.syncType} sync</span>
                          <Badge
                            variant={
                              log.status === "success"
                                ? "default"
                                : log.status === "error"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {log.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>
                            Processed: {log.filesProcessed} | Added: {log.filesAdded} | Updated:{" "}
                            {log.filesUpdated}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(log.startedAt))} ago
                          </div>
                        </div>
                        {log.errorMessage && (
                          <div className="text-sm text-destructive mt-1">{log.errorMessage}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* File Tree Modal */}
      <Dialog open={showFileTreeModal} onOpenChange={setShowFileTreeModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              {selectedRepo?.owner}/{selectedRepo?.repo}
            </DialogTitle>
            <DialogDescription>Browse repository files and structure</DialogDescription>
          </DialogHeader>
          {isLoadingFileTree ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : fileTreeData?.tree ? (
            <div className="mt-4">{renderFileTree(fileTreeData.tree)}</div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No files found</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
