import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SamFoxStudio {
  id: string;
  brandName: string;
  treatyClass: string;
  licenseType: string;
  vaultLink: boolean;
  storagePath: string;
  syncRate: number;
  globalStatus: string;
  claimStatement: string;
  copyrightActive: boolean;
  treatyReady: boolean;
  signatory: string;
  createdAt: string;
  metadata?: any;
}

interface CollaborationWorkspace {
  id: string;
  workspaceName: string;
  workspaceType: string;
  accessLevel: string;
  members: string[];
  realTimeEnabled: boolean;
  treatyProtected: boolean;
  vaultMeshLinked: boolean;
  status: string;
  createdAt: string;
}

interface GlobalMasterLicense {
  id: string;
  licenseKey: string;
  licenseType: string;
  licenseMatrix: any;
  copyrightAssertion: boolean;
  ipRegistryVerified: boolean;
  faaVerified: boolean;
  treatyClass: string;
  globalScope: boolean;
  status: string;
  issuedAt: string;
}

interface TreatyCollaboration {
  id: string;
  treatyId: string;
  brandCoSigners: string[];
  collaboratorIds: string[];
  treatyType: string;
  sealedTreatyLaw: boolean;
  treatyMessage: string;
  faaClassTag: string;
  status: string;
  createdAt: string;
}

