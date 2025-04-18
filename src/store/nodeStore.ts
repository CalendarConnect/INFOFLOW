import { create } from 'zustand';
import { Node, NodeChange, applyNodeChanges, XYPosition } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export type NodeShape = 'rectangle' | 'rounded' | 'pill' | 'diamond' | 'hexagon' | 'circle' | 'parallelogram';

export interface NodeData {
  label: string;
  icon?: string;
  color?: string;
  glowEffect?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  width?: number;
  height?: number;
  shape?: NodeShape;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  textColor?: string;
  backgroundColor?: string;
  opacity?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  animation?: 'none' | 'pulse' | 'bounce' | 'shake' | 'wiggle';
  animationDuration?: number;
  iconSize?: number;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

export interface HeaderNodeData {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: 'sans' | 'serif' | 'mono';
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  opacity?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  width?: number;
}

// Union type for all node data types
export type AllNodeData = NodeData | HeaderNodeData;

// Type guard to check if a node is a header node
export function isHeaderNodeData(data: AllNodeData): data is HeaderNodeData {
  return 'text' in data && 'level' in data;
}

interface NodeState {
  nodes: Node<AllNodeData>[];
  selectedNodeIds: string[];
  // Actions
  setNodes: (nodes: Node<AllNodeData>[]) => void;
  addNode: (nodeData: AllNodeData, position: XYPosition) => void;
  updateNode: (nodeId: string, data: Partial<AllNodeData>) => void;
  duplicateNode: (nodeId: string, offsetPosition?: XYPosition) => void;
  deleteNodes: (nodeIds: string[]) => void;
  setSelectedNodeIds: (nodeIds: string[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  addHeaderNode: (headerData: HeaderNodeData, position: XYPosition) => void;
}

export const useNodeStore = create<NodeState>((set, get) => ({
  nodes: [],
  selectedNodeIds: [],
  
  // Set all nodes
  setNodes: (nodes) => set({ nodes }),
  
  // Add a new node
  addNode: (nodeData, position) => {
    // Determine the node type based on the data structure
    const nodeType = isHeaderNodeData(nodeData) ? 'header' : 'custom';
    
    const newNode: Node<AllNodeData> = {
      id: uuidv4(),
      type: nodeType,
      position,
      data: nodeData,
    };
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeIds: [newNode.id],
    }));
  },
  
  // Helper method for adding header nodes specifically
  addHeaderNode: (headerData, position) => {
    const newNode: Node<HeaderNodeData> = {
      id: uuidv4(),
      type: 'header',
      position,
      data: {
        // Default values
        text: headerData.text || 'Header Text',
        level: headerData.level || 'h1',
        fontSize: headerData.fontSize,
        fontWeight: headerData.fontWeight || 'semibold',
        fontFamily: headerData.fontFamily || 'sans',
        color: headerData.color || '#ffffff',
        alignment: headerData.alignment || 'left',
        backgroundColor: headerData.backgroundColor,
        opacity: headerData.opacity !== undefined ? headerData.opacity : 1,
        shadow: headerData.shadow || 'none',
        width: headerData.width || 320,
      },
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
    
    const newNode: Node<AllNodeData> = {
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
      nodes: applyNodeChanges(changes, state.nodes) as Node<AllNodeData>[],
    }));
    
    // Update selected nodes
    const selectChanges = changes.filter((change) => change.type === 'select');
    if (selectChanges.length > 0) {
      const selectedNodes = get().nodes.filter((node) => node.selected);
      set({ selectedNodeIds: selectedNodes.map((node) => node.id) });
    }
  },
})); 