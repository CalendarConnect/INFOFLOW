'use client';

import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useNodeStore, HeaderNodeData } from '@/store/nodeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function HeaderPanel() {
  const reactFlowInstance = useReactFlow();
  const { addHeaderNode, selectedNodeIds, nodes, updateNode } = useNodeStore();
  
  // Get the currently selected node if it's a header node
  const selectedNode = nodes.find(node => 
    selectedNodeIds.includes(node.id) && node.type === 'header'
  );
  
  // State for new header
  const [headerText, setHeaderText] = useState('New Header');
  const [headerLevel, setHeaderLevel] = useState<'h1' | 'h2' | 'h3'>('h1');
  
  // State for editor (when a header is selected)
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedFontSize, setSelectedFontSize] = useState(28);
  const [selectedFontFamily, setSelectedFontFamily] = useState('sans');
  const [selectedFontWeight, setSelectedFontWeight] = useState('semibold');
  const [selectedAlignment, setSelectedAlignment] = useState('left');
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('');
  
  // Update editor state when a different node is selected
  React.useEffect(() => {
    if (selectedNode && selectedNode.type === 'header') {
      const headerData = selectedNode.data as HeaderNodeData;
      setSelectedColor(headerData.color || '#ffffff');
      setSelectedFontSize(headerData.fontSize || getFontSizeFromLevel(headerData.level));
      setSelectedFontFamily(headerData.fontFamily || 'sans');
      setSelectedFontWeight(headerData.fontWeight || 'semibold');
      setSelectedAlignment(headerData.alignment || 'left');
      setSelectedBackgroundColor(headerData.backgroundColor || '');
    }
  }, [selectedNode]);
  
  // Get default font size based on header level
  const getFontSizeFromLevel = (level: 'h1' | 'h2' | 'h3') => {
    switch (level) {
      case 'h1': return 28;
      case 'h2': return 22;
      case 'h3': return 18;
      default: return 28;
    }
  };
  
  // Add a new header node to the canvas
  const handleAddHeader = () => {
    const position = reactFlowInstance.project({
      x: window.innerWidth / 3,
      y: window.innerHeight / 3,
    });
    
    const headerData: HeaderNodeData = {
      text: headerText,
      level: headerLevel,
      fontSize: getFontSizeFromLevel(headerLevel),
      fontWeight: 'semibold',
      fontFamily: 'sans',
      color: '#ffffff',
      alignment: 'left',
      width: 320,
    };
    
    addHeaderNode(headerData, position);
  };
  
  // Update the selected header node
  const updateSelectedHeader = (data: Partial<HeaderNodeData>) => {
    if (selectedNode && selectedNode.id) {
      updateNode(selectedNode.id, data);
    }
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add Headers</h3>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="header-text">Header Text</Label>
            <Input
              id="header-text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="Enter header text"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Header Type</Label>
            <div className="flex gap-2">
              <Button
                variant={headerLevel === 'h1' ? 'default' : 'outline'}
                onClick={() => setHeaderLevel('h1')}
                className="flex-1"
              >
                <Heading1 className="mr-2" size={16} />
                H1
              </Button>
              <Button
                variant={headerLevel === 'h2' ? 'default' : 'outline'}
                onClick={() => setHeaderLevel('h2')}
                className="flex-1"
              >
                <Heading2 className="mr-2" size={16} />
                H2
              </Button>
              <Button
                variant={headerLevel === 'h3' ? 'default' : 'outline'}
                onClick={() => setHeaderLevel('h3')}
                className="flex-1"
              >
                <Heading3 className="mr-2" size={16} />
                H3
              </Button>
            </div>
          </div>
          
          <Button onClick={handleAddHeader} className="w-full">
            Add Header
          </Button>
        </div>
      </div>

      {selectedNode && selectedNode.type === 'header' && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Header Settings</h3>
          
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <div 
                className="w-8 h-8 rounded-md border cursor-pointer overflow-hidden"
                style={{ backgroundColor: selectedColor }}
              >
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    updateSelectedHeader({ color: e.target.value });
                  }}
                  className="w-10 h-10 cursor-pointer opacity-0"
                />
              </div>
              <Input
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  updateSelectedHeader({ color: e.target.value });
                }}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Font Size: {selectedFontSize}px</Label>
            </div>
            <Slider
              value={[selectedFontSize]}
              min={12}
              max={72}
              step={1}
              onValueChange={(value) => {
                setSelectedFontSize(value[0]);
                updateSelectedHeader({ fontSize: value[0] });
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={selectedFontFamily}
              onValueChange={(value) => {
                setSelectedFontFamily(value);
                updateSelectedHeader({ fontFamily: value as 'sans' | 'serif' | 'mono' });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans">Geist Sans</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Mono</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <Select
              value={selectedFontWeight}
              onValueChange={(value) => {
                setSelectedFontWeight(value);
                updateSelectedHeader({ fontWeight: value as 'normal' | 'medium' | 'semibold' | 'bold' });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <div className="flex gap-2">
              <Button
                variant={selectedAlignment === 'left' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedAlignment('left');
                  updateSelectedHeader({ alignment: 'left' });
                }}
                className="flex-1"
              >
                <AlignLeft size={16} />
              </Button>
              <Button
                variant={selectedAlignment === 'center' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedAlignment('center');
                  updateSelectedHeader({ alignment: 'center' });
                }}
                className="flex-1"
              >
                <AlignCenter size={16} />
              </Button>
              <Button
                variant={selectedAlignment === 'right' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedAlignment('right');
                  updateSelectedHeader({ alignment: 'right' });
                }}
                className="flex-1"
              >
                <AlignRight size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-md border cursor-pointer overflow-hidden",
                  !selectedBackgroundColor && "bg-transparent"
                )}
                style={{ 
                  backgroundColor: selectedBackgroundColor || 'transparent',
                  backgroundImage: !selectedBackgroundColor ? 'linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd)' : 'none',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 4px 4px'
                }}
              >
                <input
                  type="color"
                  value={selectedBackgroundColor || '#000000'}
                  onChange={(e) => {
                    setSelectedBackgroundColor(e.target.value);
                    updateSelectedHeader({ backgroundColor: e.target.value });
                  }}
                  className="w-10 h-10 cursor-pointer opacity-0"
                />
              </div>
              <Input
                value={selectedBackgroundColor}
                onChange={(e) => {
                  setSelectedBackgroundColor(e.target.value);
                  updateSelectedHeader({ backgroundColor: e.target.value });
                }}
                placeholder="Transparent"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedBackgroundColor('');
                  updateSelectedHeader({ backgroundColor: undefined });
                }}
                className="whitespace-nowrap"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 