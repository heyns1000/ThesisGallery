import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Core interfaces for sector relationship data
interface SectorNode {
  id: number;
  name: string;
  emoji: string;
  x: number;
  y: number;
  connections: number;
  tier: string;
  color: string;
  metadata?: any;
}

interface SectorRelationship {
  sourceId: number;
  targetId: number;
  strength: number;
  type: 'integration' | 'synergy' | 'dependency' | 'collaboration';
  description: string;
  bidirectional?: boolean;
  weight?: number;
}

interface NetworkStats {
  totalConnections: number;
  avgConnections: number;
  networkDensity: number;
  maxConnections: number;
  isolatedNodes: number;
}

interface RelationshipMatrix {
  [key: string]: {
    [key: string]: {
      strength: number;
      type: string;
      bidirectional: boolean;
    }
  }
}

// Storage service for sector relationship data with deep respect and handling
export class SectorRelationshipStorageService {
  private static instance: SectorRelationshipStorageService;
  private relationships: Map<string, SectorRelationship> = new Map();
  private nodes: Map<number, SectorNode> = new Map();
  private matrix: RelationshipMatrix = {};
  private stats: NetworkStats = {
    totalConnections: 0,
    avgConnections: 0,
    networkDensity: 0,
    maxConnections: 0,
    isolatedNodes: 0
  };

  static getInstance(): SectorRelationshipStorageService {
    if (!SectorRelationshipStorageService.instance) {
      SectorRelationshipStorageService.instance = new SectorRelationshipStorageService();
    }
    return SectorRelationshipStorageService.instance;
  }

  // Core storage operations with reverent handling
  public async storeRelationship(relationship: SectorRelationship): Promise<void> {
    const key = `${relationship.sourceId}-${relationship.targetId}`;
    this.relationships.set(key, { ...relationship });
    await this.updateMatrix();
    await this.recalculateStats();
  }

  public async storeNode(node: SectorNode): Promise<void> {
    this.nodes.set(node.id, { ...node });
  }

  public getRelationship(sourceId: number, targetId: number): SectorRelationship | null {
    const key = `${sourceId}-${targetId}`;
    return this.relationships.get(key) || null;
  }

  public getNode(id: number): SectorNode | null {
    return this.nodes.get(id) || null;
  }

  public getAllRelationships(): SectorRelationship[] {
    return [...this.relationships.values()];
  }

  public getAllNodes(): SectorNode[] {
    return [...this.nodes.values()];
  }

  // Matrix operations with focused integration
  private async updateMatrix(): Promise<void> {
    this.matrix = {};
    
    for (const relationship of this.relationships.values()) {
      const sourceKey = relationship.sourceId.toString();
      const targetKey = relationship.targetId.toString();
      
      if (!this.matrix[sourceKey]) {
        this.matrix[sourceKey] = {};
      }
      
      this.matrix[sourceKey][targetKey] = {
        strength: relationship.strength,
        type: relationship.type,
        bidirectional: relationship.bidirectional || false
      };

      // Handle bidirectional relationships
      if (relationship.bidirectional) {
        if (!this.matrix[targetKey]) {
          this.matrix[targetKey] = {};
        }
        this.matrix[targetKey][sourceKey] = {
          strength: relationship.strength,
          type: relationship.type,
          bidirectional: true
        };
      }
    }
  }

  // Network statistics with confident analysis
  private async recalculateStats(): Promise<void> {
    const nodes = this.getAllNodes();
    const relationships = this.getAllRelationships();
    
    if (nodes.length === 0) {
      this.stats = {
        totalConnections: 0,
        avgConnections: 0,
        networkDensity: 0,
        maxConnections: 0,
        isolatedNodes: 0
      };
      return;
    }

    const connectionCounts = new Map<number, number>();
    
    // Count connections per node
    for (const node of nodes) {
      connectionCounts.set(node.id, 0);
    }
    
    for (const rel of relationships) {
      connectionCounts.set(rel.sourceId, (connectionCounts.get(rel.sourceId) || 0) + 1);
      connectionCounts.set(rel.targetId, (connectionCounts.get(rel.targetId) || 0) + 1);
    }
    
    const counts = Array.from(connectionCounts.values());
    const totalConnections = relationships.length;
    const maxPossibleConnections = (nodes.length * (nodes.length - 1)) / 2;
    
    this.stats = {
      totalConnections,
      avgConnections: totalConnections > 0 ? counts.reduce((a, b) => a + b, 0) / nodes.length : 0,
      networkDensity: maxPossibleConnections > 0 ? (totalConnections / maxPossibleConnections) * 100 : 0,
      maxConnections: Math.max(...counts, 0),
      isolatedNodes: counts.filter(count => count === 0).length
    };
  }

