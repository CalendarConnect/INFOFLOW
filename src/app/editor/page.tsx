'use client';

import { useEffect, useState } from 'react';
import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import { NodePanel } from '@/components/canvas/NodePanel';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { Button } from '@/components/ui/button';
import { 
  PanelLeftClose,
  PanelRightClose,
  Play,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';
import { useNodeStore } from '@/store/nodeStore';
import { useEdgeStore } from '@/store/edgeStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useTheme } from 'next-themes';

export default function EditorPage() {
  const { nodes } = useNodeStore();
  const { edges } = useEdgeStore();
  const { toggleAnimation, isAnimationActive } = useCanvasStore();
  const { theme, setTheme } = useTheme();
  
  const [isMounted, setIsMounted] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Initialize the component
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Toggle panels
  const toggleLeftPanel = () => setLeftPanelOpen(!leftPanelOpen);
  const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  if (!isMounted) {
    return <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>;
  }
  
  return (
    <div className="h-full">
      {/* Top toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold">FC</span>
            </div>
            <h2 className="text-2xl font-bold">
              Flow Editor
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleTheme} className="ml-auto">
              {theme === 'dark' ? <Sun className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={toggleLeftPanel}
            title={leftPanelOpen ? "Hide Node Library" : "Show Node Library"}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={toggleRightPanel}
            title={rightPanelOpen ? "Hide Properties Panel" : "Show Properties Panel"}
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
          <Button
            variant={isAnimationActive ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={toggleAnimation}
            title={isAnimationActive ? "Disable Animations" : "Enable Animations"}
          >
            <Play className="h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground ml-2">
            Nodes: {nodes.length} | Edges: {edges.length}
          </div>
        </div>
      </div>
      
      {/* Main editor area - flex row with three panels */}
      <div className="flex flex-1 gap-4 overflow-hidden h-[calc(100%-5rem)]">
        {/* Left sidebar - Node library */}
        {leftPanelOpen && (
          <div className="w-64 flex-shrink-0">
            <NodePanel />
          </div>
        )}
        
        {/* Main canvas area */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <FlowCanvas />
        </div>
        
        {/* Right sidebar - Properties panel */}
        {rightPanelOpen && (
          <div className="w-72 flex-shrink-0">
            <PropertiesPanel />
          </div>
        )}
      </div>
    </div>
  );
} 