export default function SamFoxStudioPlatform() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [pulseInterval, setPulseInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch SamFox Studio instance
  const { data: studio, isLoading: studioLoading } = useQuery<SamFoxStudio>({
    queryKey: ["/api/samfox-studio"],
  });

  // Fetch workspaces
  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery<CollaborationWorkspace[]>({
    queryKey: ["/api/samfox-studio/workspaces"],
    enabled: !!studio?.id,
  });

  // Fetch licenses
  const { data: licenses = [], isLoading: licensesLoading } = useQuery<GlobalMasterLicense[]>({
    queryKey: ["/api/samfox-studio/licenses"],
    enabled: !!studio?.id,
  });

  // Fetch treaties
  const { data: treaties = [], isLoading: treatiesLoading } = useQuery<TreatyCollaboration[]>({
    queryKey: ["/api/samfox-studio/treaties"],
    enabled: !!studio?.id,
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["/api/samfox-studio", studio?.id, "stats"],
    enabled: !!studio?.id,
  });

  // Initialize SamFox Studio mutation
  const initializeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/samfox-studio/initialize", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samfox-studio"] });
      toast({ description: "SamFox Studio initialized successfully! ✨" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to initialize: ${error.message}` 
      });
    },
  });

  // Vault sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!studio?.id) throw new Error("Studio not found");
      return await apiRequest("POST", `/api/samfox-studio/${studio.id}/sync`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samfox-studio"] });
      toast({ description: "Vault sync completed successfully! 🔄" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Sync failed: ${error.message}` 
      });
    },
  });

  // 9-second pulse sync effect
  useEffect(() => {
    if (studio?.syncRate && studio.vaultLink) {
      const interval = setInterval(() => {
        if (studio.id) {
          // Silent sync in background
          syncMutation.mutate();
        }
      }, studio.syncRate * 1000);
      
      setPulseInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [studio]);

  if (studioLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading SamFox Studio Platform...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">🦁</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">SamFox Studio™</h2>
            <p className="text-muted-foreground mb-6">
              Global Master License | Copyright Protected | Treaty-Bound Collaboration
            </p>
          </div>
          
          <Card className="max-w-md mx-auto bg-gradient-to-br from-indigo-800 to-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-xl">🌍 Initialize SamFox Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-300 mb-4">
                One of a kind • Treaty-Bound • Global License
              </p>
              <Button 
                onClick={() => initializeMutation.mutate()}
                disabled={initializeMutation.isPending}
                className="w-full"
                data-testid="button-initialize-samfox"
              >
                {initializeMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Initializing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>
                    Initialize Platform
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Pulse Animation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                🦁
              </div>
              {studio.vaultLink && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{studio.brandName}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {studio.treatyClass}
                </Badge>
                <Badge variant={studio.copyrightActive ? "default" : "outline"} className="text-xs">
                  ✨ {studio.faaClassTag || "FAA-CLASS-BRND-321/SFS"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={studio.globalStatus === "Open for Business" ? "default" : "secondary"}>
              {studio.globalStatus}
            </Badge>
            <Button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              size="sm"
              data-testid="button-vault-sync"
            >
              {syncMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-sync mr-2"></i>
              )}
              Vault Sync
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground">{studio.claimStatement}</p>
        
        {/* Pulse Status */}
        <div className="mt-4 p-3 bg-card rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                Pulse Timer: {studio.syncRate}s | Vault Link: {studio.vaultLink ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Signatory: {studio.signatory}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="workspaces" data-testid="tab-workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="licenses" data-testid="tab-licenses">Licenses</TabsTrigger>
          <TabsTrigger value="treaties" data-testid="tab-treaties">Treaties</TabsTrigger>
          <TabsTrigger value="fileroom" data-testid="tab-fileroom">Fileroom</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalWorkspaces || 0}</div>
                <p className="text-xs text-muted-foreground">Active collaboration spaces</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Master Licenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalLicenses || 0}</div>
                <p className="text-xs text-muted-foreground">Global licensing agreements</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Treaty Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalFiles || 0}</div>
                <p className="text-xs text-muted-foreground">Protected documents</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Treaties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeTreaties || 0}</div>
                <p className="text-xs text-muted-foreground">Signed collaborations</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" data-testid="button-create-workspace">
                  <i className="fas fa-plus mr-2"></i>
                  Create Workspace
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-issue-license">
                  <i className="fas fa-certificate mr-2"></i>
                  Issue License
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-draft-treaty">
                  <i className="fas fa-handshake mr-2"></i>
                  Draft Treaty
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspaces Tab */}
        <TabsContent value="workspaces" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Collaboration Workspaces</h3>
            <Button data-testid="button-new-workspace">
              <i className="fas fa-plus mr-2"></i>
              New Workspace
            </Button>
          </div>
          
          {workspacesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <i className="fas fa-users text-muted-foreground text-4xl mb-4"></i>
                <h4 className="text-lg font-semibold mb-2">No Workspaces Yet</h4>
                <p className="text-muted-foreground mb-4">Create your first collaboration workspace</p>
                <Button data-testid="button-create-first-workspace">
                  <i className="fas fa-plus mr-2"></i>
                  Create Workspace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <Card key={workspace.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{workspace.workspaceName}</span>
                        {workspace.treatyProtected && (
                          <Badge variant="secondary" className="text-xs">Treaty Protected</Badge>
                        )}
                      </CardTitle>
                      <Badge variant={workspace.status === "active" ? "default" : "secondary"}>
                        {workspace.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{workspace.workspaceType}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Access:</span>
                        <div className="font-medium">{workspace.accessLevel}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Members:</span>
                        <div className="font-medium">{workspace.members?.length || 0}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Real-time:</span>
                        <div className="font-medium">{workspace.realTimeEnabled ? "Enabled" : "Disabled"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Global Master Licenses</h3>
            <Button data-testid="button-new-license">
              <i className="fas fa-certificate mr-2"></i>
              Issue License
            </Button>
          </div>
          
          {licensesLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {licenses.map((license) => (
                <Card key={license.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-mono">{license.licenseKey}</CardTitle>
                      <div className="flex space-x-2">
                        {license.faaVerified && (
                          <Badge variant="default" className="text-xs">FAA Verified</Badge>
                        )}
                        {license.copyrightAssertion && (
                          <Badge variant="secondary" className="text-xs">Copyright Active</Badge>
                        )}
                        <Badge variant={license.status === "active" ? "default" : "secondary"}>
                          {license.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{license.licenseType}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Treaty Class:</span>
                        <div className="font-medium">{license.treatyClass}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Global Scope:</span>
                        <div className="font-medium">{license.globalScope ? "Yes" : "No"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Issued:</span>
                        <div className="font-medium">{new Date(license.issuedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Treaties Tab */}
        <TabsContent value="treaties" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Treaty Collaborations</h3>
            <Button data-testid="button-new-treaty">
              <i className="fas fa-handshake mr-2"></i>
              Draft Treaty
            </Button>
          </div>
          
          {treatiesLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {treaties.map((treaty) => (
                <Card key={treaty.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{treaty.treatyId}</span>
                        {treaty.sealedTreatyLaw && (
                          <Badge variant="secondary" className="text-xs">Sealed Treaty Law</Badge>
                        )}
                      </CardTitle>
                      <Badge variant={treaty.status === "signed" ? "default" : "secondary"}>
                        {treaty.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-muted-foreground text-sm">Treaty Type:</span>
                        <div className="font-medium">{treaty.treatyType}</div>
                      </div>
                      {treaty.treatyMessage && (
                        <div>
                          <span className="text-muted-foreground text-sm">Message:</span>
                          <div className="font-medium">{treaty.treatyMessage}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Co-Signers:</span>
                          <div className="font-medium">{treaty.brandCoSigners?.length || 0}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Collaborators:</span>
                          <div className="font-medium">{treaty.collaboratorIds?.length || 0}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {treaty.faaClassTag}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Fileroom Tab */}
        <TabsContent value="fileroom" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">SamFox Fileroom</h3>
            <Button data-testid="button-upload-file">
              <i className="fas fa-upload mr-2"></i>
              Upload File
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-12 text-center">
              <i className="fas fa-archive text-muted-foreground text-4xl mb-4"></i>
              <h4 className="text-lg font-semibold mb-2">Master Fileroom</h4>
              <p className="text-muted-foreground mb-4">
                Archive Sync: FAA OmniDrop Memory Feed | Auto-filed since Genesis Treaty
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold">0</div>
                  <div className="text-muted-foreground">Project Scrolls</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">0</div>
                  <div className="text-muted-foreground">License Keys</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">0</div>
                  <div className="text-muted-foreground">Vault Trails</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">0</div>
                  <div className="text-muted-foreground">Creative Assets</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}