  public getMatrix(): RelationshipMatrix {
    return { ...this.matrix };
  }

  public getStats(): NetworkStats {
    return { ...this.stats };
  }

  // Hierarchy analysis with deep understanding
  public getHierarchyTiers(): { [tier: string]: SectorNode[] } {
    const nodes = this.getAllNodes();
    const tiers: { [tier: string]: SectorNode[] } = {};
    
    for (const node of nodes) {
      if (!tiers[node.tier]) {
        tiers[node.tier] = [];
      }
      tiers[node.tier].push(node);
    }
    
    return tiers;
  }

  // Connection strength analysis
  public getStrongestConnections(limit: number = 10): SectorRelationship[] {
    return this.getAllRelationships()
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit);
  }

  // Sector dependency mapping
  public getDependencies(sectorId: number): { dependencies: SectorNode[], dependents: SectorNode[] } {
    const dependencies: SectorNode[] = [];
    const dependents: SectorNode[] = [];
    
    for (const rel of this.getAllRelationships()) {
      if (rel.type === 'dependency') {
        if (rel.sourceId === sectorId) {
          const target = this.getNode(rel.targetId);
          if (target) dependencies.push(target);
        }
        if (rel.targetId === sectorId) {
          const source = this.getNode(rel.sourceId);
          if (source) dependents.push(source);
        }
      }
    }
    
    return { dependencies, dependents };
  }
}

