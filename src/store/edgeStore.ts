import { create } from 'zustand';
import { 
  Edge, 
  EdgeChange, 
  applyEdgeChanges, 
  Connection,
  addEdge 
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export interface EdgeData {
  label?: string;
  animated?: boolean;
  color?: string;
  thickness?: number;
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
        animated: true,
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
          ? { ...edge, data: { ...edge.data, ...data } }
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
  
  // Handle new connections from ReactFlow
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge({
        ...connection,
        type: 'custom',
        data: { animated: true },
      }, state.edges),
    }));
  },
})); 