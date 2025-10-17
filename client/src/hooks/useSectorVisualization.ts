import { useRef, useState, useEffect, useCallback, RefObject } from 'react';
import { Sector, SectorRelationship } from './useSectorMappingData';

export type ViewMode = 'network' | 'matrix' | 'hierarchy';

export interface VisualizationConfig {
  width: number;
  height: number;
  nodeRadius: number;
  showLabels: boolean;
  animationSpeed: number;
}

interface DrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: VisualizationConfig;
  animationFrame?: number;
}

const DEFAULT_CONFIG: VisualizationConfig = {
  width: 800,
  height: 600,
  nodeRadius: 20,
  showLabels: true,
  animationSpeed: 1,
};

const CONNECTION_COLORS = {
  integration: '#10B981',
  synergy: '#3B82F6',
  dependency: '#F59E0B',
  collaboration: '#8B5CF6',
};

export function useSectorVisualization(
  nodes: Sector[],
  relationships: SectorRelationship[],
  config: Partial<VisualizationConfig> = {}
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingContext, setDrawingContext] = useState<DrawingContext | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  // Initialize canvas with high DPI support
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

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

    const context: DrawingContext = {
      canvas,
      ctx,
      config: {
        ...fullConfig,
        width: rect.width,
        height: rect.height,
      },
    };

    setDrawingContext(context);
    setIsReady(true);

    return () => {
      if (context.animationFrame) {
        cancelAnimationFrame(context.animationFrame);
      }
    };
  }, [canvasRef.current, nodes.length]);

  // Calculate node positions in circle layout
  const calculateNodePositions = useCallback(() => {
    if (!drawingContext || nodes.length === 0) return [];

    const { width, height } = drawingContext.config;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [drawingContext, nodes]);

  // Draw network connections
  const drawNetworkConnections = useCallback(
    (ctx: CanvasRenderingContext2D, nodePositions: any[]) => {
      relationships.forEach(relationship => {
        const sourceNode = nodePositions.find(n => n.id === relationship.sourceId);
        const targetNode = nodePositions.find(n => n.id === relationship.targetId);

        if (!sourceNode || !targetNode) return;

        // Gradient connection lines
        const gradient = ctx.createLinearGradient(
          sourceNode.x,
          sourceNode.y,
          targetNode.x,
          targetNode.y
        );

        const color = CONNECTION_COLORS[relationship.relationshipType] || '#6B7280';
        gradient.addColorStop(0, color + '80');
        gradient.addColorStop(1, color + '20');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, relationship.strength * 4);

        // Curved connection for visual elegance
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);

        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        const offset = relationship.strength * 20;

        ctx.quadraticCurveTo(midX + offset, midY - offset, targetNode.x, targetNode.y);
        ctx.stroke();
      });
    },
    [relationships]
  );

  // Draw network nodes
  const drawNetworkNodes = useCallback(
    (ctx: CanvasRenderingContext2D, nodePositions: any[]) => {
      const { nodeRadius, showLabels } = drawingContext?.config || DEFAULT_CONFIG;

      nodePositions.forEach(node => {
        const isSelected = selectedSector === node.id;
        const isHovered = hoveredNode === node.id;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);

        if (isSelected) {
          ctx.fillStyle = '#3B82F6';
          ctx.strokeStyle = '#1D4ED8';
          ctx.lineWidth = 3;
        } else if (isHovered) {
          ctx.fillStyle = '#60A5FA';
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
        } else {
          ctx.fillStyle = '#E5E7EB';
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 1;
        }

        ctx.fill();
        ctx.stroke();

        // Node emoji
        ctx.font = `${nodeRadius}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(node.glyph || '🔷', node.x, node.y);

        // Node label
        if (showLabels && (isSelected || isHovered)) {
          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#1F2937';
          ctx.fillText(node.sectorName, node.x, node.y + nodeRadius + 15);
        }
      });
    },
    [selectedSector, hoveredNode, drawingContext]
  );

  // Draw network stats overlay
  const drawNetworkStats = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const stats = {
        nodes: nodes.length,
        connections: relationships.length,
      };

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#6B7280';
      ctx.textAlign = 'left';
      ctx.fillText(`Sectors: ${stats.nodes} | Connections: ${stats.connections}`, 20, 30);
    },
    [nodes.length, relationships.length]
  );

  // Animation loop
  const animateNetwork = useCallback(() => {
    if (!drawingContext) return;

    const { ctx, config } = drawingContext;
    const nodePositions = calculateNodePositions();

    // Clear and redraw
    ctx.clearRect(0, 0, config.width, config.height);

    // Background gradient
    const bgGradient = ctx.createRadialGradient(
      config.width / 2,
      config.height / 2,
      0,
      config.width / 2,
      config.height / 2,
      Math.max(config.width, config.height) / 2
    );
    bgGradient.addColorStop(0, '#F8FAFC');
    bgGradient.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, config.width, config.height);

    // Render network elements
    drawNetworkConnections(ctx, nodePositions);
    drawNetworkNodes(ctx, nodePositions);
    drawNetworkStats(ctx);

    // Continue animation loop
    drawingContext.animationFrame = requestAnimationFrame(animateNetwork);
  }, [drawingContext, calculateNodePositions, drawNetworkConnections, drawNetworkNodes, drawNetworkStats]);

  // Start animation when ready
  useEffect(() => {
    if (isReady && viewMode === 'network') {
      animateNetwork();
    }

    return () => {
      if (drawingContext?.animationFrame) {
        cancelAnimationFrame(drawingContext.animationFrame);
      }
    };
  }, [isReady, viewMode, animateNetwork]);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!drawingContext) return;

      const rect = drawingContext.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const nodePositions = calculateNodePositions();
      const { nodeRadius } = drawingContext.config;

      let hoveredNodeId: string | null = null;

      for (const node of nodePositions) {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));

        if (distance <= nodeRadius + 5) {
          hoveredNodeId = node.id;
          break;
        }
      }

      setHoveredNode(hoveredNodeId);
      drawingContext.canvas.style.cursor = hoveredNodeId ? 'pointer' : 'default';
    },
    [drawingContext, calculateNodePositions]
  );

  // Handle click
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (hoveredNode) {
        setSelectedSector(hoveredNode === selectedSector ? null : hoveredNode);
      }
    },
    [hoveredNode, selectedSector]
  );

  // Export as image
  const exportAsImage = useCallback(
    (format: 'png' | 'jpeg' = 'png'): string => {
      if (!canvasRef.current) return '';
      return canvasRef.current.toDataURL(`image/${format}`);
    },
    [canvasRef.current]
  );

  // Export as data
  const exportAsData = useCallback(
    (format: 'json' | 'csv' = 'json'): string => {
      if (format === 'json') {
        return JSON.stringify({
          nodes,
          relationships,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      } else {
        // CSV format
        let csv = 'Source,Target,Strength,Type\n';
        relationships.forEach(r => {
          const source = nodes.find(n => n.id === r.sourceId);
          const target = nodes.find(n => n.id === r.targetId);
          csv += `${source?.sectorName || r.sourceId},${target?.sectorName || r.targetId},${r.strength},${r.relationshipType}\n`;
        });
        return csv;
      }
    },
    [nodes, relationships]
  );

  return {
    // Canvas and Rendering
    canvasRef,
    isReady,

    // View Management
    viewMode,
    setViewMode,

    // Interaction State
    selectedSector,
    hoveredNode,
    selectSector: setSelectedSector,

    // Event Handlers
    onMouseMove: handleMouseMove,
    onClick: handleClick,

    // Export Functions
    exportAsImage,
    exportAsData,

    // Configuration
    updateConfig: (newConfig: Partial<VisualizationConfig>) => {
      if (drawingContext) {
        setDrawingContext({
          ...drawingContext,
          config: { ...drawingContext.config, ...newConfig },
        });
      }
    },
  };
}
