import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useSectorMappingData } from './useSectorMappingData';

interface VisualizationConfig {
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
}

interface CanvasDrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: VisualizationConfig;
  animationFrame?: number;
}

type ViewMode = 'network' | 'matrix' | 'hierarchy';

// Primary visualization management hook for sector mapping
export function useSectorVisualization(config: Partial<VisualizationConfig> = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingContext, setDrawingContext] = useState<CanvasDrawingContext | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Get data from mapping hook
  const {
    relationships,
    nodes,
    networkStats,
    isInitialized,
    getDependencyMap,
    getStrongestConnections,
    calculateNetworkCentrality
  } = useSectorMappingData();

  const defaultConfig: VisualizationConfig = useMemo(() => ({
    width: 800,
    height: 600,
    centerX: 400,
    centerY: 300,
    nodeRadius: 28,
    connectionOpacity: 0.6,
    animationSpeed: 1,
    showLabels: true,
    showConnections: true,
    ...config
  }), [config]);

  // Initialize canvas with high DPI support
  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // High DPI setup
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Set default styles
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const context: CanvasDrawingContext = {
      canvas,
      ctx,
      config: { 
        ...defaultConfig, 
        width: rect.width, 
        height: rect.height,
        centerX: rect.width / 2,
        centerY: rect.height / 2
      }
    };

    setDrawingContext(context);
  }, [isInitialized, canvasRef.current, defaultConfig]);

  // Network connection colors based on relationship type
  const getConnectionColor = useCallback((type: string): string => {
    const colors = {
      integration: '#10B981', // Green
      synergy: '#3B82F6',     // Blue
      dependency: '#F59E0B',  // Yellow/Orange
      collaboration: '#8B5CF6' // Purple
    };
    return colors[type] || '#6B7280';
  }, []);

  // Tier-based node colors
  const getTierColor = useCallback((tier: string): [string, string] => {
    const tierColors = {
      'Enterprise': ['#DC2626', '#7F1D1D'],     // Red gradient
      'Infrastructure': ['#D97706', '#92400E'], // Orange gradient
      'Professional': ['#059669', '#047857'],   // Green gradient
      'Standard': ['#2563EB', '#1D4ED8']        // Blue gradient
    };
    return tierColors[tier] || tierColors['Standard'];
  }, []);

  // Draw network connections with elegant curves
  const drawNetworkConnections = useCallback((ctx: CanvasRenderingContext2D, config: VisualizationConfig) => {
    if (!config.showConnections || viewMode !== 'network') return;

    ctx.globalAlpha = config.connectionOpacity;
    
    relationships.forEach(relationship => {
      const sourceNode = nodes.find(n => n.id === relationship.sourceId);
      const targetNode = nodes.find(n => n.id === relationship.targetId);
      
      if (!sourceNode || !targetNode) return;

      // Connection styling based on strength and type
      const baseColor = getConnectionColor(relationship.type);
      const lineWidth = Math.max(1, relationship.strength * 5);
      
      // Gradient line for visual depth
      const gradient = ctx.createLinearGradient(
        sourceNode.x, sourceNode.y,
        targetNode.x, targetNode.y
      );
      gradient.addColorStop(0, baseColor + '80');
      gradient.addColorStop(0.5, baseColor + '40');
      gradient.addColorStop(1, baseColor + '80');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      // Curved connection for visual elegance
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      const curvature = relationship.strength * 30;
      
      // Calculate curve control point
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const controlX = midX + (-dy / length) * curvature;
      const controlY = midY + (dx / length) * curvature;
      
      ctx.quadraticCurveTo(controlX, controlY, targetNode.x, targetNode.y);
      ctx.stroke();

      // Connection strength indicator
      if (relationship.strength > 0.7) {
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(controlX, controlY, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Bidirectional indicator
      if (relationship.bidirectional) {
        ctx.fillStyle = baseColor + 'CC';
        ctx.beginPath();
        ctx.arc(midX, midY, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
  }, [nodes, relationships, viewMode, getConnectionColor]);

  // Draw network nodes with tier-based styling
  const drawNetworkNodes = useCallback((ctx: CanvasRenderingContext2D, config: VisualizationConfig) => {
    if (viewMode !== 'network') return;

    nodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedSector === node.id;
      const radius = config.nodeRadius + (isHovered ? 6 : 0) + (isSelected ? 10 : 0);

      // Node shadow for depth
      if (isHovered || isSelected) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = isSelected ? 20 : 12;
        ctx.shadowOffsetY = isSelected ? 8 : 4;
      }

      // Node background with tier-based gradient
      const [color1, color2] = getTierColor(node.tier);
      const gradient = ctx.createRadialGradient(
        node.x - radius * 0.3, node.y - radius * 0.3, 0,
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
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.stroke();

      // Clear shadow for text
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Node emoji
      ctx.font = `${Math.floor(radius * 0.65)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.emoji, node.x, node.y);

      // Connection count badge
      if (node.connections > 0) {
        const badgeX = node.x + radius - 12;
        const badgeY = node.y - radius + 12;
        
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(node.connections.toString(), badgeX, badgeY);
      }

      // Node tier indicator
      const tierColors = {
        'Enterprise': '#DC2626',
        'Infrastructure': '#D97706', 
        'Professional': '#059669',
        'Standard': '#2563EB'
      };
      
      ctx.fillStyle = tierColors[node.tier] || tierColors['Standard'];
      ctx.beginPath();
      ctx.arc(node.x - radius + 8, node.y + radius - 8, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Node labels
      if (config.showLabels) {
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        
        const labelY = node.y + radius + 20;
        const words = node.name.replace(/[🎬🌱🏦📦✂🎮🧠🏗️⚖📖☰🎙️✿🧠📦✴️☯🔑🧺🔋🎬📡🔁🎓♻️🧾🪙⛏️🦁⚙️]/g, '').trim().split(' ');
        
        if (words.length > 2) {
          // Multi-line label for longer names
          const line1 = words.slice(0, 2).join(' ');
          const line2 = words.slice(2).join(' ');
          ctx.fillText(line1, node.x, labelY);
          ctx.fillText(line2, node.x, labelY + 16);
        } else {
          ctx.fillText(words.join(' '), node.x, labelY);
        }

        // Tier label
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(node.tier, node.x, labelY + (words.length > 2 ? 32 : 16));
      }
    });
  }, [nodes, hoveredNode, selectedSector, viewMode, getTierColor]);

  // Draw network statistics panel
  const drawNetworkStats = useCallback((ctx: CanvasRenderingContext2D, config: VisualizationConfig) => {
    if (viewMode !== 'network') return;

    const panelX = config.width - 220;
    const panelY = 20;
    const panelWidth = 200;
    const panelHeight = 160;

    // Panel background with transparency
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    // Panel border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Panel title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#3B82F6';
    ctx.textAlign = 'left';
    ctx.fillText('Network Statistics', panelX + 15, panelY + 25);

    // Statistics
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';

    const stats = [
      `Connections: ${networkStats.totalConnections}`,
      `Avg per Sector: ${networkStats.avgConnections}`,
      `Density: ${networkStats.networkDensity}%`,
      `Max Connections: ${networkStats.maxConnections}`,
      `Isolated: ${networkStats.isolatedNodes}`
    ];

    stats.forEach((stat, index) => {
      ctx.fillText(stat, panelX + 15, panelY + 50 + (index * 20));
    });

    // Real-time indicator
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#10B981';
    const now = new Date().toLocaleTimeString();
    ctx.fillText(`Updated: ${now}`, panelX + 15, panelY + 150);
  }, [networkStats, viewMode]);

  // Main animation loop
  const animateNetwork = useCallback(() => {
    if (!drawingContext) return;

    const { ctx, config } = drawingContext;
    
    // Clear canvas
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

    // Draw network elements
    drawNetworkConnections(ctx, config);
    drawNetworkNodes(ctx, config);
    drawNetworkStats(ctx, config);

    // Continue animation
    drawingContext.animationFrame = requestAnimationFrame(animateNetwork);
  }, [drawingContext, drawNetworkConnections, drawNetworkNodes, drawNetworkStats]);

  // Start/stop animation based on view mode
  useEffect(() => {
    if (!drawingContext || viewMode !== 'network') {
      if (drawingContext?.animationFrame) {
        cancelAnimationFrame(drawingContext.animationFrame);
        drawingContext.animationFrame = undefined;
      }
      return;
    }

    drawingContext.animationFrame = requestAnimationFrame(animateNetwork);

    return () => {
      if (drawingContext.animationFrame) {
        cancelAnimationFrame(drawingContext.animationFrame);
      }
    };
  }, [drawingContext, animateNetwork, viewMode]);

  // Mouse interaction handlers
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingContext || viewMode !== 'network') return;

    const rect = drawingContext.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Node collision detection
    let hoveredNodeId: number | null = null;
    
    for (const node of nodes) {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
      );
      
      if (distance <= drawingContext.config.nodeRadius + 10) {
        hoveredNodeId = node.id;
        break;
      }
    }

    setHoveredNode(hoveredNodeId);
    
    // Update cursor
    drawingContext.canvas.style.cursor = hoveredNodeId ? 'pointer' : 'default';
  }, [drawingContext, nodes, viewMode]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingContext || !hoveredNode || viewMode !== 'network') return;

    setSelectedSector(hoveredNode);
    
    // Log sector analysis
    const selectedNode = nodes.find(n => n.id === hoveredNode);
    if (selectedNode) {
      const deps = getDependencyMap(hoveredNode);
      console.log('🎯 Sector Selected:', {
        sector: selectedNode.name,
        connections: selectedNode.connections,
        tier: selectedNode.tier,
        dependencies: deps.dependencies.map(d => d.name),
        dependents: deps.dependents.map(d => d.name)
      });
    }
  }, [drawingContext, hoveredNode, nodes, getDependencyMap, viewMode]);

  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedSector) return;
    
    // Center view on selected sector
    const selectedNode = nodes.find(n => n.id === selectedSector);
    if (selectedNode && drawingContext) {
      const { config } = drawingContext;
      selectedNode.x = config.centerX;
      selectedNode.y = config.centerY;
    }
  }, [selectedSector, nodes, drawingContext]);

  // Network analysis functions
  const analyzeNetworkCentrality = useCallback(() => {
    return calculateNetworkCentrality();
  }, [calculateNetworkCentrality]);

  const findCriticalPaths = useCallback(() => {
    const strongConnections = getStrongestConnections(15);
    return strongConnections.map(connection => {
      const sourceNode = nodes.find(n => n.id === connection.sourceId);
      const targetNode = nodes.find(n => n.id === connection.targetId);
      
      return {
        path: `${sourceNode?.name} → ${targetNode?.name}`,
        strength: connection.strength,
        type: connection.type,
        bidirectional: connection.bidirectional || false
      };
    });
  }, [nodes, getStrongestConnections]);

  // Export functions
  const exportAsImage = useCallback((format: 'png' | 'jpeg' = 'png') => {
    if (!drawingContext) return '';
    
    return drawingContext.canvas.toDataURL(`image/${format}`, 0.9);
  }, [drawingContext]);

  const exportAsData = useCallback((format: 'json' | 'csv' = 'json') => {
    if (format === 'json') {
      return JSON.stringify({
        nodes,
        relationships,
        networkStats,
        exportDate: new Date().toISOString()
      }, null, 2);
    } else {
      const csvData = ['Source,Target,Strength,Type,Bidirectional'];
      relationships.forEach(rel => {
        const source = nodes.find(n => n.id === rel.sourceId);
        const target = nodes.find(n => n.id === rel.targetId);
        csvData.push([
          source?.name || 'Unknown',
          target?.name || 'Unknown',
          rel.strength.toFixed(3),
          rel.type,
          (rel.bidirectional || false).toString()
        ].join(','));
      });
      return csvData.join('\n');
    }
  }, [nodes, relationships, networkStats]);

  // Configuration update
  const updateConfig = useCallback((newConfig: Partial<VisualizationConfig>) => {
    if (drawingContext) {
      Object.assign(drawingContext.config, newConfig);
    }
  }, [drawingContext]);

  // Select sector programmatically
  const selectSector = useCallback((sectorId: number | null) => {
    setSelectedSector(sectorId);
  }, []);

  return {
    // Core state
    canvasRef,
    isReady: !!drawingContext && isInitialized,
    
    // View management
    viewMode,
    setViewMode,
    
    // Interaction state
    selectedSector,
    hoveredNode,
    selectSector,
    
    // Event handlers
    onMouseMove: handleMouseMove,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    
    // Analysis functions
    analyzeNetworkCentrality,
    findCriticalPaths,
    
    // Export functions
    exportAsImage,
    exportAsData,
    
    // Configuration
    updateConfig,
    
    // Data access
    nodes,
    relationships,
    networkStats
  };
}