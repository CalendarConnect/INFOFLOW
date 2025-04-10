'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  Edge,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import custom node and edge types
import BaseNode from './nodes/BaseNode';
import CustomEdge from './edges/BaseEdge';

// Import state stores
import { useNodeStore } from '@/store/nodeStore';
import { useEdgeStore } from '@/store/edgeStore';
import { useCanvasStore } from '@/store/canvasStore';
import { NodeData } from '@/store/nodeStore';
import { EdgeData } from '@/store/edgeStore';

// Define the node and edge types
const nodeTypes = {
  base: BaseNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function FlowCanvasContent() {
  // State from stores
  const { 
    nodes, 
    onNodesChange, 
    setSelectedNodeIds 
  } = useNodeStore();
  
  const { 
    edges, 
    onEdgesChange, 
    onConnect, 
    setSelectedEdgeIds 
  } = useEdgeStore();
  
  const { 
    viewport, 
    setViewport, 
    canvasSettings, 
    isGridVisible, 
    isMinimapVisible 
  } = useCanvasStore();

  // Handle selection changes
  const onSelectionChange = useCallback(({ nodes, edges }: OnSelectionChangeParams) => {
    setSelectedNodeIds(nodes.map((node: Node) => node.id));
    setSelectedEdgeIds(edges.map((edge: Edge) => edge.id));
  }, [setSelectedNodeIds, setSelectedEdgeIds]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'custom' }}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.1}
        maxZoom={2}
        onMove={(_, viewport) => setViewport(viewport)}
        fitView
        attributionPosition="bottom-right"
        className="dark:bg-gray-900"
      >
        {isGridVisible && (
          <Background 
            color={canvasSettings.grid ? '#aaa' : 'transparent'} 
            gap={canvasSettings.gridSize} 
            size={canvasSettings.gridSize * 2}
          />
        )}
        
        <Controls 
          showInteractive={true} 
          className="bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700"
        />
        
        {isMinimapVisible && (
          <MiniMap
            className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
            nodeColor="var(--color-primary)"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        )}
      </ReactFlow>
    </div>
  );
}

interface FlowCanvasProps {
  initialNodes?: Node<NodeData>[];
  initialEdges?: Edge<EdgeData>[];
}

export function FlowCanvas({ initialNodes = [], initialEdges = [] }: FlowCanvasProps) {
  const setNodes = useNodeStore((state) => state.setNodes);
  const setEdges = useEdgeStore((state) => state.setEdges);
  
  // Initialize with provided data
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
    
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  return (
    <ReactFlowProvider>
      <FlowCanvasContent />
    </ReactFlowProvider>
  );
} 