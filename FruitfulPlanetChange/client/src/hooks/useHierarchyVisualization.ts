import { useState, useCallback, useMemo } from 'react';
import { useSectorRelationshipStorage } from './useSectorRelationshipStorage';

interface HierarchyNode {
  id: number;
  name: string;
  emoji: string;
  tier: string;
  connections: number;
  level: number;
  children: HierarchyNode[];
  parents: HierarchyNode[];
  x: number;
  y: number;
  isExpanded: boolean;
  dependencyCount: number;
  dependentCount: number;
}

interface HierarchyVisualizationState {
  expandedNodes: Set<number>;
  selectedNode: number | null;
  viewMode: 'dependencies' | 'influence' | 'both';
  showConnections: boolean;
  groupByTier: boolean;
  maxDepth: number;
}

interface TierGroup {
  tier: string;
  nodes: HierarchyNode[];
  avgConnections: number;
  totalNodes: number;
  color: string;
}

// Hierarchy visualization hook with deep structural respect and understanding
export function useHierarchyVisualization() {
  const {
    nodes,
    relationships,
    hierarchyData,
    networkStats,
    isInitialized,
    getDependencyMap,
    getStrongestConnections
  } = useSectorRelationshipStorage();

  const [visualizationState, setVisualizationState] = useState<HierarchyVisualizationState>({
    expandedNodes: new Set<number>(),
    selectedNode: null,
    viewMode: 'dependencies',
    showConnections: true,
    groupByTier: true,
    maxDepth: 3
  });

  // Tier color mapping with confident visual hierarchy
  const tierColors = useMemo(() => ({
    'Enterprise': { primary: '#DC2626', secondary: '#FEE2E2', border: '#F87171' },
    'Premium': { primary: '#D97706', secondary: '#FED7AA', border: '#FB923C' },
    'Professional': { primary: '#059669', secondary: '#D1FAE5', border: '#34D399' },
    'Standard': { primary: '#2563EB', secondary: '#DBEAFE', border: '#60A5FA' },
    'Basic': { primary: '#6B7280', secondary: '#F3F4F6', border: '#9CA3AF' }
  }), []);

  // Build hierarchy structure with respectful dependency analysis
  const hierarchyStructure = useMemo(() => {
    if (!isInitialized || nodes.length === 0) return { roots: [], tiers: [] };

    // Create hierarchy nodes with dependency analysis
    const hierarchyNodes: Map<number, HierarchyNode> = new Map();
    
    nodes.forEach(node => {
      const deps = getDependencyMap(node.id);
      
      hierarchyNodes.set(node.id, {
        id: node.id,
        name: node.name,
        emoji: node.emoji,
        tier: node.tier,
        connections: node.connections,
        level: 0,
        children: [],
        parents: [],
        x: 0,
        y: 0,
        isExpanded: visualizationState.expandedNodes.has(node.id),
        dependencyCount: deps.dependencies.length,
        dependentCount: deps.dependents.length
      });
    });

    // Build parent-child relationships based on dependencies
    relationships.forEach(relationship => {
      const sourceNode = hierarchyNodes.get(relationship.sourceId);
      const targetNode = hierarchyNodes.get(relationship.targetId);
      
      if (!sourceNode || !targetNode) return;

      if (relationship.type === 'dependency') {
        // Target depends on source, so source is parent of target
        if (!sourceNode.children.find(child => child.id === targetNode.id)) {
          sourceNode.children.push(targetNode);
        }
        if (!targetNode.parents.find(parent => parent.id === sourceNode.id)) {
          targetNode.parents.push(sourceNode);
        }
      }
    });

    // Calculate levels based on dependency depth
    const calculateLevels = () => {
      const visited = new Set<number>();
      const queue: { node: HierarchyNode; level: number }[] = [];
      
      // Start with nodes that have no dependencies (root nodes)
      hierarchyNodes.forEach(node => {
        if (node.parents.length === 0) {
          queue.push({ node, level: 0 });
        }
      });

      while (queue.length > 0) {
        const { node, level } = queue.shift()!;
        
        if (visited.has(node.id)) continue;
        visited.add(node.id);
        
        node.level = level;
        
        // Add children to queue with incremented level
        node.children.forEach(child => {
          if (!visited.has(child.id)) {
            queue.push({ node: child, level: level + 1 });
          }
        });
      }
    };

    calculateLevels();

    // Find root nodes (no parents or minimal dependencies)
    const rootNodes = Array.from(hierarchyNodes.values()).filter(node => 
      node.parents.length === 0 || node.dependencyCount <= 1
    );

    // Group by tiers if enabled
    const tierGroups: TierGroup[] = [];
    if (visualizationState.groupByTier) {
      const tierMap = new Map<string, HierarchyNode[]>();
      
      hierarchyNodes.forEach(node => {
        if (!tierMap.has(node.tier)) {
          tierMap.set(node.tier, []);
        }
        tierMap.get(node.tier)!.push(node);
      });

      tierMap.forEach((tierNodes, tier) => {
        const avgConnections = tierNodes.reduce((sum, node) => sum + node.connections, 0) / tierNodes.length;
        const colors = tierColors[tier] || tierColors['Basic'];
        
        tierGroups.push({
          tier,
          nodes: tierNodes,
          avgConnections,
          totalNodes: tierNodes.length,
          color: colors.primary
        });
      });

      // Sort tiers by importance (Enterprise first)
      tierGroups.sort((a, b) => {
        const tierOrder = { 'Enterprise': 5, 'Premium': 4, 'Professional': 3, 'Standard': 2, 'Basic': 1 };
        const aOrder = tierOrder[a.tier] || 0;
        const bOrder = tierOrder[b.tier] || 0;
        return bOrder - aOrder;
      });
    }

    return {
      roots: rootNodes,
      tiers: tierGroups,
      allNodes: Array.from(hierarchyNodes.values())
    };
  }, [nodes, relationships, visualizationState.expandedNodes, visualizationState.groupByTier, isInitialized, getDependencyMap, tierColors]);

  // Calculate positioning with respectful spatial organization
  const calculateNodePositions = useCallback((containerWidth: number, containerHeight: number) => {
    const { allNodes, tiers, roots } = hierarchyStructure;
    
    if (visualizationState.groupByTier && tiers.length > 0) {
      // Position nodes by tier groups
      const tierHeight = containerHeight / tiers.length;
      
      tiers.forEach((tier, tierIndex) => {
        const tierY = tierIndex * tierHeight + tierHeight / 2;
        const nodeWidth = containerWidth / (tier.nodes.length + 1);
        
        tier.nodes.forEach((node, nodeIndex) => {
          node.x = (nodeIndex + 1) * nodeWidth;
          node.y = tierY;
        });
      });
    } else {
      // Position nodes by hierarchy levels
      const maxLevel = Math.max(...allNodes.map(node => node.level));
      const levelHeight = containerHeight / (maxLevel + 2);
      
      // Group nodes by level
      const levelGroups = new Map<number, HierarchyNode[]>();
      allNodes.forEach(node => {
        if (!levelGroups.has(node.level)) {
          levelGroups.set(node.level, []);
        }
        levelGroups.get(node.level)!.push(node);
      });

      // Position nodes within each level
      levelGroups.forEach((levelNodes, level) => {
        const levelY = (level + 1) * levelHeight;
        const nodeWidth = containerWidth / (levelNodes.length + 1);
        
        levelNodes.forEach((node, nodeIndex) => {
          node.x = (nodeIndex + 1) * nodeWidth;
          node.y = levelY;
        });
      });
    }

    return allNodes;
  }, [hierarchyStructure, visualizationState.groupByTier]);

  // Node interaction handlers with confident responsiveness
  const toggleNodeExpansion = useCallback((nodeId: number) => {
    setVisualizationState(prev => {
      const newExpanded = new Set(prev.expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { ...prev, expandedNodes: newExpanded };
    });
  }, []);

  const selectNode = useCallback((nodeId: number | null) => {
    setVisualizationState(prev => ({
      ...prev,
      selectedNode: nodeId
    }));

    if (nodeId) {
      const node = hierarchyStructure.allNodes.find(n => n.id === nodeId);
      const deps = getDependencyMap(nodeId);
      
      console.log('🌳 Hierarchy Node Analysis:', {
        node: node?.name,
        tier: node?.tier,
        level: node?.level,
        dependencies: deps.dependencies.map(d => d.name),
        dependents: deps.dependents.map(d => d.name),
        directChildren: node?.children.length || 0,
        totalConnections: node?.connections || 0
      });
    }
  }, [hierarchyStructure.allNodes, getDependencyMap]);

  // Hierarchy analysis functions with deep insights
  const getInfluenceMap = useCallback(() => {
    const influenceMap = new Map<number, number>();
    
    hierarchyStructure.allNodes.forEach(node => {
      // Calculate influence as combination of dependents and connections
      const influence = (node.dependentCount * 2) + node.connections + (node.children.length * 3);
      influenceMap.set(node.id, influence);
    });

    return Array.from(influenceMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([nodeId, influence]) => ({
        node: hierarchyStructure.allNodes.find(n => n.id === nodeId),
        influence
      }));
  }, [hierarchyStructure.allNodes]);

  const getCriticalPaths = useCallback(() => {
    const paths = [];
    const strongConnections = getStrongestConnections(15);
    
    // Find paths through the hierarchy that involve strong connections
    strongConnections.forEach(connection => {
      const sourceNode = hierarchyStructure.allNodes.find(n => n.id === connection.sourceId);
      const targetNode = hierarchyStructure.allNodes.find(n => n.id === connection.targetId);
      
      if (sourceNode && targetNode) {
        const levelDifference = Math.abs(sourceNode.level - targetNode.level);
        
        paths.push({
          from: sourceNode,
          to: targetNode,
          strength: connection.strength,
          type: connection.type,
          levelDifference,
          isCritical: levelDifference > 1 && connection.strength > 0.7
        });
      }
    });

    return paths.sort((a, b) => b.strength - a.strength);
  }, [hierarchyStructure.allNodes, getStrongestConnections]);

  const getHierarchyStats = useCallback(() => {
    const { allNodes } = hierarchyStructure;
    const levels = [...new Set(allNodes.map(node => node.level))].sort((a, b) => a - b);
    
    const levelStats = levels.map(level => {
      const levelNodes = allNodes.filter(node => node.level === level);
      return {
        level,
        nodeCount: levelNodes.length,
        avgConnections: levelNodes.reduce((sum, node) => sum + node.connections, 0) / levelNodes.length,
        avgDependencies: levelNodes.reduce((sum, node) => sum + node.dependencyCount, 0) / levelNodes.length,
        avgDependents: levelNodes.reduce((sum, node) => sum + node.dependentCount, 0) / levelNodes.length
      };
    });

    const rootNodes = allNodes.filter(node => node.parents.length === 0);
    const leafNodes = allNodes.filter(node => node.children.length === 0);
    
    return {
      totalLevels: levels.length,
      maxLevel: Math.max(...levels),
      rootNodeCount: rootNodes.length,
      leafNodeCount: leafNodes.length,
      levelStats,
      avgNodesPerLevel: allNodes.length / levels.length,
      hierarchyDepth: Math.max(...levels) + 1
    };
  }, [hierarchyStructure]);

  // Configuration functions with respectful management
  const setViewMode = useCallback((mode: 'dependencies' | 'influence' | 'both') => {
    setVisualizationState(prev => ({
      ...prev,
      viewMode: mode,
      selectedNode: null
    }));
  }, []);

  const toggleConnections = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      showConnections: !prev.showConnections
    }));
  }, []);

  const toggleTierGrouping = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      groupByTier: !prev.groupByTier,
      selectedNode: null
    }));
  }, []);

  const setMaxDepth = useCallback((depth: number) => {
    setVisualizationState(prev => ({
      ...prev,
      maxDepth: Math.max(1, Math.min(10, depth))
    }));
  }, []);

  // Export hierarchy data with confident structure
  const exportHierarchyData = useCallback(() => {
    const hierarchyJSON = {
      metadata: {
        totalNodes: hierarchyStructure.allNodes.length,
        totalTiers: hierarchyStructure.tiers.length,
        maxLevel: Math.max(...hierarchyStructure.allNodes.map(n => n.level)),
        exportDate: new Date().toISOString()
      },
      tiers: hierarchyStructure.tiers.map(tier => ({
        tier: tier.tier,
        nodeCount: tier.totalNodes,
        avgConnections: tier.avgConnections,
        color: tier.color,
        nodes: tier.nodes.map(node => ({
          id: node.id,
          name: node.name,
          emoji: node.emoji,
          level: node.level,
          connections: node.connections,
          dependencyCount: node.dependencyCount,
          dependentCount: node.dependentCount
        }))
      })),
      relationships: relationships.map(rel => ({
        source: hierarchyStructure.allNodes.find(n => n.id === rel.sourceId)?.name,
        target: hierarchyStructure.allNodes.find(n => n.id === rel.targetId)?.name,
        type: rel.type,
        strength: rel.strength
      }))
    };

    return JSON.stringify(hierarchyJSON, null, 2);
  }, [hierarchyStructure, relationships]);

  return {
    // Core hierarchy data
    hierarchyStructure,
    isReady: isInitialized && hierarchyStructure.allNodes.length > 0,
    
    // Visualization state
    visualizationState,
    tierColors,
    
    // Positioning
    calculateNodePositions,
    
    // Interaction handlers
    toggleNodeExpansion,
    selectNode,
    
    // Analysis functions
    getInfluenceMap,
    getCriticalPaths,
    getHierarchyStats,
    
    // Configuration
    setViewMode,
    toggleConnections,
    toggleTierGrouping,
    setMaxDepth,
    
    // Data export
    exportHierarchyData,
    
    // Network integration
    networkStats,
    getDependencyMap
  };
}