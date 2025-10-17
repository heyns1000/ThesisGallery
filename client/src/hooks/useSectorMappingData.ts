import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMemo } from 'react';

export interface SectorRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number;
  relationshipType: 'integration' | 'synergy' | 'dependency' | 'collaboration';
  description?: string;
  bidirectional: boolean;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sector {
  id: string;
  sectorName: string;
  glyph: string;
  coreBrands: number;
  totalNodes: number;
  region?: string;
  tier?: string;
  monthlyFee?: string;
  annualFee?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
}

export interface NetworkStats {
  totalConnections: number;
  avgConnections: number;
  networkDensity: number;
  maxConnections: number;
  isolatedNodes: number;
}

export interface DependencyMap {
  dependencies: Sector[];
  dependents: Sector[];
}

export function useSectorMappingData() {
  // Fetch sectors
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch relationships
  const { data: relationships = [], isLoading: relationshipsLoading } = useQuery<SectorRelationship[]>({
    queryKey: ['/api/sector-mapping/relationships'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch network stats
  const { data: networkStats, isLoading: statsLoading } = useQuery<NetworkStats>({
    queryKey: ['/api/sector-mapping/network-stats'],
    staleTime: 1000 * 60 * 5,
  });

  // Store relationship mutation
  const storeRelationshipMutation = useMutation({
    mutationFn: async (relationship: Omit<SectorRelationship, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest('/api/sector-mapping/relationships', {
        method: 'POST',
        body: JSON.stringify(relationship),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/network-stats'] });
    },
  });

  // Update relationship mutation
  const updateRelationshipMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SectorRelationship> }) => {
      return apiRequest(`/api/sector-mapping/relationships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/network-stats'] });
    },
  });

  // Delete relationship mutation
  const deleteRelationshipMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/sector-mapping/relationships/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/network-stats'] });
    },
  });

  // Calculate dependency map for a specific sector
  const getDependencyMap = async (sectorId: string): Promise<DependencyMap> => {
    // Find relationships where this sector is involved
    const sectorRelationships = relationships.filter(
      r => (r.sourceId === sectorId || r.targetId === sectorId) && r.relationshipType === 'dependency'
    );

    const dependencyIds = sectorRelationships
      .filter(r => r.targetId === sectorId)
      .map(r => r.sourceId);

    const dependentIds = sectorRelationships
      .filter(r => r.sourceId === sectorId)
      .map(r => r.targetId);

    const dependencies = sectors.filter(s => dependencyIds.includes(s.id));
    const dependents = sectors.filter(s => dependentIds.includes(s.id));

    return { dependencies, dependents };
  };

  // Get strongest connections
  const getStrongestConnections = (limit: number = 10): SectorRelationship[] => {
    return [...relationships]
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit);
  };

  // Calculate network centrality
  const calculateNetworkCentrality = useMemo(() => {
    if (!sectors.length || !relationships.length) return [];

    const connectionCounts = new Map<string, number>();
    
    sectors.forEach(s => connectionCounts.set(s.id, 0));
    
    relationships.forEach(r => {
      connectionCounts.set(r.sourceId, (connectionCounts.get(r.sourceId) || 0) + 1);
      connectionCounts.set(r.targetId, (connectionCounts.get(r.targetId) || 0) + 1);
    });

    return sectors.map(sector => ({
      node: sector,
      centrality: connectionCounts.get(sector.id) || 0,
    })).sort((a, b) => b.centrality - a.centrality);
  }, [sectors, relationships]);

  // Get relationship matrix
  const getRelationshipMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    
    sectors.forEach(sector => {
      matrix[sector.id] = {};
      sectors.forEach(targetSector => {
        matrix[sector.id][targetSector.id] = 0;
      });
    });
    
    relationships.forEach(rel => {
      matrix[rel.sourceId][rel.targetId] = rel.strength;
      if (rel.bidirectional) {
        matrix[rel.targetId][rel.sourceId] = rel.strength;
      }
    });
    
    return matrix;
  }, [sectors, relationships]);

  // Get hierarchy data (sectors grouped by tier)
  const getHierarchyData = useMemo(() => {
    const hierarchy: Record<string, Sector[]> = {
      'Enterprise': [],
      'Infrastructure': [],
      'Professional': [],
      'Standard': [],
    };

    sectors.forEach(sector => {
      const tier = sector.tier || 'Standard';
      if (!hierarchy[tier]) {
        hierarchy[tier] = [];
      }
      hierarchy[tier].push(sector);
    });

    return hierarchy;
  }, [sectors]);

  const isLoading = sectorsLoading || relationshipsLoading || statsLoading;
  const isInitialized = sectors.length > 0;

  return {
    // Core Data
    relationships,
    nodes: sectors,
    networkStats: networkStats || {
      totalConnections: 0,
      avgConnections: 0,
      networkDensity: 0,
      maxConnections: 0,
      isolatedNodes: 0,
    },
    isLoading,
    isInitialized,

    // Storage Operations
    storeRelationship: storeRelationshipMutation.mutateAsync,
    updateRelationship: async (id: string, updates: Partial<SectorRelationship>) => {
      return updateRelationshipMutation.mutateAsync({ id, updates });
    },
    deleteRelationship: deleteRelationshipMutation.mutateAsync,

    // Analysis Functions
    getDependencyMap,
    getStrongestConnections,
    calculateNetworkCentrality,

    // Matrix Operations
    getRelationshipMatrix,
    getHierarchyData,

    // Cache Management
    refreshCache: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/relationships'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sector-mapping/network-stats'] });
    },
    clearCache: () => {
      queryClient.removeQueries({ queryKey: ['/api/sector-mapping/relationships'] });
      queryClient.removeQueries({ queryKey: ['/api/sector-mapping/network-stats'] });
    },
  };
}
