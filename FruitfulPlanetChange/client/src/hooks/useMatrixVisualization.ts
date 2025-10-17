import { useState, useCallback, useMemo } from 'react';
import { useSectorRelationshipStorage } from './useSectorRelationshipStorage';

interface MatrixCell {
  sourceId: number;
  targetId: number;
  strength: number;
  type: string;
  color: string;
  description: string;
  bidirectional: boolean;
}

interface MatrixVisualizationState {
  selectedRow: number | null;
  selectedColumn: number | null;
  filterType: string;
  sortBy: 'name' | 'connections' | 'tier';
  sortOrder: 'asc' | 'desc';
  showEmptyCells: boolean;
  highlightBidirectional: boolean;
}

// Matrix visualization hook with focused respect and precise handling
export function useMatrixVisualization() {
  const {
    nodes,
    relationships,
    relationshipMatrix,
    networkStats,
    isInitialized,
    getDependencyMap
  } = useSectorRelationshipStorage();

  const [visualizationState, setVisualizationState] = useState<MatrixVisualizationState>({
    selectedRow: null,
    selectedColumn: null,
    filterType: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    showEmptyCells: true,
    highlightBidirectional: true
  });

  // Matrix cell type color mapping with confident visual hierarchy
  const getRelationshipColor = useCallback((type: string, strength: number): string => {
    const baseColors = {
      integration: '#10B981',  // Green
      synergy: '#3B82F6',      // Blue  
      dependency: '#F59E0B',   // Yellow
      collaboration: '#8B5CF6' // Purple
    };

    const baseColor = baseColors[type] || '#6B7280';
    const opacity = Math.max(0.3, strength);
    
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  }, []);

  // Generate comprehensive matrix data with deep analysis
  const matrixData = useMemo(() => {
    if (!isInitialized || nodes.length === 0) return [];

    const sortedNodes = [...nodes].sort((a, b) => {
      switch (visualizationState.sortBy) {
        case 'connections':
          return visualizationState.sortOrder === 'asc' 
            ? a.connections - b.connections
            : b.connections - a.connections;
        case 'tier':
          const tierOrder = { 'Enterprise': 5, 'Premium': 4, 'Professional': 3, 'Standard': 2, 'Basic': 1 };
          const aOrder = tierOrder[a.tier] || 0;
          const bOrder = tierOrder[b.tier] || 0;
          return visualizationState.sortOrder === 'asc' ? aOrder - bOrder : bOrder - aOrder;
        default: // name
          return visualizationState.sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
      }
    });

    const matrix: MatrixCell[][] = [];

    sortedNodes.forEach((rowNode, rowIndex) => {
      const row: MatrixCell[] = [];
      
      sortedNodes.forEach((colNode, colIndex) => {
        const relationship = relationships.find(
          rel => (rel.sourceId === rowNode.id && rel.targetId === colNode.id) ||
                 (rel.targetId === rowNode.id && rel.sourceId === colNode.id)
        );

        const matrixEntry = relationshipMatrix[rowNode.id.toString()]?.[colNode.id.toString()];
        
        if (relationship || matrixEntry) {
          const strength = relationship?.strength || matrixEntry?.strength || 0;
          const type = relationship?.type || matrixEntry?.type || 'none';
          const bidirectional = relationship?.bidirectional || matrixEntry?.bidirectional || false;
          
          // Filter by relationship type
          if (visualizationState.filterType !== 'all' && type !== visualizationState.filterType) {
            if (visualizationState.showEmptyCells) {
              row.push({
                sourceId: rowNode.id,
                targetId: colNode.id,
                strength: 0,
                type: 'none',
                color: '#F3F4F6',
                description: 'No relationship',
                bidirectional: false
              });
            }
            return;
          }

          row.push({
            sourceId: rowNode.id,
            targetId: colNode.id,
            strength,
            type,
            color: getRelationshipColor(type, strength),
            description: relationship?.description || 'Direct relationship',
            bidirectional
          });
        } else if (visualizationState.showEmptyCells) {
          row.push({
            sourceId: rowNode.id,
            targetId: colNode.id,
            strength: 0,
            type: 'none',
            color: rowNode.id === colNode.id ? '#E5E7EB' : '#F3F4F6',
            description: rowNode.id === colNode.id ? 'Self-reference' : 'No relationship',
            bidirectional: false
          });
        }
      });
      
      if (row.length > 0) {
        matrix.push(row);
      }
    });

    return {
      matrix,
      nodes: sortedNodes,
      totalCells: sortedNodes.length * sortedNodes.length,
      activeCells: matrix.flat().filter(cell => cell.strength > 0).length
    };
  }, [nodes, relationships, relationshipMatrix, visualizationState, isInitialized, getRelationshipColor]);

  // Matrix interaction handlers with respectful responsiveness
  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    const cell = matrixData.matrix[rowIndex]?.[colIndex];
    if (!cell) return;

    setVisualizationState(prev => ({
      ...prev,
      selectedRow: prev.selectedRow === rowIndex ? null : rowIndex,
      selectedColumn: prev.selectedColumn === colIndex ? null : colIndex
    }));

    // Provide detailed analysis of selected relationship
    if (cell.strength > 0) {
      const sourceNode = nodes.find(n => n.id === cell.sourceId);
      const targetNode = nodes.find(n => n.id === cell.targetId);
      
      console.log('🔍 Matrix Cell Analysis:', {
        relationship: `${sourceNode?.name} ↔ ${targetNode?.name}`,
        strength: cell.strength,
        type: cell.type,
        bidirectional: cell.bidirectional,
        description: cell.description
      });
    }
  }, [matrixData.matrix, nodes]);

  const handleCellHover = useCallback((rowIndex: number, colIndex: number) => {
    // Highlight row and column on hover
    setVisualizationState(prev => ({
      ...prev,
      selectedRow: rowIndex,
      selectedColumn: colIndex
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      selectedRow: null,
      selectedColumn: null
    }));
  }, []);

  // Matrix analysis functions with confident insights
  const getRowAnalysis = useCallback((rowIndex: number) => {
    if (!matrixData.matrix[rowIndex]) return null;

    const row = matrixData.matrix[rowIndex];
    const activeConnections = row.filter(cell => cell.strength > 0);
    const strongConnections = activeConnections.filter(cell => cell.strength > 0.7);
    const relationshipTypes = [...new Set(activeConnections.map(cell => cell.type))];
    
    const sourceNode = nodes.find(n => n.id === row[0]?.sourceId);
    
    return {
      node: sourceNode,
      totalConnections: activeConnections.length,
      strongConnections: strongConnections.length,
      avgStrength: activeConnections.length > 0 
        ? activeConnections.reduce((sum, cell) => sum + cell.strength, 0) / activeConnections.length 
        : 0,
      relationshipTypes,
      bidirectionalCount: activeConnections.filter(cell => cell.bidirectional).length
    };
  }, [matrixData.matrix, nodes]);

  const getColumnAnalysis = useCallback((colIndex: number) => {
    if (!matrixData.matrix[0] || !matrixData.matrix[0][colIndex]) return null;

    const column = matrixData.matrix.map(row => row[colIndex]).filter(Boolean);
    const activeConnections = column.filter(cell => cell.strength > 0);
    const strongConnections = activeConnections.filter(cell => cell.strength > 0.7);
    
    const targetNode = nodes.find(n => n.id === column[0]?.targetId);
    
    return {
      node: targetNode,
      totalConnections: activeConnections.length,
      strongConnections: strongConnections.length,
      avgStrength: activeConnections.length > 0
        ? activeConnections.reduce((sum, cell) => sum + cell.strength, 0) / activeConnections.length
        : 0,
      bidirectionalCount: activeConnections.filter(cell => cell.bidirectional).length
    };
  }, [matrixData.matrix, nodes]);

  const getMatrixStatistics = useCallback(() => {
    const allCells = matrixData.matrix.flat();
    const activeCells = allCells.filter(cell => cell.strength > 0);
    const bidirectionalCells = activeCells.filter(cell => cell.bidirectional);
    
    const relationshipTypeCounts = activeCells.reduce((counts, cell) => {
      counts[cell.type] = (counts[cell.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const strengthDistribution = {
      weak: activeCells.filter(cell => cell.strength <= 0.3).length,
      medium: activeCells.filter(cell => cell.strength > 0.3 && cell.strength <= 0.7).length,
      strong: activeCells.filter(cell => cell.strength > 0.7).length
    };

    return {
      totalCells: allCells.length,
      activeCells: activeCells.length,
      bidirectionalCells: bidirectionalCells.length,
      density: allCells.length > 0 ? (activeCells.length / allCells.length) * 100 : 0,
      relationshipTypeCounts,
      strengthDistribution,
      avgStrength: activeCells.length > 0 
        ? activeCells.reduce((sum, cell) => sum + cell.strength, 0) / activeCells.length 
        : 0
    };
  }, [matrixData.matrix]);

  // Matrix filtering and sorting with respectful organization
  const updateFilter = useCallback((filterType: string) => {
    setVisualizationState(prev => ({
      ...prev,
      filterType,
      selectedRow: null,
      selectedColumn: null
    }));
  }, []);

  const updateSort = useCallback((sortBy: 'name' | 'connections' | 'tier', sortOrder?: 'asc' | 'desc') => {
    setVisualizationState(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder || (prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'),
      selectedRow: null,
      selectedColumn: null
    }));
  }, []);

  const toggleEmptyCells = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      showEmptyCells: !prev.showEmptyCells
    }));
  }, []);

  const toggleBidirectionalHighlight = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      highlightBidirectional: !prev.highlightBidirectional
    }));
  }, []);

  // Export matrix data with confident formatting
  const exportMatrixData = useCallback(() => {
    const csvData = ['Source,Target,Strength,Type,Bidirectional,Description'];
    
    matrixData.matrix.flat().forEach(cell => {
      if (cell.strength > 0) {
        const sourceNode = nodes.find(n => n.id === cell.sourceId);
        const targetNode = nodes.find(n => n.id === cell.targetId);
        
        csvData.push([
          sourceNode?.name || 'Unknown',
          targetNode?.name || 'Unknown',
          cell.strength.toFixed(3),
          cell.type,
          cell.bidirectional.toString(),
          `"${cell.description}"`
        ].join(','));
      }
    });

    return csvData.join('\n');
  }, [matrixData.matrix, nodes]);

  return {
    // Core matrix data
    matrixData: matrixData.matrix,
    nodes: matrixData.nodes,
    isReady: isInitialized && matrixData.matrix.length > 0,
    
    // Visualization state
    visualizationState,
    
    // Interaction handlers
    onCellClick: handleCellClick,
    onCellHover: handleCellHover,
    onClearSelection: clearSelection,
    
    // Analysis functions
    getRowAnalysis,
    getColumnAnalysis,
    getMatrixStatistics,
    
    // Configuration functions
    updateFilter,
    updateSort,
    toggleEmptyCells,
    toggleBidirectionalHighlight,
    
    // Data export
    exportMatrixData,
    
    // Network statistics
    networkStats
  };
}