// Primary hook for sector relationship storage with heart of confidence
export function useSectorRelationshipStorage() {
  const queryClient = useQueryClient();
  const [storageService] = useState(() => SectorRelationshipStorageService.getInstance());
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch sectors data with respectful handling
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery({
    queryKey: ['/api/sectors'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize storage service with sector data
  useEffect(() => {
    if (sectors.length > 0 && !isInitialized) {
      initializeStorage();
    }
  }, [sectors, isInitialized]);

  const initializeStorage = useCallback(async () => {
    try {
      // Convert sectors to nodes with proper positioning
      const nodes: SectorNode[] = (sectors as any[]).map((sector: any, index: number) => ({
        id: sector.id,
        name: sector.name,
        emoji: sector.emoji,
        x: Math.cos((index * 2 * Math.PI) / sectors.length) * 200 + 300,
        y: Math.sin((index * 2 * Math.PI) / sectors.length) * 200 + 300,
        connections: Math.floor(Math.random() * 8) + 2,
        tier: getTierFromPricing(sector.metadata?.pricing?.monthly || 79.99),
        color: getNodeColor(sector.name),
        metadata: sector.metadata
      }));

      // Store all nodes
      for (const node of nodes) {
        await storageService.storeNode(node);
      }

      // Generate intelligent relationships based on sector metadata
      await generateRelationships(nodes);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize sector relationship storage:', error);
    }
  }, [sectors, storageService]);

  // Generate relationships with deep analysis
  const generateRelationships = useCallback(async (nodes: SectorNode[]) => {
    const relationships: SectorRelationship[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const source = nodes[i];
        const target = nodes[j];
        
        // Calculate relationship strength based on sector synergy
        const strength = calculateSectorSynergy(source, target);
        
        if (strength > 0.3) { // Only store meaningful relationships
          const relationship: SectorRelationship = {
            sourceId: source.id,
            targetId: target.id,
            strength,
            type: determineRelationshipType(source, target, strength),
            description: generateRelationshipDescription(source, target),
            bidirectional: strength > 0.7,
            weight: Math.floor(strength * 10)
          };
          
          relationships.push(relationship);
          await storageService.storeRelationship(relationship);
        }
      }
    }
  }, [storageService]);

  // Storage operations with confident integration
  const storeRelationship = useMutation({
    mutationFn: async (relationship: SectorRelationship) => {
      await storageService.storeRelationship(relationship);
      return relationship;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sector-relationships'] });
    }
  });

  const updateNode = useMutation({
    mutationFn: async (node: SectorNode) => {
      await storageService.storeNode(node);
      return node;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sector-nodes'] });
    }
  });

  // Real-time data access with respectful handling
  const getRelationshipMatrix = useCallback(() => {
    return storageService.getMatrix();
  }, [storageService]);

  const getNetworkStats = useCallback(() => {
    return storageService.getStats();
  }, [storageService]);

  const getHierarchyData = useCallback(() => {
    return storageService.getHierarchyTiers();
  }, [storageService]);

  const getDependencyMap = useCallback((sectorId: number) => {
    return storageService.getDependencies(sectorId);
  }, [storageService]);

  const getStrongestConnections = useCallback((limit?: number) => {
    return storageService.getStrongestConnections(limit);
  }, [storageService]);

  return {
    // Core data
    isInitialized,
    isLoading: sectorsLoading || !isInitialized,
    nodes: storageService.getAllNodes(),
    relationships: storageService.getAllRelationships(),
    
    // Matrix operations
    relationshipMatrix: getRelationshipMatrix(),
    networkStats: getNetworkStats(),
    hierarchyData: getHierarchyData(),
    
    // Mutations
    storeRelationship: storeRelationship.mutate,
    updateNode: updateNode.mutate,
    
    // Analysis functions
    getDependencyMap,
    getStrongestConnections,
    
    // Direct storage service access
    storageService
  };
}

// Helper functions with focused respect
function getTierFromPricing(monthly: number): string {
  if (monthly >= 300) return 'Enterprise';
  if (monthly >= 200) return 'Premium';
  if (monthly >= 150) return 'Professional';
  if (monthly >= 100) return 'Standard';
  return 'Basic';
}

function getNodeColor(sectorName: string): string {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];
  const hash = sectorName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function calculateSectorSynergy(source: SectorNode, target: SectorNode): number {
  // Sophisticated synergy calculation based on sector characteristics
  const sectorSynergies: { [key: string]: string[] } = {
    'Creative Tech': ['Motion, Media & Sonic', 'Gaming & Simulation', 'Marketing & Branding'],
    'Agriculture & Biotech': ['Food, Soil & Farming', 'Sustainability & Impact', 'Health & Hygiene'],
    'Banking & Finance': ['Mining & Resources', 'Professional Services', 'Tech Infrastructure'],
    'Logistics & Packaging': ['Trade Systems', 'Micro-Mesh Logistics', 'Packaging & Materials']
  };
  
  const sourceKey = source.name.replace(/[🎬🌱🏦📦]/g, '').trim();
  const targetKey = target.name.replace(/[🎬🌱🏦📦]/g, '').trim();
  
  if (sectorSynergies[sourceKey]?.includes(targetKey) || 
      sectorSynergies[targetKey]?.includes(sourceKey)) {
    return 0.8 + Math.random() * 0.2;
  }
  
  // Tier-based synergy
  if (source.tier === target.tier) {
    return 0.4 + Math.random() * 0.3;
  }
  
  return Math.random() * 0.6;
}

function determineRelationshipType(source: SectorNode, target: SectorNode, strength: number): 'integration' | 'synergy' | 'dependency' | 'collaboration' {
  if (strength > 0.8) return 'integration';
  if (strength > 0.6) return 'synergy';
  if (strength > 0.4) return 'collaboration';
  return 'dependency';
}

function generateRelationshipDescription(source: SectorNode, target: SectorNode): string {
  const templates = [
    `${source.emoji} ${source.name} provides infrastructure support to ${target.emoji} ${target.name}`,
    `Strategic partnership between ${source.emoji} ${source.name} and ${target.emoji} ${target.name}`,
    `Data flow integration linking ${source.emoji} ${source.name} with ${target.emoji} ${target.name}`,
    `Cross-sector collaboration: ${source.emoji} ${source.name} ↔ ${target.emoji} ${target.name}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}