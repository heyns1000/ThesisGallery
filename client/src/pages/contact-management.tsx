import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Database, 
  Users, 
  FileSpreadsheet, 
  BarChart3, 
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Contact {
  id: string;
  faaId: string;
  source: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  country?: string;
  city?: string;
  industry?: string;
  leadScore: number;
  status: string;
  createdAt: string;
}

interface DataImport {
  id: string;
  fileName: string;
  fileSize: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  duplicateRecords: number;
  status: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export default function ContactManagementPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contacts with filters
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts', searchTerm, statusFilter, sourceFilter],
    queryFn: () => apiRequest(`/api/contacts?search=${searchTerm}&status=${statusFilter}&source=${sourceFilter}`),
  });

  // Fetch data imports
  const { data: dataImports = [], isLoading: importsLoading } = useQuery({
    queryKey: ['/api/data-imports'],
    queryFn: () => apiRequest('/api/data-imports'),
  });

  // Upload and process file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "File Upload Started",
        description: `Processing ${data.totalRecords} records from ${data.fileName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-imports'] });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate FAA reference for new contact
  const generateFaaReference = (baseString: string): string => {
    const timestamp = Date.now().toString();
    const hash = btoa(baseString + timestamp).slice(0, 12).toUpperCase();
    return `FAA${hash}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.ms-excel' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload Excel (.xlsx, .xls) or CSV files only.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'unsubscribed':
        return <Badge variant="destructive">Unsubscribed</Badge>;
      case 'bounced':
        return <Badge variant="outline">Bounced</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
          <p className="text-gray-600 dark:text-gray-300">FAA™ Contact Processing & CRM System</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Contacts</p>
            <p className="text-2xl font-bold">{contacts.length.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Data Upload</TabsTrigger>
          <TabsTrigger value="contacts">Contact Database</TabsTrigger>
          <TabsTrigger value="imports">Import History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Contact Data
              </CardTitle>
              <CardDescription>
                Upload Excel files with 11+ million contacts. System handles unstructured data automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="fileUpload" className="cursor-pointer text-lg font-medium">
                        Choose Excel or CSV File
                      </Label>
                      <Input
                        id="fileUpload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        className="hidden"
                        data-testid="input-file-upload"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Supports .xlsx, .xls, and .csv files up to 500MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Processing Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span>FAA™ Unique Reference Generation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <span>Automatic Data Deduplication</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-purple-500" />
                      <span>Flexible Schema Mapping</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                      <span>Lead Scoring & Classification</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <Card className="bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleUpload} 
                        disabled={uploadMutation.isPending}
                        data-testid="button-upload-file"
                      >
                        {uploadMutation.isPending ? "Processing..." : "Upload & Process"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Contact Database
              </CardTitle>
              <CardDescription>
                Search and manage your contact database with advanced filtering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search contacts by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-contacts"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-32" data-testid="select-source-filter">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="excel1">Excel Import 1</SelectItem>
                    <SelectItem value="excel2">Excel Import 2</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Lead Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>FAA ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading contacts...
                        </TableCell>
                      </TableRow>
                    ) : contacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No contacts found. Upload data to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      contacts.slice(0, 50).map((contact: Contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {contact.fullName || `${contact.firstName} ${contact.lastName}`.trim()}
                              </p>
                              {contact.email && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Phone className="h-3 w-3" />
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {contact.company && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  <span className="text-sm">{contact.company}</span>
                                </div>
                              )}
                              {contact.position && (
                                <p className="text-sm text-gray-600">{contact.position}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Globe className="h-3 w-3" />
                              {contact.city && contact.country 
                                ? `${contact.city}, ${contact.country}`
                                : contact.country || contact.city || "N/A"
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${contact.leadScore}%` }}
                                />
                              </div>
                              <span className="text-sm">{contact.leadScore}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(contact.status)}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {contact.faaId}
                            </code>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {contacts.length > 50 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Showing first 50 of {contacts.length.toLocaleString()} contacts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Import History
              </CardTitle>
              <CardDescription>
                Track all data import operations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importsLoading ? (
                  <div className="text-center py-8">Loading import history...</div>
                ) : dataImports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p>No data imports yet. Upload your first file to get started.</p>
                  </div>
                ) : (
                  dataImports.map((importData: DataImport) => (
                    <Card key={importData.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(importData.status)}
                            <div>
                              <h3 className="font-medium">{importData.fileName}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {formatFileSize(importData.fileSize)} • {importData.totalRecords.toLocaleString()} records
                              </p>
                            </div>
                          </div>
                          <Badge variant={importData.status === 'completed' ? 'default' : 
                                        importData.status === 'processing' ? 'secondary' : 'destructive'}>
                            {importData.status}
                          </Badge>
                        </div>

                        {importData.status === 'processing' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Processing Progress</span>
                              <span>{importData.processedRecords.toLocaleString()} / {importData.totalRecords.toLocaleString()}</span>
                            </div>
                            <Progress 
                              value={(importData.processedRecords / importData.totalRecords) * 100} 
                              className="w-full"
                            />
                          </div>
                        )}

                        {importData.status === 'completed' && (
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-600">{importData.successfulRecords.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Successful</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-red-600">{importData.failedRecords.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Failed</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-yellow-600">{importData.duplicateRecords.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Duplicates</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-blue-600">
                                {((importData.successfulRecords / importData.totalRecords) * 100).toFixed(1)}%
                              </p>
                              <p className="text-sm text-gray-600">Success Rate</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                          <span>Started: {new Date(importData.createdAt).toLocaleString()}</span>
                          {importData.completedAt && (
                            <span>Completed: {new Date(importData.completedAt).toLocaleString()}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{contacts.length.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Contacts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Database className="h-8 w-8 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{dataImports.length}</p>
                <p className="text-sm text-gray-600">Data Sources</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                <p className="text-2xl font-bold">
                  {contacts.filter((c: Contact) => c.status === 'active').length.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Active Contacts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                <p className="text-2xl font-bold">
                  {contacts.length > 0 ? 
                    Math.round(contacts.reduce((sum: number, c: Contact) => sum + c.leadScore, 0) / contacts.length) 
                    : 0}
                </p>
                <p className="text-sm text-gray-600">Avg Lead Score</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Distribution by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['active', 'inactive', 'unsubscribed', 'bounced'].map((status) => {
                  const count = contacts.filter((c: Contact) => c.status === status).length;
                  const percentage = contacts.length > 0 ? (count / contacts.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium capitalize">{status}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'active' ? 'bg-green-500' :
                              status === 'inactive' ? 'bg-gray-500' :
                              status === 'unsubscribed' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-sm text-right">
                        {count.toLocaleString()} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}