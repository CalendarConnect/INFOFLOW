'use client';

import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import { Node, Edge } from 'reactflow';

// Sample initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'base',
    position: { x: 250, y: 100 },
    data: { label: 'WhatsApp', icon: '📱', color: '#25D366' },
  },
  {
    id: '2',
    type: 'base',
    position: { x: 250, y: 250 },
    data: { label: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  },
  {
    id: '3',
    type: 'base',
    position: { x: 450, y: 175 },
    data: { label: 'Email', icon: '✉️', color: '#DB4437' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'custom',
    data: { animated: true, label: 'Sends message' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'custom',
    data: { animated: true, label: 'Generates email' },
  },
];

export default function EditorPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Flow Editor</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Create and edit your automation flow by connecting different service nodes.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-[600px]">
        <FlowCanvas initialNodes={initialNodes} initialEdges={initialEdges} />
      </div>
    </div>
  );
} 