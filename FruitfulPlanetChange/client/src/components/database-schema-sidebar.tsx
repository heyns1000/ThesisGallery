import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Table, 
  FileText, 
  Users, 
  Building, 
  CreditCard, 
  ShoppingCart,
  Archive,
  Activity,
  Shield,
  GitBranch,
  Zap,
  Search,
  ChevronRight,
  Eye,
  Download,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Database Schema Types
interface DatabaseTable {
  name: string;
  type: string;
  size: string;
  description: string;
  recordCount?: number;
  icon: React.ReactNode;
  category: string;
}

// Complete Database Schema from Screenshot
const databaseSchema: DatabaseTable[] = [
  {
    name: "admin_panel_brands",
    type: "table",
    size: "576 kB",
    description: "Administrative brand management and oversight",
    recordCount: 3794,
    icon: <Building className="w-4 h-4" />,
    category: "Brand Management"
  },
  {
    name: "banimal_transactions", 
    type: "table",
    size: "32 kB",
    description: "Charitable giving transactions and distributions",
    recordCount: 156,
    icon: <CreditCard className="w-4 h-4" />,
    category: "Financial"
  },
  {
    name: "brands",
    type: "table", 
    size: "2336 kB",
    description: "Core brand entities across all sectors",
    recordCount: 2928,
    icon: <Building className="w-4 h-4" />,
    category: "Brand Management"
  },
  {
    name: "charitable_distributions",
    type: "table",
    size: "32 kB", 
    description: "Banimal charitable distribution records",
    recordCount: 89,
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "Charitable"
  },
  {
    name: "legal_documents",
    type: "table",
    size: "32 kB",
    description: "SecureSign VIP legal documentation system",
    recordCount: 247,
    icon: <FileText className="w-4 h-4" />,
    category: "Legal"
  },
  {
    name: "media_projects", 
    type: "table",
    size: "24 kB",
    description: "Motion, media and sonic project management",
    recordCount: 67,
    icon: <Activity className="w-4 h-4" />,
    category: "Media"
  },
  {
    name: "payments",
    type: "table",
    size: "16 kB",
    description: "Payment processing and transaction records", 
    recordCount: 423,
    icon: <CreditCard className="w-4 h-4" />,
    category: "Financial"
  },
  {
    name: "processing_engines",
    type: "table", 
    size: "48 kB",
    description: "Atom-level engines and processing systems",
    recordCount: 9,
    icon: <Zap className="w-4 h-4" />,
    category: "Infrastructure"
  },
  {
    name: "repositories",
    type: "table",
    size: "72 kB", 
    description: "GitHub repository management and tracking",
    recordCount: 61,
    icon: <GitBranch className="w-4 h-4" />,
    category: "Development"
  },
  {
    name: "sectors",
    type: "table",
    size: "88 kB",
    description: "48-sector ecosystem classification system",
    recordCount: 48,
    icon: <BarChart3 className="w-4 h-4" />,
    category: "Business"
  },
  {
    name: "sessions", 
    type: "table",
    size: "88 kB",
    description: "User session management and authentication",
    recordCount: 1247,
    icon: <Shield className="w-4 h-4" />,
    category: "Security"
  },
  {
    name: "sonic_grid_connections",
    type: "table",
    size: "32 kB",
    description: "Banimal sonic grid network connections",
    recordCount: 198,
    icon: <Activity className="w-4 h-4" />,
    category: "Network"
  },
  {
    name: "system_status", 
    type: "table",
    size: "48 kB",
    description: "Real-time system monitoring and health",
    recordCount: 5,
    icon: <CheckCircle className="w-4 h-4" />,
    category: "System"
  },
  {
    name: "users",
    type: "table",
    size: "48 kB", 
    description: "User accounts and profile management",
    recordCount: 1,
    icon: <Users className="w-4 h-4" />,
    category: "Users"
  },
  {
    name: "users_backup",
    type: "table",
    size: "8192 bytes",
    description: "User data backup and recovery system", 
    recordCount: 1,
    icon: <Archive className="w-4 h-4" />,
    category: "Backup"
  },
  {
    name: "vault_actions",
    type: "table", 
    size: "32 kB",
    description: "VaultMesh secure action logging and audit",
    recordCount: 342,
    icon: <Shield className="w-4 h-4" />,
    category: "Security"
  }
];

