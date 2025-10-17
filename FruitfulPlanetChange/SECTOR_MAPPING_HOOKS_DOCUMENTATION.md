# Sector Mapping Hooks Documentation

## Primary Hooks Overview

The Interactive Sector Mapping System utilizes two core hooks that work in seamless harmony to provide comprehensive data management and visualization capabilities.

## Hook 1: `useSectorMappingData`

### Purpose
Primary data management and storage hook responsible for all sector relationship operations, caching, and network analysis.

### Core Responsibilities
- **Data Persistence**: Manage sector relationships in PostgreSQL database
- **Real-time Sync**: 3-second interval synchronization with backend
- **Network Analysis**: Calculate statistics, density, and connection patterns
- **Relationship Intelligence**: Generate smart connections based on sector metadata

### Hook Signature
```typescript
function useSectorMappingData(): {
  // Core Data
  relationships: SectorRelationship[];
  nodes: SectorNode[];
  networkStats: NetworkStats;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Storage Operations
  storeRelationship: (relationship: SectorRelationship) => Promise<void>;
  updateNode: (node: SectorNode) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  
  // Analysis Functions
  getDependencyMap: (sectorId: number) => { dependencies: SectorNode[], dependents: SectorNode[] };
  getStrongestConnections: (limit?: number) => SectorRelationship[];
  calculateNetworkCentrality: () => Array<{ node: SectorNode, centrality: number }>;
  
  // Matrix Operations
  getRelationshipMatrix: () => RelationshipMatrix;
  getHierarchyData: () => { [tier: string]: SectorNode[] };
  
  // Cache Management
  refreshCache: () => Promise<void>;
  clearCache: () => void;
}
```

### Implementation Details

#### Data Initialization
```typescript
const { data: sectors = [], isLoading: sectorsLoading } = useQuery({
  queryKey: ['/api/sectors'],
  staleTime: 1000 * 60 * 5, // 5 minutes
});

useEffect(() => {
  if (sectors.length > 0 && !isInitialized) {
    initializeStorageService();
  }
}, [sectors, isInitialized]);
```

#### Storage Service Integration
```typescript
const [storageService] = useState(() => SectorRelationshipStorageService.getInstance());

const storeRelationship = useMutation({
  mutationFn: async (relationship: SectorRelationship) => {
    await storageService.storeRelationship(relationship);
    return relationship;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sector-relationships'] });
  }
});
```

#### Network Statistics Calculation
```typescript
const networkStats = useMemo(() => {
  const stats = storageService.getStats();
  return {
    totalConnections: relationships.length,
    avgConnections: relationships.length / nodes.length,
    networkDensity: (relationships.length / (nodes.length * (nodes.length - 1) / 2)) * 100,
    maxConnections: Math.max(...nodes.map(n => n.connections)),
    isolatedNodes: nodes.filter(n => n.connections === 0).length
  };
}, [relationships, nodes]);
```

### Performance Optimizations
- **Singleton Pattern**: Single storage service instance across application
- **Memoized Calculations**: Network statistics cached until data changes
- **Batch Operations**: Multiple relationship updates in single transaction
- **Smart Invalidation**: Cache updates only when necessary

---

## Hook 2: `useSectorVisualization`

### Purpose
Visualization management hook handling canvas rendering, user interactions, and view mode switching for the sector mapping interface.

### Core Responsibilities
- **Canvas Management**: High DPI canvas setup and rendering
- **Interactive Controls**: Node selection, hover effects, and drag operations
- **Multi-view Support**: Network graph, matrix view, and hierarchy visualization
- **Performance Optimization**: 60 FPS rendering with efficient draw cycles

### Hook Signature
```typescript
function useSectorVisualization(config?: VisualizationConfig): {
  // Canvas and Rendering
  canvasRef: RefObject<HTMLCanvasElement>;
  isReady: boolean;
  
  // View Management
  viewMode: 'network' | 'matrix' | 'hierarchy';
  setViewMode: (mode: ViewMode) => void;
  
  // Interaction State
  selectedSector: number | null;
  hoveredNode: number | null;
  selectSector: (id: number | null) => void;
  
  // Event Handlers
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  
  // Analysis Functions
  analyzeNetworkCentrality: () => Array<{ node: SectorNode, centrality: number }>;
  findCriticalPaths: () => Array<{ path: string, strength: number, type: string }>;
  
  // Export Functions
  exportAsImage: (format: 'png' | 'jpeg') => string;
  exportAsData: (format: 'json' | 'csv') => string;
  
  // Configuration
  updateConfig: (newConfig: Partial<VisualizationConfig>) => void;
}
```

### Implementation Details

