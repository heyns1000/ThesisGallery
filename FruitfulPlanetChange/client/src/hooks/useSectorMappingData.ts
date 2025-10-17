import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Core interfaces for sector mapping data
interface SectorNode {
  id: number;
  name: string;
  emoji: string;
  tier: string;
  connections: number;
  x: number;
  y: number;
  color: string;
  metadata?: any;
  dependencyCount: number;
  dependentCount: number;
}

interface SectorRelationship {
  id?: string;
  sourceId: number;
  targetId: number;
  strength: number;
  type: 'integration' | 'synergy' | 'dependency' | 'collaboration';
  description: string;
  bidirectional?: boolean;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface NetworkStats {
  totalConnections: number;
  avgConnections: number;
  networkDensity: number;
  maxConnections: number;
  isolatedNodes: number;
  lastCalculated: string;
}

interface RelationshipMatrix {
  [sourceId: string]: {
    [targetId: string]: {
      strength: number;
      type: string;
      bidirectional: boolean;
    }
  }
}

// Primary data management hook for sector mapping system
export function useSectorMappingData() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [localRelationships, setLocalRelationships] = useState<SectorRelationship[]>([]);
  const [localNodes, setLocalNodes] = useState<SectorNode[]>([]);

  // Fetch sectors data with caching
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery({
    queryKey: ['/api/sectors'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch existing relationships from backend
  const { data: backendRelationships = [], isLoading: relationshipsLoading } = useQuery({
    queryKey: ['/api/sector-mapping/relationships'],
    enabled: isInitialized,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  // Initialize sector nodes from sectors data
  useEffect(() => {
    if (sectors.length > 0 && !isInitialized) {
      initializeSectorMapping();
    }
  }, [sectors, isInitialized]);

  // Sync with backend relationships
  useEffect(() => {
    if (backendRelationships.length > 0) {
      setLocalRelationships(backendRelationships);
    }
  }, [backendRelationships]);

  const initializeSectorMapping = useCallback(async () => {
    try {
      // Convert sectors to nodes with intelligent positioning
      const nodes: SectorNode[] = sectors.map((sector: any, index: number) => {
        const angle = (index * 2 * Math.PI) / sectors.length;
        const radius = 250;
        const centerX = 400;
        const centerY = 300;

        return {
          id: sector.id,
          name: sector.name,
          emoji: sector.emoji,
          tier: getTierFromPricing(sector.metadata?.pricing?.monthly || 79.99),
          connections: 0, // Will be calculated after relationships are generated
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          color: getNodeColorFromTier(sector.name),
          metadata: sector.metadata,
          dependencyCount: 0,
          dependentCount: 0
        };
      });

      setLocalNodes(nodes);

      // Generate intelligent relationships if none exist
      if (backendRelationships.length === 0) {
        await generateIntelligentRelationships(nodes);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize sector mapping:', error);
    }
  }, [sectors, backendRelationships]);

  // Generate relationships based on sector intelligence
  const generateIntelligentRelationships = useCallback(async (nodes: SectorNode[]) => {
    const relationships: SectorRelationship[] = [];
    
    // Sector synergy mappings based on real business logic
    const sectorSynergies = {
      'Creative Tech': ['Motion, Media & Sonic', 'Gaming & Simulation', 'Marketing & Branding', 'Fashion & Identity'],
      'Agriculture & Biotech': ['Food, Soil & Farming', 'Sustainability & Impact', 'Health & Hygiene', 'Nutrition & Food Chain'],
      'Banking & Finance': ['Mining & Resources', 'Professional Services', 'Tech Infrastructure', 'Payroll Mining & Accounting'],
      'Logistics & Packaging': ['Trade Systems', 'Micro-Mesh Logistics', 'Packaging & Materials', 'Logistics & Operations'],
      'AI, Logic & Grid': ['Tech Infrastructure', 'Gaming & Simulation', 'Creative Tech', 'Analytics & Insights'],
      'Mining & Resources': ['Banking & Finance', 'Utilities & Energy', 'Tech Infrastructure', 'Sustainability & Impact'],
      'Motion, Media & Sonic': ['Creative Tech', 'Marketing & Branding', 'Content Creation', 'Voice & Audio'],
      'Health & Hygiene': ['Agriculture & Biotech', 'Food, Soil & Farming', 'Professional Services', 'Education & Youth']
    };

    // Generate relationships based on synergies
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sourceNode = nodes[i];
        const targetNode = nodes[j];
        
        const sourceName = sourceNode.name.replace(/[🎬🌱🏦📦🖋️✂🎮🧠🏗️⚖📖☰🎙️✿🧠📦✴️☯🔑🧺🔋🎬📡🔁🎓♻️🧾🪙⛏️🦁⚙️]/g, '').trim();
        const targetName = targetNode.name.replace(/[🎬🌱🏦📦🖋️✂🎮🧠🏗️⚖📖☰🎙️✿🧠📦✴️☯🔑🧺🔋🎬📡🔁🎓♻️🧾🪙⛏️🦁⚙️]/g, '').trim();

        let strength = 0;
        let relationshipType: SectorRelationship['type'] = 'collaboration';
        
        // Check for direct synergies
        if (sectorSynergies[sourceName]?.includes(targetName) || 
            sectorSynergies[targetName]?.includes(sourceName)) {
          strength = 0.7 + Math.random() * 0.3;
          relationshipType = 'synergy';
        }
        // Tier-based relationships
        else if (sourceNode.tier === targetNode.tier) {
          strength = 0.4 + Math.random() * 0.3;
          relationshipType = 'collaboration';
        }
        // Cross-tier dependencies
        else if ((sourceNode.tier === 'Enterprise' && targetNode.tier === 'Infrastructure') ||
                 (sourceNode.tier === 'Infrastructure' && targetNode.tier === 'Professional')) {
          strength = 0.5 + Math.random() * 0.2;
          relationshipType = 'dependency';
        }
        // Random weak connections
        else if (Math.random() > 0.7) {
          strength = 0.2 + Math.random() * 0.3;
          relationshipType = 'integration';
        }

        if (strength > 0.2) {
          relationships.push({
            sourceId: sourceNode.id,
            targetId: targetNode.id,
            strength: Math.round(strength * 100) / 100,
            type: relationshipType,
            description: generateRelationshipDescription(sourceNode, targetNode, relationshipType),
            bidirectional: strength > 0.6,
            weight: Math.floor(strength * 10),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    // Update connection counts
    const updatedNodes = nodes.map(node => {
      const connections = relationships.filter(rel => 
        rel.sourceId === node.id || rel.targetId === node.id
      ).length;
      
      const dependencies = relationships.filter(rel => 
        rel.targetId === node.id && rel.type === 'dependency'
      ).length;
      
      const dependents = relationships.filter(rel => 
        rel.sourceId === node.id && rel.type === 'dependency'
      ).length;

      return {
        ...node,
        connections,
        dependencyCount: dependencies,
        dependentCount: dependents
      };
    });

    setLocalNodes(updatedNodes);
    setLocalRelationships(relationships);

    // Store relationships in backend
    try {
      await apiRequest('/api/sector-mapping/relationships/bulk', {
        method: 'POST',
        body: { relationships }
      });
    } catch (error) {
      console.error('Failed to store relationships:', error);
    }
  }, []);

  // Store single relationship
  const storeRelationship = useMutation({
    mutationFn: async (relationship: SectorRelationship) => {
      const response = await apiRequest('/api/sector-mapping/relationships', {
        method: 'POST',
        body: relationship
      });
      return response;
    },
    onSuccess: (newRelationship) => {
      setLocalRelationships(prev => [...prev, newRelationship]);
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
    }
  });

  // Update node
  const updateNode = useMutation({
    mutationFn: async (node: SectorNode) => {
      const response = await apiRequest(`/api/sector-mapping/nodes/${node.id}`, {
        method: 'PUT',
        body: node
      });
      return response;
    },
    onSuccess: (updatedNode) => {
      setLocalNodes(prev => prev.map(node => 
        node.id === updatedNode.id ? updatedNode : node
      ));
    }
  });

  // Delete relationship
  const deleteRelationship = useMutation({
    mutationFn: async (relationshipId: string) => {
      await apiRequest(`/api/sector-mapping/relationships/${relationshipId}`, {
        method: 'DELETE'
      });
      return relationshipId;
    },
    onSuccess: (deletedId) => {
      setLocalRelationships(prev => prev.filter(rel => rel.id !== deletedId));
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
    }
  });

  // Get dependency map for a specific sector
  const getDependencyMap = useCallback((sectorId: number) => {
    const dependencies: SectorNode[] = [];
    const dependents: SectorNode[] = [];
    
    localRelationships.forEach(rel => {
      if (rel.type === 'dependency') {
        if (rel.sourceId === sectorId) {
          const target = localNodes.find(n => n.id === rel.targetId);
          if (target) dependencies.push(target);
        }
        if (rel.targetId === sectorId) {
          const source = localNodes.find(n => n.id === rel.sourceId);
          if (source) dependents.push(source);
        }
      }
    });
    
    return { dependencies, dependents };
  }, [localRelationships, localNodes]);

  // Get strongest connections
  const getStrongestConnections = useCallback((limit: number = 10) => {
    return localRelationships
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit);
  }, [localRelationships]);

  // Calculate network centrality
  const calculateNetworkCentrality = useCallback(() => {
    const centralityMap = new Map<number, number>();
    
    localNodes.forEach(node => {
      const connections = localRelationships.filter(
        rel => rel.sourceId === node.id || rel.targetId === node.id
      ).length;
      centralityMap.set(node.id, connections);
    });

    return Array.from(centralityMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([nodeId, centrality]) => ({
        node: localNodes.find(n => n.id === nodeId)!,
        centrality
      }));
  }, [localNodes, localRelationships]);

  // Generate relationship matrix
  const getRelationshipMatrix = useCallback((): RelationshipMatrix => {
    const matrix: RelationshipMatrix = {};
    
    localRelationships.forEach(rel => {
      const sourceKey = rel.sourceId.toString();
      const targetKey = rel.targetId.toString();
      
      if (!matrix[sourceKey]) matrix[sourceKey] = {};
      
      matrix[sourceKey][targetKey] = {
        strength: rel.strength,
        type: rel.type,
        bidirectional: rel.bidirectional || false
      };

      // Handle bidirectional relationships
      if (rel.bidirectional) {
        if (!matrix[targetKey]) matrix[targetKey] = {};
        matrix[targetKey][sourceKey] = {
          strength: rel.strength,
          type: rel.type,
          bidirectional: true
        };
      }
    });
    
    return matrix;
  }, [localRelationships]);

  // Get hierarchy data grouped by tiers
  const getHierarchyData = useCallback(() => {
    const hierarchy: { [tier: string]: SectorNode[] } = {};
    
    localNodes.forEach(node => {
      if (!hierarchy[node.tier]) {
        hierarchy[node.tier] = [];
      }
      hierarchy[node.tier].push(node);
    });
    
    return hierarchy;
  }, [localNodes]);

  // Calculate network statistics
  const networkStats = useMemo((): NetworkStats => {
    if (localNodes.length === 0) {
      return {
        totalConnections: 0,
        avgConnections: 0,
        networkDensity: 0,
        maxConnections: 0,
        isolatedNodes: 0,
        lastCalculated: new Date().toISOString()
      };
    }

    const totalConnections = localRelationships.length;
    const maxPossibleConnections = (localNodes.length * (localNodes.length - 1)) / 2;
    const connectionCounts = localNodes.map(node => node.connections);
    
    return {
      totalConnections,
      avgConnections: Math.round(totalConnections / localNodes.length * 10) / 10,
      networkDensity: Math.round((totalConnections / maxPossibleConnections) * 100),
      maxConnections: Math.max(...connectionCounts, 0),
      isolatedNodes: connectionCounts.filter(count => count === 0).length,
      lastCalculated: new Date().toISOString()
    };
  }, [localRelationships, localNodes]);

  // Cache refresh function
  const refreshCache = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['/api/sectors'] });
    queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
  }, [queryClient]);

  // Clear local cache
  const clearCache = useCallback(() => {
    setLocalRelationships([]);
    setLocalNodes([]);
    setIsInitialized(false);
  }, []);

  return {
    // Core data
    relationships: localRelationships,
    nodes: localNodes,
    networkStats,
    isLoading: sectorsLoading || relationshipsLoading,
    isInitialized,
    
    // Storage operations
    storeRelationship: storeRelationship.mutate,
    updateNode: updateNode.mutate,
    deleteRelationship: deleteRelationship.mutate,
    
    // Analysis functions
    getDependencyMap,
    getStrongestConnections,
    calculateNetworkCentrality,
    
    // Matrix and hierarchy operations
    getRelationshipMatrix,
    getHierarchyData,
    
    // Cache management
    refreshCache,
    clearCache
  };
}

// Helper functions
function getTierFromPricing(monthly: number): string {
  if (monthly >= 300) return 'Enterprise';
  if (monthly >= 150) return 'Infrastructure';
  if (monthly >= 100) return 'Professional';
  return 'Standard';
}

function getNodeColorFromTier(sectorName: string): string {
  const colorMap: Record<string, string> = {
    'Mining': '#F59E0B',
    'Agriculture': '#10B981',
    'Banking': '#3B82F6',
    'Health': '#EF4444',
    'Education': '#8B5CF6',
    'Creative': '#F97316',
    'AI': '#06B6D4',
    'Energy': '#84CC16',
    'Logistics': '#6366F1',
    'Tech': '#14B8A6'
  };
  
  const key = Object.keys(colorMap).find(k => sectorName.includes(k));
  return key ? colorMap[key] : '#6B7280';
}

function generateRelationshipDescription(
  source: SectorNode, 
  target: SectorNode, 
  type: SectorRelationship['type']
): string {
  const templates = {
    integration: `${source.emoji} ${source.name} integrates seamlessly with ${target.emoji} ${target.name}`,
    synergy: `Strategic synergy between ${source.emoji} ${source.name} and ${target.emoji} ${target.name}`,
    dependency: `${source.emoji} ${source.name} provides foundational support to ${target.emoji} ${target.name}`,
    collaboration: `Active collaboration connecting ${source.emoji} ${source.name} with ${target.emoji} ${target.name}`
  };
  
  return templates[type] || `Connection between ${source.name} and ${target.name}`;
}