import { useRef, useEffect, useState, useCallback } from 'react';
import { useSectorRelationshipStorage } from './useSectorRelationshipStorage';

interface NetworkVisualizationConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  nodeRadius: number;
  connectionOpacity: number;
  animationSpeed: number;
  showLabels: boolean;
  showConnections: boolean;
  filterType?: string;
  selectedSector?: number | null;
}

interface CanvasDrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: NetworkVisualizationConfig;
  animationFrame?: number;
}

// Network visualization hook with deep respect for visual excellence
export function useNetworkVisualization(config: Partial<NetworkVisualizationConfig> = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingContext, setDrawingContext] = useState<CanvasDrawingContext | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const {
    nodes,
    relationships,
    networkStats,
    isInitialized,
    getDependencyMap,
    getStrongestConnections
  } = useSectorRelationshipStorage();

  const defaultConfig: NetworkVisualizationConfig = {
    width: 800,
    height: 600,
    centerX: 400,
    centerY: 300,
    nodeRadius: 25,
    connectionOpacity: 0.6,
    animationSpeed: 1,
    showLabels: true,
    showConnections: true,
    ...config
  };

  // Initialize canvas with respectful setup
  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set up high DPI canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const context: CanvasDrawingContext = {
      canvas,
      ctx,
      config: { ...defaultConfig, width: rect.width, height: rect.height }
    };

    setDrawingContext(context);
  }, [isInitialized, canvasRef.current]);

  // Core drawing functions with artistic confidence
  const drawNetworkConnections = useCallback((ctx: CanvasRenderingContext2D, config: NetworkVisualizationConfig) => {
    if (!config.showConnections) return;

    ctx.globalAlpha = config.connectionOpacity;
    
    relationships.forEach(relationship => {
      const sourceNode = nodes.find(n => n.id === relationship.sourceId);
      const targetNode = nodes.find(n => n.id === relationship.targetId);
      
      if (!sourceNode || !targetNode) return;

      // Connection color based on relationship type
      const connectionColors = {
        integration: '#10B981',
        synergy: '#3B82F6', 
        dependency: '#F59E0B',
        collaboration: '#8B5CF6'
      };

      ctx.strokeStyle = connectionColors[relationship.type] || '#6B7280';
      ctx.lineWidth = Math.max(1, relationship.strength * 4);
      
      // Gradient line for visual depth
      const gradient = ctx.createLinearGradient(
        sourceNode.x, sourceNode.y,
        targetNode.x, targetNode.y
      );
      gradient.addColorStop(0, connectionColors[relationship.type] + '80');
      gradient.addColorStop(1, connectionColors[relationship.type] + '20');
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      
      // Curved connection for visual elegance
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      const offset = relationship.strength * 20;
      
      ctx.quadraticCurveTo(
        midX + offset, midY - offset,
        targetNode.x, targetNode.y
      );
      
      ctx.stroke();

      // Connection strength indicator
      if (relationship.strength > 0.7) {
        ctx.fillStyle = connectionColors[relationship.type];
        ctx.beginPath();
        ctx.arc(midX, midY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
  }, [nodes, relationships]);

  const drawNetworkNodes = useCallback((ctx: CanvasRenderingContext2D, config: NetworkVisualizationConfig) => {
    nodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const isSelected = config.selectedSector === node.id;
      const radius = config.nodeRadius + (isHovered ? 5 : 0) + (isSelected ? 8 : 0);

      // Node shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = isHovered ? 15 : 8;
      ctx.shadowOffsetY = isHovered ? 6 : 3;

      // Node background with tier-based styling
      const tierGradients = {
        'Enterprise': ['#DC2626', '#7F1D1D'],
        'Premium': ['#D97706', '#92400E'],
        'Professional': ['#059669', '#047857'],
        'Standard': ['#2563EB', '#1D4ED8'],
        'Basic': ['#6B7280', '#374151']
      };

      const [color1, color2] = tierGradients[node.tier] || tierGradients['Basic'];
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, radius
      );
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Node border
      ctx.strokeStyle = isSelected ? '#FBBF24' : '#FFFFFF';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Clear shadow for text
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Node emoji
      ctx.font = `${Math.floor(radius * 0.6)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.emoji, node.x, node.y);

      // Node connection count indicator
      ctx.font = '10px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(
        node.connections.toString(),
        node.x + radius - 8,
        node.y - radius + 8
      );

      // Node labels with respectful positioning
      if (config.showLabels) {
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        
        const labelY = node.y + radius + 20;
        const maxWidth = 120;
        const words = node.name.replace(/[🎬🌱🏦📦✂🎮🧠🏗️⚖📖☰🎙️✿🧠📦✴️☯🔑🧺🔋🎬📡🔁🎓♻️🧾🪙⛏️🦁⚙️]/g, '').trim().split(' ');
        
        if (words.length > 2) {
          // Multi-line label for longer names
          const line1 = words.slice(0, 2).join(' ');
          const line2 = words.slice(2).join(' ');
          ctx.fillText(line1, node.x, labelY);
          ctx.fillText(line2, node.x, labelY + 14);
        } else {
          ctx.fillText(words.join(' '), node.x, labelY);
        }
      }
    });
  }, [nodes, hoveredNode, config.selectedSector]);

  const drawNetworkStats = useCallback((ctx: CanvasRenderingContext2D, config: NetworkVisualizationConfig) => {
    // Stats panel with confident display
    const panelX = config.width - 200;
    const panelY = 20;
    const panelWidth = 180;
    const panelHeight = 140;

    // Panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // Panel border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Stats text
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';

    const stats = [
      `Total: ${networkStats.totalConnections}`,
      `Avg: ${Math.round(networkStats.avgConnections)}`,
      `Density: ${Math.round(networkStats.networkDensity)}%`,
      `Max: ${networkStats.maxConnections}`,
      `Isolated: ${networkStats.isolatedNodes}`
    ];

    stats.forEach((stat, index) => {
      ctx.fillText(stat, panelX + 10, panelY + 25 + (index * 20));
    });

    // Title
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#3B82F6';
    ctx.fillText('Network Stats', panelX + 10, panelY + 15);
  }, [networkStats]);

  // Animation loop with smooth rendering
  const animateNetwork = useCallback(() => {
    if (!drawingContext) return;

    const { ctx, config } = drawingContext;
    
    // Clear canvas with respectful cleanup
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Background gradient
    const bgGradient = ctx.createRadialGradient(
      config.centerX, config.centerY, 0,
      config.centerX, config.centerY, Math.max(config.width, config.height) / 2
    );
    bgGradient.addColorStop(0, '#F8FAFC');
    bgGradient.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, config.width, config.height);

    // Draw network elements with artistic flow
    drawNetworkConnections(ctx, config);
    drawNetworkNodes(ctx, config);
    drawNetworkStats(ctx, config);

    // Continue animation
    if (drawingContext.animationFrame) {
      drawingContext.animationFrame = requestAnimationFrame(animateNetwork);
    }
  }, [drawingContext, drawNetworkConnections, drawNetworkNodes, drawNetworkStats]);

  // Start animation with confident initiation
  useEffect(() => {
    if (!drawingContext) return;

    drawingContext.animationFrame = requestAnimationFrame(animateNetwork);

    return () => {
      if (drawingContext.animationFrame) {
        cancelAnimationFrame(drawingContext.animationFrame);
      }
    };
  }, [drawingContext, animateNetwork]);

  // Mouse interaction with respectful handling
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingContext) return;

    const rect = drawingContext.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if hovering over a node
    let hoveredNodeId: number | null = null;
    
    for (const node of nodes) {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
      );
      
      if (distance <= drawingContext.config.nodeRadius + 5) {
        hoveredNodeId = node.id;
        break;
      }
    }

    setHoveredNode(hoveredNodeId);
    
    // Update cursor
    drawingContext.canvas.style.cursor = hoveredNodeId ? 'pointer' : 'default';
  }, [drawingContext, nodes]);

  const handleMouseClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingContext || !hoveredNode) return;

    // Node selection with confident handling
    const selectedNode = nodes.find(n => n.id === hoveredNode);
    if (selectedNode) {
      // Update configuration to highlight selected node
      drawingContext.config.selectedSector = hoveredNode;
      
      // Trigger dependency analysis
      const deps = getDependencyMap(hoveredNode);
      console.log(`🔗 Dependencies for ${selectedNode.name}:`, deps);
    }
  }, [drawingContext, hoveredNode, nodes, getDependencyMap]);

  // Network analysis functions with deep insights
  const analyzeNetworkCentrality = useCallback(() => {
    const centralityMap = new Map<number, number>();
    
    nodes.forEach(node => {
      const connections = relationships.filter(
        rel => rel.sourceId === node.id || rel.targetId === node.id
      ).length;
      centralityMap.set(node.id, connections);
    });

    return Array.from(centralityMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nodeId, centrality]) => ({
        node: nodes.find(n => n.id === nodeId),
        centrality
      }));
  }, [nodes, relationships]);

  const findCriticalPaths = useCallback(() => {
    const strongConnections = getStrongestConnections(10);
    const criticalPaths = [];
    
    for (const connection of strongConnections) {
      const sourceNode = nodes.find(n => n.id === connection.sourceId);
      const targetNode = nodes.find(n => n.id === connection.targetId);
      
      if (sourceNode && targetNode) {
        criticalPaths.push({
          path: `${sourceNode.name} → ${targetNode.name}`,
          strength: connection.strength,
          type: connection.type
        });
      }
    }
    
    return criticalPaths;
  }, [nodes, getStrongestConnections]);

  return {
    // Canvas reference and state
    canvasRef,
    isReady: !!drawingContext && isInitialized,
    hoveredNode,
    
    // Event handlers
    onMouseMove: handleMouseMove,
    onClick: handleMouseClick,
    
    // Network data
    nodes,
    relationships,
    networkStats,
    
    // Analysis functions
    analyzeNetworkCentrality,
    findCriticalPaths,
    getDependencyMap,
    
    // Configuration
    updateConfig: (newConfig: Partial<NetworkVisualizationConfig>) => {
      if (drawingContext) {
        Object.assign(drawingContext.config, newConfig);
      }
    }
  };
}