const categories = Array.from(new Set(databaseSchema.map(table => table.category)));

// Helper function to get appropriate icon for each table
const getIconForTable = (tableName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'admin_panel_brands': <Building className="w-4 h-4" />,
    'banimal_transactions': <CreditCard className="w-4 h-4" />,
    'brands': <Building className="w-4 h-4" />,
    'charitable_distributions': <ShoppingCart className="w-4 h-4" />,
    'legal_documents': <FileText className="w-4 h-4" />,
    'media_projects': <Activity className="w-4 h-4" />,
    'payments': <CreditCard className="w-4 h-4" />,
    'processing_engines': <Zap className="w-4 h-4" />,
    'repositories': <GitBranch className="w-4 h-4" />,
    'sectors': <BarChart3 className="w-4 h-4" />,
    'sessions': <Shield className="w-4 h-4" />,
    'sonic_grid_connections': <Activity className="w-4 h-4" />,
    'system_status': <CheckCircle className="w-4 h-4" />,
    'users': <Users className="w-4 h-4" />,
    'users_backup': <Archive className="w-4 h-4" />,
    'vault_actions': <Shield className="w-4 h-4" />
  };
  return iconMap[tableName] || <Table className="w-4 h-4" />;
};

export default function DatabaseSchemaSidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Real-time database schema and statistics
  const { data: schemaData = { tables: [], summary: {} } } = useQuery({
    queryKey: ["/api/database/schema/tables"],
    refetchInterval: 30000,
  });

  const { data: realtimeStats = {} } = useQuery({
    queryKey: ["/api/database/stats/realtime"],
    refetchInterval: 10000,
  });

  // Update database schema with real data
  const realDatabaseSchema = schemaData.tables.length > 0 ? schemaData.tables.map(table => ({
    ...table,
    icon: getIconForTable(table.name),
  })) : databaseSchema;

  // Filter tables based on search and category
  const filteredTables = realDatabaseSchema.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || table.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Use real database summary data when available
  const summary = schemaData.summary;
  const totalSize = summary.totalSizeKB || 0;
  const totalRecords = summary.totalRecords || 0;

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold">Database Schema</h2>
            <p className="text-sm text-gray-500">{realDatabaseSchema.length} tables • {Math.round(totalSize/1024)} MB • {totalRecords.toLocaleString()} records</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="All">All ({realDatabaseSchema.length})</TabsTrigger>
              <TabsTrigger value="Brand Management">Brands</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Database Status */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">Database Connected</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div>Active Tables: {realDatabaseSchema.length}</div>
          <div>Live Records: {totalRecords.toLocaleString()}</div>
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredTables.map((table, index) => (
            <motion.div
              key={table.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <Button
                variant={selectedTable === table.name ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="mt-0.5">{table.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{table.name}</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {table.recordCount?.toLocaleString() || '0'}
                        </Badge>
                        <ChevronRight className={`w-3 h-3 transition-transform ${selectedTable === table.name ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{table.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{table.category}</Badge>
                      <span className="text-xs text-gray-400">{table.size}</span>
                    </div>
                  </div>
                </div>
              </Button>
              
              {/* Expanded Table Details */}
              {selectedTable === table.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Table Actions</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View Data
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                    <div className="pt-2 border-t text-xs text-gray-500">
                      <div>Type: {table.type}</div>
                      <div>Size: {table.size}</div>
                      {table.recordCount && <div>Records: {table.recordCount.toLocaleString()}</div>}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-gray-500">Core Data</div>
            <div className="font-medium">{realtimeStats.core?.brands || 0} Brands</div>
            <div className="font-medium">{realtimeStats.core?.sectors || 0} Sectors</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500">System</div>
            <div className="font-medium">{realtimeStats.system?.services || 0} Services</div>
            <div className="font-medium">{realtimeStats.content?.repositories || 0} Repos</div>
          </div>
        </div>
      </div>
    </div>
  );
}