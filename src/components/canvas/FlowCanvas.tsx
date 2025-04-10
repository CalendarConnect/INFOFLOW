'use client';

import React, { useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNodeStore } from '@/store/nodeStore';
import { useEdgeStore } from '@/store/edgeStore';
import { useCanvasStore } from '@/store/canvasStore';
import CustomNode from './nodes/BaseNode';
import CustomEdge from './edges/BaseEdge';

// Define node types
const nodeTypes = {
  base: CustomNode,
  custom: CustomNode,
};

// Define edge types
const edgeTypes = {
  custom: CustomEdge,
};

export function FlowCanvas() {
  // Access to node and edge stores separately
  const { nodes, onNodesChange, setSelectedNodeIds } = useNodeStore();
  const { edges, onEdgesChange, onConnect, setSelectedEdgeIds } = useEdgeStore();
  
  // Canvas settings from store
  const { 
    viewport, 
    setViewport, 
    canvasSettings
  } = useCanvasStore();
  
  // Reference to the flow wrapper div
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Handle node deletion via keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || (e.key === 'Backspace' && (e.metaKey || e.ctrlKey))) {
        // Get the selected node IDs and delete them
        const selectedNodeIds = useNodeStore.getState().selectedNodeIds;
        if (selectedNodeIds.length > 0) {
          useNodeStore.getState().deleteNodes(selectedNodeIds);
        }
        
        // Get the selected edge IDs and delete them
        const selectedEdgeIds = useEdgeStore.getState().selectedEdgeIds;
        if (selectedEdgeIds.length > 0) {
          useEdgeStore.getState().deleteEdges(selectedEdgeIds);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-full w-full relative overflow-hidden" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNodeIds([node.id])}
        onEdgeClick={(_, edge) => setSelectedEdgeIds([edge.id])}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'custom' }}
        defaultViewport={viewport}
        onMove={(_, viewport) => setViewport(viewport)}
        minZoom={0.1}
        maxZoom={4}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        selectionKeyCode="Shift"
        multiSelectionKeyCode="Control"
        panOnDrag={true}
        selectionOnDrag={false}
        panOnScroll={true}
        selectionMode={SelectionMode.Partial}
        proOptions={{ hideAttribution: true }}
        style={{ 
          background: canvasSettings.background, 
          width: `${canvasSettings.width}px`,
          height: `${canvasSettings.height}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        elementsSelectable={true}
        nodesDraggable={true}
        nodesConnectable={true}
        snapToGrid={canvasSettings.snapToGrid}
        snapGrid={[canvasSettings.gridSize, canvasSettings.gridSize]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={canvasSettings.gridSize}
          size={1}
          color="#444444"
        />
      </ReactFlow>
    </div>
  );
} 