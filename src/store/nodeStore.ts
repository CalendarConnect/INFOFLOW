import { create } from 'zustand';
import { Node, NodeChange, applyNodeChanges, XYPosition } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export interface NodeData {
  label: string;
  icon?: string;
  color?: string;
}

interface NodeState {
  nodes: Node<NodeData>[];
  selectedNodeIds: string[];
  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  addNode: (nodeData: NodeData, position: XYPosition) => void;
  updateNode: (nodeId: string, data: Partial<NodeData>) => void;
  duplicateNode: (nodeId: string, offsetPosition?: XYPosition) => void;
  deleteNodes: (nodeIds: string[]) => void;
  setSelectedNodeIds: (nodeIds: string[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
}

export const useNodeStore = create<NodeState>((set, get) => ({
  nodes: [],
  selectedNodeIds: [],
  
  // Set all nodes
  setNodes: (nodes) => set({ nodes }),
  
  // Add a new node
  addNode: (nodeData, position) => {
    const newNode: Node<NodeData> = {
      id: uuidv4(),
      type: 'base',
      position,
      data: nodeData,
    };
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeIds: [newNode.id],
    }));
  },
  
  // Update an existing node
  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    }));
  },
  
  // Duplicate a node
  duplicateNode: (nodeId, offsetPosition = { x: 50, y: 50 }) => {
    const { nodes } = get();
    const nodeToClone = nodes.find((node) => node.id === nodeId);
    
    if (!nodeToClone) return;
    
    const newNode: Node<NodeData> = {
      id: uuidv4(),
      type: nodeToClone.type,
      position: {
        x: nodeToClone.position.x + offsetPosition.x,
        y: nodeToClone.position.y + offsetPosition.y,
      },
      data: { ...nodeToClone.data },
    };
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeIds: [newNode.id],
    }));
  },
  
  // Delete nodes
  deleteNodes: (nodeIds) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => !nodeIds.includes(node.id)),
      selectedNodeIds: state.selectedNodeIds.filter((id) => !nodeIds.includes(id)),
    }));
  },
  
  // Set selected node IDs
  setSelectedNodeIds: (nodeIds) => set({ selectedNodeIds: nodeIds }),
  
  // Handle node changes from ReactFlow
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<NodeData>[],
    }));
    
    // Update selected nodes
    const selectChanges = changes.filter((change) => change.type === 'select');
    if (selectChanges.length > 0) {
      const selectedNodes = get().nodes.filter((node) => node.selected);
      set({ selectedNodeIds: selectedNodes.map((node) => node.id) });
    }
  },
})); 