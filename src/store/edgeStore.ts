import { create } from 'zustand';
import { 
  Edge, 
  EdgeChange, 
  applyEdgeChanges, 
  Connection,
  addEdge 
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export type LineStyle = 'solid' | 'dashed' | 'dotted';

export type EdgeAnimationType = 
  | 'none' 
  | 'flow' 
  | 'pulse'
  | 'dash'
  | 'dots'
  | 'rainbow'
  | 'laser'
  | 'traffic'
  | 'wave'
  | 'glow';

export type DotAnimationType = 
  | 'standard' 
  | 'pulse' 
  | 'fadeIn' 
  | 'grow' 
  | 'bounce' 
  | 'accelerate'
  | 'traffic';

export type EdgePattern = 
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'zigzag'
  | 'gradient';

export interface EdgeData {
  label?: string;
  animated?: boolean;
  color?: string;
  thickness?: number;
  showDot?: boolean;
  dotSize?: number;
  dotColor?: string;
  animationSpeed?: number;
  lineStyle?: LineStyle;
  animationType?: EdgeAnimationType;
  dotAnimationType?: DotAnimationType;
  dotCount?: number;
  dotSpacing?: number;
  startArrow?: boolean;
  endArrow?: boolean;
  bidirectional?: boolean;
  labelBgColor?: string;
  labelTextColor?: string;
  pattern?: EdgePattern;
  curvature?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  gradientColors?: string[];
  reverseAnimation?: boolean;
}

interface EdgeState {
  edges: Edge<EdgeData>[];
  selectedEdgeIds: string[];
  // Actions
  setEdges: (edges: Edge<EdgeData>[]) => void;
  addEdge: (connection: Connection, data?: EdgeData) => void;
  updateEdge: (edgeId: string, data: Partial<EdgeData>) => void;
  deleteEdges: (edgeIds: string[]) => void;
  deleteEdgesForNode: (nodeId: string) => void;
  setSelectedEdgeIds: (edgeIds: string[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

// Default edge properties - used for consistent edge creation
const DEFAULT_EDGE_DATA: EdgeData = {
  animated: false,
  animationType: 'none',
  pattern: 'solid',
  lineStyle: 'solid',
  thickness: 1,
  color: '#ffffff',
  showDot: true,
  dotCount: 1,
  dotSize: 7,
  dotColor: '#ffffff',
  dotAnimationType: 'standard',
  animationSpeed: 2,
  endArrow: false,
  startArrow: false,
  bidirectional: false,
  opacity: 1,
  curvature: 0.5,
  reverseAnimation: false,
  shadowBlur: 0
};

export const useEdgeStore = create<EdgeState>((set, get) => ({
  edges: [],
  selectedEdgeIds: [],
  
  // Set all edges
  setEdges: (edges) => set({ edges }),
  
  // Add a new edge
  addEdge: (connection, data = {}) => {
    const newEdge: Edge<EdgeData> = {
      id: uuidv4(),
      type: 'custom',
      source: connection.source || '',
      target: connection.target || '',
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      data: {
        ...DEFAULT_EDGE_DATA,
        ...data,
      },
    };
    
    set((state) => ({
      edges: [...state.edges, newEdge],
      selectedEdgeIds: [newEdge.id],
    }));
  },
  
  // Update an existing edge
  updateEdge: (edgeId, data) => {
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              data: {
                ...edge.data,
                ...data,
              },
            }
          : edge
      ),
    }));
  },
  
  // Delete edges
  deleteEdges: (edgeIds) => {
    set((state) => ({
      edges: state.edges.filter((edge) => !edgeIds.includes(edge.id)),
      selectedEdgeIds: state.selectedEdgeIds.filter((id) => !edgeIds.includes(id)),
    }));
  },
  
  // Delete edges connected to a node
  deleteEdgesForNode: (nodeId) => {
    set((state) => {
      const edgesToDelete = state.edges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );
      const edgeIdsToDelete = edgesToDelete.map((edge) => edge.id);
      
      return {
        edges: state.edges.filter((edge) => !edgeIdsToDelete.includes(edge.id)),
        selectedEdgeIds: state.selectedEdgeIds.filter(
          (id) => !edgeIdsToDelete.includes(id)
        ),
      };
    });
  },
  
  // Set selected edge IDs
  setSelectedEdgeIds: (edgeIds) => set({ selectedEdgeIds: edgeIds }),
  
  // Handle edge changes from ReactFlow
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as Edge<EdgeData>[],
    }));
    
    // Update selected edges
    const selectChanges = changes.filter((change) => change.type === 'select');
    if (selectChanges.length > 0) {
      const selectedEdges = get().edges.filter((edge) => edge.selected);
      set({ selectedEdgeIds: selectedEdges.map((edge) => edge.id) });
    }
  },
  
  // Handle connection
  onConnect: (connection) => {
    const newEdge: Edge<EdgeData> = {
      id: uuidv4(),
      ...connection,
      source: connection.source!,
      target: connection.target!,
      type: 'custom',
      data: DEFAULT_EDGE_DATA,
    };
    
    set((state) => ({
      edges: addEdge(newEdge, state.edges),
    }));
  },
})); 