#### Canvas Initialization
```typescript
useEffect(() => {
  if (!canvasRef.current || !isInitialized) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  // High DPI setup
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  setDrawingContext({ canvas, ctx, config: defaultConfig });
}, [isInitialized, canvasRef.current]);
```

#### Network Rendering Engine
```typescript
const drawNetworkConnections = useCallback((ctx: CanvasRenderingContext2D) => {
  relationships.forEach(relationship => {
    const sourceNode = nodes.find(n => n.id === relationship.sourceId);
    const targetNode = nodes.find(n => n.id === relationship.targetId);
    
    if (!sourceNode || !targetNode) return;

    // Gradient connection lines
    const gradient = ctx.createLinearGradient(
      sourceNode.x, sourceNode.y,
      targetNode.x, targetNode.y
    );
    gradient.addColorStop(0, getConnectionColor(relationship.type) + '80');
    gradient.addColorStop(1, getConnectionColor(relationship.type) + '20');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, relationship.strength * 4);
    
    // Curved connection for visual elegance
    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    
    const midX = (sourceNode.x + targetNode.x) / 2;
    const midY = (sourceNode.y + targetNode.y) / 2;
    const offset = relationship.strength * 20;
    
    ctx.quadraticCurveTo(
      midX + offset, midY - offset,
      targetNode.x, targetNode.y
    );
    
    ctx.stroke();
  });
}, [nodes, relationships]);
```

#### Interaction Management
```typescript
const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
  if (!drawingContext) return;

  const rect = drawingContext.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Node collision detection
  let hoveredNodeId: number | null = null;
  
  for (const node of nodes) {
    const distance = Math.sqrt(
      Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
    );
    
    if (distance <= CONFIG.nodeRadius + 5) {
      hoveredNodeId = node.id;
      break;
    }
  }

  setHoveredNode(hoveredNodeId);
  drawingContext.canvas.style.cursor = hoveredNodeId ? 'pointer' : 'default';
}, [drawingContext, nodes]);
```

### Animation System
```typescript
const animateNetwork = useCallback(() => {
  if (!drawingContext) return;

  const { ctx, config } = drawingContext;
  
  // Clear and redraw
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

  // Render network elements
  drawNetworkConnections(ctx);
  drawNetworkNodes(ctx);
  drawNetworkStats(ctx);

  // Continue animation loop
  drawingContext.animationFrame = requestAnimationFrame(animateNetwork);
}, [drawingContext, drawNetworkConnections, drawNetworkNodes, drawNetworkStats]);
```

---

## Hook Integration Pattern

### Combined Usage
```typescript
function InteractiveSectorMapping() {
  // Data management
  const {
    relationships,
    nodes,
    networkStats,
    storeRelationship,
    getDependencyMap
  } = useSectorMappingData();
  
  // Visualization
  const {
    canvasRef,
    viewMode,
    selectedSector,
    setViewMode,
    selectSector,
    onMouseMove,
    onClick
  } = useSectorVisualization({
    width: 800,
    height: 600,
    showLabels: true
  });

  return (
    <div className="sector-mapping-container">
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onClick={onClick}
        className="sector-network-canvas"
      />
      
      {selectedSector && (
        <SectorDetailsPanel
          sector={nodes.find(n => n.id === selectedSector)}
          dependencies={getDependencyMap(selectedSector)}
        />
      )}
    </div>
  );
}
```

### Data Flow Architecture
```
┌─────────────────────┐    ┌──────────────────────┐
│ useSectorMappingData│────│useSectorVisualization│
└─────────────────────┘    └──────────────────────┘
            │                          │
            ▼                          ▼
    ┌───────────────┐            ┌─────────────┐
    │ Storage Service│            │Canvas Context│
    └───────────────┘            └─────────────┘
            │                          │
            ▼                          ▼
    ┌───────────────┐            ┌─────────────┐
    │  PostgreSQL   │            │  Rendering  │
    │   Database    │            │   Engine    │
    └───────────────┘            └─────────────┘
```

## Performance Benchmarks

### Hook Performance Targets
- **Data Hook**: <50ms for relationship operations
- **Visualization Hook**: 60 FPS canvas rendering
- **Memory Usage**: <100MB total for 48 sectors + 710 connections
- **Network Requests**: <5 API calls per user interaction

### Optimization Strategies
- **Debounced Updates**: Mouse events debounced to 16ms (60 FPS)
- **Memoized Calculations**: Heavy computations cached with useMemo
- **Batch Operations**: Multiple database operations grouped
- **Canvas Optimization**: Only redraw when data or view changes

---

*These hooks form the backbone of the Interactive Sector Mapping System, providing both robust data management and smooth user experience through efficient visualization rendering.*