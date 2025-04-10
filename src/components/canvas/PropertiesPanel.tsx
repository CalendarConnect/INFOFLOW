'use client';

import React, { useState, useEffect } from 'react';
import { useNodeStore } from '@/store/nodeStore';
import { useEdgeStore } from '@/store/edgeStore';
import { useCanvasStore } from '@/store/canvasStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Trash2, Copy, Search, RepeatIcon } from 'lucide-react';
import { ChromePicker, ColorResult } from 'react-color';
import { IconPicker } from '@/components/ui/icon-search';
import { NodeShape } from '@/store/nodeStore';
import { EdgeAnimationType, EdgePattern, DotAnimationType } from '@/store/edgeStore';
import { Icon } from '@iconify/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface PropertiesPanelProps {
  className?: string;
}

// Canvas size presets
const CANVAS_PRESETS = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 1024, height: 768 },
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Twitter', width: 1200, height: 675 },
];

// Update the custom CSS for scroll functionality
const scrollStyles = `
  .properties-panel-scroll {
    height: 100%;
    overflow-y: auto;
    -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
    scrollbar-width: none;  /* Hide scrollbar for Firefox */
  }
  
  .properties-panel-scroll::-webkit-scrollbar {
    display: none;  /* Hide scrollbar for Chrome, Safari and Opera */
  }
  
  .properties-panel-content {
    height: 100%;
    overflow-y: auto;
  }
`;

export function PropertiesPanel({ className }: PropertiesPanelProps) {
  const { nodes, selectedNodeIds, updateNode, duplicateNode, deleteNodes } = useNodeStore();
  const { edges, selectedEdgeIds, updateEdge, deleteEdges } = useEdgeStore();
  const { 
    canvasSettings, 
    updateCanvasSettings, 
    toggleGrid, 
    isGridVisible 
  } = useCanvasStore();
  
  const selectedNode = selectedNodeIds.length === 1
    ? nodes.find(node => node.id === selectedNodeIds[0])
    : null;
    
  const selectedEdge = selectedEdgeIds.length === 1
    ? edges.find(edge => edge.id === selectedEdgeIds[0])
    : null;
  
  // Node states
  const [nodeName, setNodeName] = useState('');
  const [nodeIcon, setNodeIcon] = useState('');
  const [nodeColor, setNodeColor] = useState('#3b82f6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(180);
  const [nodeHeight, setNodeHeight] = useState(80);
  
  // Node glow effect
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowColor, setGlowColor] = useState('#3b82f6');
  const [glowIntensity, setGlowIntensity] = useState(5);
  const [showGlowColorPicker, setShowGlowColorPicker] = useState(false);
  
  // Edge states
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeAnimated, setEdgeAnimated] = useState(false);
  const [edgeColor, setEdgeColor] = useState('#64748b');
  const [edgeThickness, setEdgeThickness] = useState(2);
  const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);
  const [edgeLineStyle, setEdgeLineStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  
  // Line animation properties
  const [lineAnimationEnabled, setLineAnimationEnabled] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [edgeAnimationType, setEdgeAnimationType] = useState<EdgeAnimationType>('flow');
  const [edgeReverseAnimation, setEdgeReverseAnimation] = useState(false);
  
  // Edge dot animation properties
  const [dotAnimationEnabled, setDotAnimationEnabled] = useState(false);
  const [dotSize, setDotSize] = useState(4);
  const [dotColor, setDotColor] = useState('#64748b');
  const [edgeDotCount, setEdgeDotCount] = useState(1);
  const [dotAnimationType, setDotAnimationType] = useState<DotAnimationType>('standard');
  const [showDotColorPicker, setShowDotColorPicker] = useState(false);
  
  // Canvas states
  const [canvasWidth, setCanvasWidth] = useState(canvasSettings.width);
  const [canvasHeight, setCanvasHeight] = useState(canvasSettings.height);
  const [gridSize, setGridSize] = useState(canvasSettings.gridSize);
  const [snapToGrid, setSnapToGrid] = useState(canvasSettings.snapToGrid);
  const [backgroundColor, setBackgroundColor] = useState(canvasSettings.background || '#000000');
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  
  // Shape, border, text, and background
  const [nodeShape, setNodeShape] = useState<NodeShape>('rounded');
  const [nodeBorderWidth, setNodeBorderWidth] = useState(2);
  const [nodeBorderStyle, setNodeBorderStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [nodeTextColor, setNodeTextColor] = useState('#ffffff');
  const [showNodeTextColorPicker, setShowNodeTextColorPicker] = useState(false);
  const [nodeBackgroundColor, setNodeBackgroundColor] = useState('#ffffff');
  const [showNodeBackgroundColorPicker, setShowNodeBackgroundColorPicker] = useState(false);
  const [nodeOpacity, setNodeOpacity] = useState(1);
  
  // Animation
  const [nodeAnimation, setNodeAnimation] = useState<'none' | 'pulse' | 'bounce' | 'shake' | 'wiggle'>('none');
  const [nodeAnimationDuration, setNodeAnimationDuration] = useState(2);
  
  // Icon
  const [nodeIconSize, setNodeIconSize] = useState(18);
  const [nodeIconPosition, setNodeIconPosition] = useState<'left' | 'right' | 'top' | 'bottom' | 'center'>('left');
  
  // Shadow
  const [nodeShadow, setNodeShadow] = useState<'none' | 'sm' | 'md' | 'lg'>('sm');
  
  // Edge animation and styling options
  const [edgeDotSpacing, setEdgeDotSpacing] = useState(60);
  const [edgeStartArrow, setEdgeStartArrow] = useState(false);
  const [edgeEndArrow, setEdgeEndArrow] = useState(false);
  const [edgeBidirectional, setEdgeBidirectional] = useState(false);
  const [edgeLabelBgColor, setEdgeLabelBgColor] = useState('#ffffff');
  const [edgeLabelTextColor, setEdgeLabelTextColor] = useState('#000000');
  const [edgePattern, setEdgePattern] = useState<EdgePattern>('solid');
  const [edgeCurvature, setEdgeCurvature] = useState(0.5);
  const [edgeOpacity, setEdgeOpacity] = useState(1);
  const [edgeShadowColor, setEdgeShadowColor] = useState('#64748b');
  const [edgeShadowBlur, setEdgeShadowBlur] = useState(0);
  const [edgeGradientColors, setEdgeGradientColors] = useState<string[]>(['#64748b', '#ffffff']);
  const [showEdgeGradientStartColorPicker, setShowEdgeGradientStartColorPicker] = useState(false);
  const [showEdgeGradientEndColorPicker, setShowEdgeGradientEndColorPicker] = useState(false);
  
  // Add new state to track the active tab
  const [activeTab, setActiveTab] = useState('node');
  
  // Update local state when selection changes
  useEffect(() => {
    if (selectedNode) {
      setNodeName(selectedNode.data.label || '');
      setNodeIcon(selectedNode.data.icon || '');
      setNodeColor(selectedNode.data.color || '#3b82f6');
      setGlowEffect(selectedNode.data.glowEffect || false);
      setGlowColor(selectedNode.data.glowColor || nodeColor);
      setGlowIntensity(selectedNode.data.glowIntensity || 5);
      setNodeWidth(selectedNode.data.width || 180);
      setNodeHeight(selectedNode.data.height || 80);
      
      // Add new properties
      setNodeShape(selectedNode.data.shape || 'rounded');
      setNodeBorderWidth(selectedNode.data.borderWidth || 2);
      setNodeBorderStyle(selectedNode.data.borderStyle || 'solid');
      setNodeTextColor(selectedNode.data.textColor || '#ffffff');
      setNodeBackgroundColor(selectedNode.data.backgroundColor || '#ffffff');
      setNodeOpacity(selectedNode.data.opacity !== undefined ? selectedNode.data.opacity : 1);
      setNodeAnimation(selectedNode.data.animation || 'none');
      setNodeAnimationDuration(selectedNode.data.animationDuration || 2);
      setNodeIconSize(selectedNode.data.iconSize || 18);
      setNodeIconPosition(selectedNode.data.iconPosition || 'left');
      setNodeShadow(selectedNode.data.shadow || 'sm');
      
      // Automatically switch to the node tab when a node is selected
      setActiveTab('node');
    }
  }, [selectedNode, nodeColor]);
  
  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(selectedEdge.data?.label || '');
      setEdgeColor(selectedEdge.data?.color || '#64748b');
      setEdgeThickness(selectedEdge.data?.thickness || 2);
      setEdgeLineStyle(selectedEdge.data?.lineStyle || 'solid');
      
      // Line animation properties
      setLineAnimationEnabled(selectedEdge.data?.animated || false);
      setAnimationSpeed(selectedEdge.data?.animationSpeed || 2);
      setEdgeAnimationType(selectedEdge.data?.animationType || 'flow');
      setEdgeReverseAnimation(selectedEdge.data?.reverseAnimation || false);
      
      // Dot animation properties
      setDotAnimationEnabled(selectedEdge.data?.showDot || false);
      setDotSize(selectedEdge.data?.dotSize || 4);
      setDotColor(selectedEdge.data?.dotColor || edgeColor);
      setEdgeDotCount(selectedEdge.data?.dotCount || 1);
      setDotAnimationType(selectedEdge.data?.dotAnimationType || 'standard');
      
      // Add new properties
      setEdgeDotSpacing(selectedEdge.data?.dotSpacing || 60);
      setEdgeStartArrow(selectedEdge.data?.startArrow || false);
      setEdgeEndArrow(selectedEdge.data?.endArrow || false);
      setEdgeBidirectional(selectedEdge.data?.bidirectional || false);
      setEdgeLabelBgColor(selectedEdge.data?.labelBgColor || '#ffffff');
      setEdgeLabelTextColor(selectedEdge.data?.labelTextColor || '#000000');
      setEdgePattern(selectedEdge.data?.pattern || 'solid');
      setEdgeCurvature(selectedEdge.data?.curvature !== undefined ? selectedEdge.data.curvature : 0.5);
      setEdgeOpacity(selectedEdge.data?.opacity !== undefined ? selectedEdge.data.opacity : 1);
      setEdgeShadowColor(selectedEdge.data?.shadowColor || selectedEdge.data?.color || '#64748b');
      setEdgeShadowBlur(selectedEdge.data?.shadowBlur || 0);
      setEdgeGradientColors(selectedEdge.data?.gradientColors || [selectedEdge.data?.color || '#64748b', '#ffffff']);
      
      // Automatically switch to the edge tab when an edge is selected
      setActiveTab('edge');
    }
  }, [selectedEdge, edgeColor]);
  
  // Update canvas state when settings change
  useEffect(() => {
    setCanvasWidth(canvasSettings.width);
    setCanvasHeight(canvasSettings.height);
    setGridSize(canvasSettings.gridSize);
    setSnapToGrid(canvasSettings.snapToGrid);
    setBackgroundColor(canvasSettings.background || '#000000');
  }, [canvasSettings]);
  
  // Apply node changes
  const applyNodeChanges = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, {
        label: nodeName,
        icon: nodeIcon,
        color: nodeColor,
        glowEffect,
        glowColor,
        glowIntensity,
        width: nodeWidth,
        height: nodeHeight,
        
        // New properties
        shape: nodeShape,
        borderWidth: nodeBorderWidth,
        borderStyle: nodeBorderStyle,
        textColor: nodeTextColor,
        backgroundColor: nodeBackgroundColor,
        opacity: nodeOpacity,
        animation: nodeAnimation,
        animationDuration: nodeAnimationDuration,
        iconSize: nodeIconSize,
        iconPosition: nodeIconPosition,
        shadow: nodeShadow,
      });
    }
  };
  
  // Apply edge changes
  const applyEdgeChanges = () => {
    if (selectedEdge) {
      updateEdge(selectedEdge.id, {
        label: edgeLabel,
        animated: edgeAnimated,
        color: edgeColor,
        thickness: edgeThickness,
        showDot: dotAnimationEnabled,
        dotSize,
        dotColor,
        animationSpeed,
        lineStyle: edgeLineStyle,
        
        // New properties
        animationType: edgeAnimationType,
        dotCount: edgeDotCount,
        dotSpacing: edgeDotSpacing,
        startArrow: edgeStartArrow,
        endArrow: edgeEndArrow,
        bidirectional: edgeBidirectional,
        reverseAnimation: edgeReverseAnimation,
        labelBgColor: edgeLabelBgColor,
        labelTextColor: edgeLabelTextColor,
        pattern: edgePattern,
        curvature: edgeCurvature,
        opacity: edgeOpacity,
        shadowColor: edgeShadowColor,
        shadowBlur: edgeShadowBlur,
        gradientColors: edgeGradientColors,
      });
    }
  };
  
  // Handle node name change
  const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
    // Apply changes as user types
    if (selectedNode) {
      updateNode(selectedNode.id, { label: e.target.value });
    }
  };
  
  // Handle node icon change
  const handleNodeIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeIcon(e.target.value);
    // Apply changes as user types
    if (selectedNode) {
      updateNode(selectedNode.id, { icon: e.target.value });
    }
  };
  
  // Handle node color change
  const handleNodeColorChange = (color: ColorResult) => {
    setNodeColor(color.hex);
    // Apply changes as user selects color
    if (selectedNode) {
      updateNode(selectedNode.id, { color: color.hex });
    }
  };
  
  // Handle edge label change
  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdgeLabel(e.target.value);
    // Apply changes as user types
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { label: e.target.value });
    }
  };
  
  // Handle edge animated toggle
  const handleEdgeAnimatedChange = (checked: boolean) => {
    setEdgeAnimated(checked);
    // Apply changes as user toggles
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { animated: checked });
    }
  };
  
  // Handle edge color change
  const handleEdgeColorChange = (color: ColorResult) => {
    setEdgeColor(color.hex);
    // Apply changes as user selects color
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { color: color.hex });
    }
  };
  
  // Handle edge thickness change
  const handleEdgeThicknessChange = (value: number[]) => {
    setEdgeThickness(value[0]);
    // Apply changes as user adjusts slider
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { thickness: value[0] });
    }
  };
  
  // Handle line animation toggle
  const handleLineAnimationToggle = (checked: boolean) => {
    setLineAnimationEnabled(checked);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { animated: checked });
    }
  };
  
  // Handle dot animation toggle
  const handleDotAnimationToggle = (checked: boolean) => {
    setDotAnimationEnabled(checked);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { showDot: checked });
    }
  };
  
  // Handle animation speed change
  const handleAnimationSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { animationSpeed: value[0] });
    }
  };
  
  // Handle duplicate node
  const handleDuplicateNode = () => {
    if (selectedNode) {
      duplicateNode(selectedNode.id);
    }
  };
  
  // Handle delete node
  const handleDeleteNode = () => {
    if (selectedNodeIds.length > 0) {
      deleteNodes(selectedNodeIds);
    }
  };
  
  // Handle delete edge
  const handleDeleteEdge = () => {
    if (selectedEdgeIds.length > 0) {
      deleteEdges(selectedEdgeIds);
    }
  };
  
  // Handle glow effect toggle
  const handleGlowEffectChange = (checked: boolean) => {
    setGlowEffect(checked);
    if (selectedNode) {
      updateNode(selectedNode.id, { glowEffect: checked });
    }
  };
  
  // Handle glow color change
  const handleGlowColorChange = (color: ColorResult) => {
    setGlowColor(color.hex);
    if (selectedNode) {
      updateNode(selectedNode.id, { glowColor: color.hex });
    }
  };
  
  // Handle glow intensity change
  const handleGlowIntensityChange = (value: number[]) => {
    setGlowIntensity(value[0]);
    if (selectedNode) {
      updateNode(selectedNode.id, { glowIntensity: value[0] });
    }
  };
  
  // Canvas settings handlers
  const handleCanvasWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    if (!isNaN(width) && width > 0) {
      setCanvasWidth(width);
      updateCanvasSettings({ width });
    }
  };
  
  const handleCanvasHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    if (!isNaN(height) && height > 0) {
      setCanvasHeight(height);
      updateCanvasSettings({ height });
    }
  };
  
  const handleBackgroundColorChange = (color: ColorResult) => {
    setBackgroundColor(color.hex);
    updateCanvasSettings({ background: color.hex });
  };
  
  const handleGridSizeChange = (value: number[]) => {
    setGridSize(value[0]);
    updateCanvasSettings({ gridSize: value[0] });
  };
  
  const handleSnapToGridChange = (checked: boolean) => {
    setSnapToGrid(checked);
    updateCanvasSettings({ snapToGrid: checked });
  };
  
  const handleCanvasPresetChange = (value: string) => {
    const preset = CANVAS_PRESETS.find(p => p.name === value);
    if (preset) {
      setCanvasWidth(preset.width);
      setCanvasHeight(preset.height);
      updateCanvasSettings({ 
        width: preset.width, 
        height: preset.height 
      });
    }
  };
  
  // Handle node width change
  const handleNodeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    if (!isNaN(width) && width >= 100) {
      setNodeWidth(width);
      // Apply changes as user types
      if (selectedNode) {
        updateNode(selectedNode.id, { width });
      }
    }
  };
  
  // Handle node height change
  const handleNodeHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    if (!isNaN(height) && height >= 50) {
      setNodeHeight(height);
      // Apply changes as user types
      if (selectedNode) {
        updateNode(selectedNode.id, { height });
      }
    }
  };
  
  // Handle edge line style change
  const handleEdgeLineStyleChange = (value: 'solid' | 'dashed' | 'dotted') => {
    setEdgeLineStyle(value);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { lineStyle: value });
    }
  };
  
  // Add handlers for new properties
  const handleNodeShapeChange = (value: NodeShape) => {
    setNodeShape(value);
    if (selectedNode) {
      updateNode(selectedNode.id, { shape: value });
    }
  };
  
  const handleNodeBorderWidthChange = (value: number[]) => {
    setNodeBorderWidth(value[0]);
    if (selectedNode) {
      updateNode(selectedNode.id, { borderWidth: value[0] });
    }
  };
  
  const handleNodeBorderStyleChange = (value: 'solid' | 'dashed' | 'dotted') => {
    setNodeBorderStyle(value);
    if (selectedNode) {
      updateNode(selectedNode.id, { borderStyle: value });
    }
  };
  
  const handleNodeTextColorChange = (color: ColorResult) => {
    setNodeTextColor(color.hex);
    if (selectedNode) {
      updateNode(selectedNode.id, { textColor: color.hex });
    }
  };
  
  const handleNodeBackgroundColorChange = (color: ColorResult) => {
    setNodeBackgroundColor(color.hex);
    if (selectedNode) {
      updateNode(selectedNode.id, { backgroundColor: color.hex });
    }
  };
  
  const handleNodeOpacityChange = (value: number[]) => {
    setNodeOpacity(value[0]);
    if (selectedNode) {
      updateNode(selectedNode.id, { opacity: value[0] });
    }
  };
  
  const handleNodeAnimationChange = (value: 'none' | 'pulse' | 'bounce' | 'shake' | 'wiggle') => {
    setNodeAnimation(value);
    if (selectedNode) {
      updateNode(selectedNode.id, { animation: value });
    }
  };
  
  const handleNodeAnimationDurationChange = (value: number[]) => {
    setNodeAnimationDuration(value[0]);
    if (selectedNode) {
      updateNode(selectedNode.id, { animationDuration: value[0] });
    }
  };
  
  const handleNodeIconSizeChange = (value: number[]) => {
    setNodeIconSize(value[0]);
    if (selectedNode) {
      updateNode(selectedNode.id, { iconSize: value[0] });
    }
  };
  
  const handleNodeIconPositionChange = (value: 'left' | 'right' | 'top' | 'bottom' | 'center') => {
    setNodeIconPosition(value);
    if (selectedNode) {
      updateNode(selectedNode.id, { iconPosition: value });
    }
  };
  
  const handleNodeShadowChange = (value: 'none' | 'sm' | 'md' | 'lg') => {
    setNodeShadow(value);
    if (selectedNode) {
      updateNode(selectedNode.id, { shadow: value });
    }
  };
  
  const handleEdgeAnimationTypeChange = (value: EdgeAnimationType) => {
    setEdgeAnimationType(value);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { animationType: value });
    }
  };
  
  const handleEdgeDotCountChange = (value: number[]) => {
    setEdgeDotCount(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { dotCount: value[0] });
    }
  };
  
  const handleEdgeDotSpacingChange = (value: number[]) => {
    setEdgeDotSpacing(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { dotSpacing: value[0] });
    }
  };
  
  const handleEdgeStartArrowChange = (checked: boolean) => {
    setEdgeStartArrow(checked);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { startArrow: checked });
    }
  };
  
  const handleEdgeEndArrowChange = (checked: boolean) => {
    setEdgeEndArrow(checked);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { endArrow: checked });
    }
  };
  
  const handleEdgeBidirectionalChange = (checked: boolean) => {
    setEdgeBidirectional(checked);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { bidirectional: checked });
    }
  };
  
  const handleEdgeLabelBgColorChange = (color: ColorResult) => {
    setEdgeLabelBgColor(color.hex);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { labelBgColor: color.hex });
    }
  };
  
  const handleEdgeLabelTextColorChange = (color: ColorResult) => {
    setEdgeLabelTextColor(color.hex);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { labelTextColor: color.hex });
    }
  };
  
  const handleEdgePatternChange = (value: EdgePattern) => {
    setEdgePattern(value);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { pattern: value });
    }
  };
  
  const handleEdgeCurvatureChange = (value: number[]) => {
    setEdgeCurvature(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { curvature: value[0] });
    }
  };
  
  const handleEdgeOpacityChange = (value: number[]) => {
    setEdgeOpacity(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { opacity: value[0] });
    }
  };
  
  const handleEdgeShadowColorChange = (color: ColorResult) => {
    setEdgeShadowColor(color.hex);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { shadowColor: color.hex });
    }
  };
  
  const handleEdgeShadowBlurChange = (value: number[]) => {
    setEdgeShadowBlur(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { shadowBlur: value[0] });
    }
  };
  
  const handleEdgeGradientStartColorChange = (color: ColorResult) => {
    const newColors = [...edgeGradientColors];
    newColors[0] = color.hex;
    setEdgeGradientColors(newColors);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { gradientColors: newColors });
    }
  };
  
  const handleEdgeGradientEndColorChange = (color: ColorResult) => {
    const newColors = [...edgeGradientColors];
    newColors[1] = color.hex;
    setEdgeGradientColors(newColors);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { gradientColors: newColors });
    }
  };
  
  const handleIconSelect = (iconName: string) => {
    setNodeIcon(iconName);
    if (selectedNode) {
      updateNode(selectedNode.id, { icon: iconName });
    }
  };
  
  // Handler for edge animation direction
  const handleEdgeReverseAnimationChange = (checked: boolean) => {
    setEdgeReverseAnimation(checked);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { reverseAnimation: checked });
    }
  };
  
  // Handle dot size change
  const handleDotSizeChange = (value: number[]) => {
    setDotSize(value[0]);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { dotSize: value[0] });
    }
  };
  
  // Handle dot color change
  const handleDotColorChange = (color: ColorResult) => {
    setDotColor(color.hex);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { dotColor: color.hex });
    }
  };
  
  // Handle dot animation type change
  const handleDotAnimationTypeChange = (value: DotAnimationType) => {
    setDotAnimationType(value);
    if (selectedEdge) {
      updateEdge(selectedEdge.id, { dotAnimationType: value });
    }
  };
  
  return (
    <div className={cn("w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-border", className)}>
      <style>{scrollStyles}</style>
      <div className="p-3 border-b border-border flex-shrink-0">
        <h3 className="font-medium">Properties</h3>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full overflow-hidden">
        <TabsList className="mx-3 mt-2 flex-shrink-0">
          <TabsTrigger value="node" className="flex-1">Node</TabsTrigger>
          <TabsTrigger value="edge" className="flex-1">Edge</TabsTrigger>
          <TabsTrigger value="canvas" className="flex-1">Canvas</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea 
            className="flex-1 h-full properties-panel-scroll" 
            scrollVisibility="auto"
          >
            <div className="h-full">
              <TabsContent value="node" className="p-3 properties-panel-content">
                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Node Properties</div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleDuplicateNode}
                          title="Duplicate Node"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={handleDeleteNode}
                          title="Delete Node"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="node-name">Label</Label>
                      <Input
                        id="node-name"
                        value={nodeName}
                        onChange={handleNodeNameChange}
                        placeholder="Node name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="node-icon">Icon</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div 
                            className="w-10 h-10 rounded-md border border-border flex items-center justify-center"
                            style={{ backgroundColor: `${nodeColor}20`, color: nodeColor }}
                          >
                            {nodeIcon && (
                              nodeIcon.includes(':') ? (
                                <Icon icon={nodeIcon} className="h-6 w-6" />
                              ) : (
                                <span className="text-xl">{nodeIcon}</span>
                              )
                            )}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <Input
                              id="node-icon"
                              value={nodeIcon}
                              onChange={handleNodeIconChange}
                              placeholder="📱 or lucide:home"
                              className="flex-1"
                            />
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-10 w-10">
                                  <Search className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[550px]">
                                <DialogHeader>
                                  <DialogTitle>Search Icons</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <IconPicker
                                    value={nodeIcon}
                                    onSelect={handleIconSelect}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="node-color">Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-md border border-border cursor-pointer"
                          style={{ backgroundColor: nodeColor }}
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        />
                        <Input
                          id="node-color"
                          value={nodeColor}
                          onChange={(e) => {
                            setNodeColor(e.target.value);
                            if (selectedNode) {
                              updateNode(selectedNode.id, { color: e.target.value });
                            }
                          }}
                        />
                      </div>
                      {showColorPicker && (
                        <div className="absolute z-10 mt-2" style={{ position: 'relative' }}>
                          <div 
                            className="fixed inset-0" 
                            onClick={() => setShowColorPicker(false)}
                          />
                          <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                            <ChromePicker
                              color={nodeColor}
                              onChange={handleNodeColorChange}
                              disableAlpha
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="node-width" className="text-xs">Width</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="node-width"
                              type="number"
                              min={100}
                              value={nodeWidth}
                              onChange={handleNodeWidthChange}
                            />
                            <span className="text-xs text-muted-foreground">px</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="node-height" className="text-xs">Height</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="node-height"
                              type="number"
                              min={50}
                              value={nodeHeight}
                              onChange={handleNodeHeightChange}
                            />
                            <span className="text-xs text-muted-foreground">px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-3">Glow Effect</h4>
                      
                      <div className="flex items-center gap-2 py-2">
                        <Label htmlFor="glow-effect" className="flex-1">
                          Enable Glow
                        </Label>
                        <Switch
                          id="glow-effect"
                          checked={glowEffect}
                          onCheckedChange={handleGlowEffectChange}
                        />
                      </div>
                      
                      {glowEffect && (
                        <>
                          <div className="space-y-2 mt-3">
                            <Label>Glow Color</Label>
                            <div 
                              className="h-9 rounded-md border border-input flex items-center justify-between px-3 cursor-pointer"
                              onClick={() => setShowGlowColorPicker(!showGlowColorPicker)}
                            >
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: glowColor }}
                                />
                                <span>{glowColor}</span>
                              </div>
                            </div>
                            {showGlowColorPicker && (
                              <div className="absolute z-10 mt-1" style={{ position: 'relative' }}>
                                <div 
                                  className="fixed inset-0" 
                                  onClick={() => setShowGlowColorPicker(false)}
                                />
                                <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                                  <ChromePicker 
                                    color={glowColor} 
                                    onChange={handleGlowColorChange} 
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 mt-3">
                            <div className="flex justify-between">
                              <Label>Intensity: {glowIntensity}</Label>
                            </div>
                            <Slider
                              value={[glowIntensity]}
                              min={1}
                              max={20}
                              step={1}
                              onValueChange={handleGlowIntensityChange}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <Label className="font-medium">Node Shape</Label>
                      <Select value={nodeShape} onValueChange={handleNodeShapeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rectangle">Rectangle</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="pill">Pill</SelectItem>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="hexagon">Hexagon</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="parallelogram">Parallelogram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <Label>Border Style</Label>
                        <Select value={nodeBorderStyle} onValueChange={handleNodeBorderStyleChange}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Border Style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="dashed">Dashed</SelectItem>
                            <SelectItem value="dotted">Dotted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Border Width</Label>
                          <span className="text-xs text-muted-foreground">{nodeBorderWidth}px</span>
                        </div>
                        <Slider
                          value={[nodeBorderWidth]}
                          min={0}
                          max={10}
                          step={1}
                          onValueChange={handleNodeBorderWidthChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <Label>Shadow</Label>
                        <Select value={nodeShadow} onValueChange={handleNodeShadowChange}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Shadow" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <Label>Animation</Label>
                        <Select value={nodeAnimation} onValueChange={handleNodeAnimationChange}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Animation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="pulse">Pulse</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="shake">Shake</SelectItem>
                            <SelectItem value="wiggle">Wiggle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {nodeAnimation !== 'none' && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label>Animation Duration</Label>
                            <span className="text-xs text-muted-foreground">{nodeAnimationDuration}s</span>
                          </div>
                          <Slider
                            value={[nodeAnimationDuration]}
                            min={0.5}
                            max={5}
                            step={0.1}
                            onValueChange={handleNodeAnimationDurationChange}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <Label>Colors</Label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Background</Label>
                          <div 
                            className="h-10 w-full rounded-md border border-input flex items-center justify-center cursor-pointer mt-1"
                            style={{ backgroundColor: nodeBackgroundColor }}
                            onClick={() => setShowNodeBackgroundColorPicker(!showNodeBackgroundColorPicker)}
                          />
                          {showNodeBackgroundColorPicker && (
                            <div className="absolute z-10 mt-2" style={{ position: 'relative' }}>
                              <div 
                                className="fixed inset-0 z-0" 
                                onClick={() => setShowNodeBackgroundColorPicker(false)} 
                              />
                              <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                                <ChromePicker 
                                  color={nodeBackgroundColor} 
                                  onChange={handleNodeBackgroundColorChange} 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Text</Label>
                          <div 
                            className="h-10 w-full rounded-md border border-input flex items-center justify-center cursor-pointer mt-1"
                            style={{ backgroundColor: nodeTextColor }}
                            onClick={() => setShowNodeTextColorPicker(!showNodeTextColorPicker)}
                          />
                          {showNodeTextColorPicker && (
                            <div className="absolute z-10 mt-2" style={{ position: 'relative' }}>
                              <div 
                                className="fixed inset-0 z-0" 
                                onClick={() => setShowNodeTextColorPicker(false)} 
                              />
                              <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                                <ChromePicker 
                                  color={nodeTextColor} 
                                  onChange={handleNodeTextColorChange} 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Opacity</Label>
                          <span className="text-xs text-muted-foreground">{Math.round(nodeOpacity * 100)}%</span>
                        </div>
                        <Slider
                          value={[nodeOpacity]}
                          min={0.1}
                          max={1}
                          step={0.05}
                          onValueChange={handleNodeOpacityChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <Label className="font-medium">Icon Settings</Label>
                      
                      <div className="flex justify-between items-center">
                        <Label>Icon Position</Label>
                        <Select value={nodeIconPosition} onValueChange={handleNodeIconPositionChange}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Icon Size</Label>
                          <span className="text-xs text-muted-foreground">{nodeIconSize}px</span>
                        </div>
                        <Slider
                          value={[nodeIconSize]}
                          min={12}
                          max={48}
                          step={1}
                          onValueChange={handleNodeIconSizeChange}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-4">
                      Node ID: {selectedNode.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Position: x={Math.round(selectedNode.position.x)}, y={Math.round(selectedNode.position.y)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-muted-foreground">
                    Select a node to edit its properties
                  </div>
                )}
              </TabsContent>

              {selectedEdge && (
                <TabsContent value="edge" className="space-y-4 h-[calc(100vh-9rem)] overflow-y-auto p-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Edge Properties</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleDeleteEdge}
                      title="Delete Edge"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  {/* Basic Edge Properties */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="edge-label">Label</Label>
                      <Input
                        id="edge-label"
                        value={edgeLabel}
                        onChange={handleEdgeLabelChange}
                        placeholder="Edge label"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edge-color">Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-md border border-border cursor-pointer"
                          style={{ backgroundColor: edgeColor }}
                          onClick={() => setShowEdgeColorPicker(!showEdgeColorPicker)}
                        />
                        <Input
                          id="edge-color"
                          value={edgeColor}
                          onChange={(e) => {
                            setEdgeColor(e.target.value);
                            if (selectedEdge) {
                              updateEdge(selectedEdge.id, { color: e.target.value });
                            }
                          }}
                        />
                      </div>
                      {showEdgeColorPicker && (
                        <div className="absolute z-10 mt-2" style={{ position: 'relative' }}>
                          <div 
                            className="fixed inset-0" 
                            onClick={() => setShowEdgeColorPicker(false)}
                          />
                          <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                            <ChromePicker
                              color={edgeColor}
                              onChange={handleEdgeColorChange}
                              disableAlpha
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edge-thickness">Thickness ({edgeThickness}px)</Label>
                      <Slider
                        id="edge-thickness"
                        min={1}
                        max={10}
                        step={1}
                        value={[edgeThickness]}
                        onValueChange={handleEdgeThicknessChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edge-line-style">Line Style</Label>
                      <Select 
                        value={edgeLineStyle} 
                        onValueChange={(value: 'solid' | 'dashed' | 'dotted') => handleEdgeLineStyleChange(value)}
                      >
                        <SelectTrigger id="edge-line-style">
                          <SelectValue placeholder="Select line style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Animation Section */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="animation">
                      <AccordionTrigger>Animation Settings</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        {/* Line Animation */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Line Animation</Label>
                            <Switch
                              id="line-animation-enabled"
                              checked={lineAnimationEnabled}
                              onCheckedChange={handleLineAnimationToggle}
                            />
                          </div>
                          
                          {lineAnimationEnabled && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-sm">Animation Type</Label>
                                <Select value={edgeAnimationType} onValueChange={handleEdgeAnimationTypeChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Animation Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="flow">Flow</SelectItem>
                                    <SelectItem value="pulse">Pulse</SelectItem>
                                    <SelectItem value="dash">Dash</SelectItem>
                                    <SelectItem value="rainbow">Rainbow</SelectItem>
                                    <SelectItem value="laser">Laser</SelectItem>
                                    <SelectItem value="glow">Glow</SelectItem>
                                    <SelectItem value="wave">Wave</SelectItem>
                                    <SelectItem value="traffic">Traffic</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="bg-muted/20 rounded p-2 text-xs text-muted-foreground">
                                {edgeAnimationType === 'flow' && "Creates a flowing motion along the edge direction"}
                                {edgeAnimationType === 'pulse' && "Pulsates the line thickness for a subtle breathing effect"}
                                {edgeAnimationType === 'dash' && "Animates dashed lines in the direction of flow"}
                                {edgeAnimationType === 'rainbow' && "Cycles through vibrant colors for emphasis"}
                                {edgeAnimationType === 'laser' && "Creates a laser beam effect with changing opacity"}
                                {edgeAnimationType === 'glow' && "Adds a pulsing glow effect around the edge"}
                                {edgeAnimationType === 'wave' && "Varies line thickness in a wave-like pattern"}
                                {edgeAnimationType === 'traffic' && "Uses traffic light colors (red, yellow, green)"}
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <Label className="text-sm">Animation Speed</Label>
                                  <span className="text-xs text-muted-foreground">{animationSpeed}s</span>
                                </div>
                                <Slider
                                  value={[animationSpeed]}
                                  min={0.5}
                                  max={10}
                                  step={0.5}
                                  onValueChange={handleAnimationSpeedChange}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="edge-reverse-animation" className="text-sm">Reverse Direction</Label>
                                <Switch
                                  id="edge-reverse-animation"
                                  checked={edgeReverseAnimation}
                                  onCheckedChange={handleEdgeReverseAnimationChange}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Dot Animation */}
                        <div className="space-y-4 pt-2 border-t border-border/30">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Dot Animation</Label>
                            <Switch
                              id="dot-animation-enabled"
                              checked={dotAnimationEnabled}
                              onCheckedChange={handleDotAnimationToggle}
                            />
                          </div>
                          
                          {dotAnimationEnabled && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-sm">Dot Size ({dotSize}px)</Label>
                                <Slider
                                  value={[dotSize]}
                                  min={1}
                                  max={10}
                                  step={1}
                                  onValueChange={handleDotSizeChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Number of Dots ({edgeDotCount})</Label>
                                <Slider
                                  value={[edgeDotCount]}
                                  min={1}
                                  max={12}
                                  step={1}
                                  onValueChange={handleEdgeDotCountChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Dot Color</Label>
                                <div 
                                  className="h-9 rounded-md border border-input flex items-center justify-between px-3 cursor-pointer"
                                  onClick={() => setShowDotColorPicker(!showDotColorPicker)}
                                >
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: dotColor }}
                                    />
                                    <span>{dotColor}</span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDotColorChange({ hex: edgeColor } as ColorResult);
                                    }}
                                    title="Use edge color"
                                  >
                                    <RepeatIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                                {showDotColorPicker && (
                                  <div className="absolute z-10 mt-1" style={{ position: 'relative' }}>
                                    <div 
                                      className="fixed inset-0" 
                                      onClick={() => setShowDotColorPicker(false)}
                                    />
                                    <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                                      <ChromePicker 
                                        color={dotColor} 
                                        onChange={handleDotColorChange} 
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Dot Animation Type</Label>
                                <Select value={dotAnimationType} onValueChange={handleDotAnimationTypeChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Animation Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="pulse">Pulse</SelectItem>
                                    <SelectItem value="fadeIn">Fade In/Out</SelectItem>
                                    <SelectItem value="grow">Grow</SelectItem>
                                    <SelectItem value="bounce">Bounce</SelectItem>
                                    <SelectItem value="accelerate">Accelerate</SelectItem>
                                    <SelectItem value="traffic">Traffic Light</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="text-xs text-muted-foreground mt-1">
                                {dotAnimationType === 'standard' && "Basic animation along the path"}
                                {dotAnimationType === 'pulse' && "Dots pulsate as they move along the path"}
                                {dotAnimationType === 'fadeIn' && "Dots fade in and out as they travel"}
                                {dotAnimationType === 'grow' && "Dots grow and shrink while moving"}
                                {dotAnimationType === 'bounce' && "Dots bounce as they travel along the path"}
                                {dotAnimationType === 'accelerate' && "Dots start slow and accelerate to the end"}
                                {dotAnimationType === 'traffic' && "Red, yellow, and green dots simulate traffic signals"}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="dot-reverse-animation" className="text-sm">Reverse Direction</Label>
                                <Switch
                                  id="dot-reverse-animation"
                                  checked={edgeReverseAnimation}
                                  onCheckedChange={handleEdgeReverseAnimationChange}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Style & Shape Section */}
                    <AccordionItem value="style">
                      <AccordionTrigger>Style & Shape</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label>Line Pattern</Label>
                            <Select value={edgePattern} onValueChange={handleEdgePatternChange}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Pattern" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solid">Solid</SelectItem>
                                <SelectItem value="dashed">Dashed</SelectItem>
                                <SelectItem value="dotted">Dotted</SelectItem>
                                <SelectItem value="double">Double</SelectItem>
                                <SelectItem value="gradient">Gradient</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label>Curvature</Label>
                              <span className="text-xs text-muted-foreground">{edgeCurvature.toFixed(1)}</span>
                            </div>
                            <Slider
                              value={[edgeCurvature]}
                              min={0}
                              max={1}
                              step={0.1}
                              onValueChange={handleEdgeCurvatureChange}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label>Opacity</Label>
                              <span className="text-xs text-muted-foreground">{Math.round(edgeOpacity * 100)}%</span>
                            </div>
                            <Slider
                              value={[edgeOpacity]}
                              min={0.1}
                              max={1}
                              step={0.05}
                              onValueChange={handleEdgeOpacityChange}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Arrows Section */}
                    <AccordionItem value="arrows">
                      <AccordionTrigger>Arrows</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="start-arrow"
                              checked={edgeStartArrow}
                              onCheckedChange={handleEdgeStartArrowChange}
                            />
                            <Label htmlFor="start-arrow">Start Arrow</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="end-arrow"
                              checked={edgeEndArrow}
                              onCheckedChange={handleEdgeEndArrowChange}
                            />
                            <Label htmlFor="end-arrow">End Arrow</Label>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="bidirectional"
                            checked={edgeBidirectional}
                            onCheckedChange={handleEdgeBidirectionalChange}
                          />
                          <Label htmlFor="bidirectional">Bidirectional</Label>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="text-xs text-muted-foreground mt-4">
                    Edge ID: {selectedEdge.id}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="canvas" className="p-3 properties-panel-content">
                <div className="space-y-4">
                  <div className="font-medium mb-2">Canvas Properties</div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Size Preset</Label>
                      <Select onValueChange={handleCanvasPresetChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a preset size" />
                        </SelectTrigger>
                        <SelectContent>
                          {CANVAS_PRESETS.map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              {preset.name} ({preset.width}×{preset.height})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="canvas-width">Width (px)</Label>
                        <Input
                          id="canvas-width"
                          type="number"
                          value={canvasWidth}
                          onChange={handleCanvasWidthChange}
                          min={100}
                          max={4000}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="canvas-height">Height (px)</Label>
                        <Input
                          id="canvas-height"
                          type="number"
                          value={canvasHeight}
                          onChange={handleCanvasHeightChange}
                          min={100}
                          max={4000}
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-3">Background</h4>
                      
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div 
                          className="h-9 rounded-md border border-input flex items-center justify-between px-3 cursor-pointer"
                          onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: backgroundColor }}
                            />
                            <span>{backgroundColor}</span>
                          </div>
                        </div>
                        {showBgColorPicker && (
                          <div className="absolute z-10 mt-1" style={{ position: 'relative' }}>
                            <div 
                              className="fixed inset-0" 
                              onClick={() => setShowBgColorPicker(false)}
                            />
                            <div className="relative" style={{ position: 'absolute', right: '0', zIndex: 11 }}>
                              <ChromePicker 
                                color={backgroundColor} 
                                onChange={handleBackgroundColorChange} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-3">Grid Settings</h4>
                      
                      <div className="flex items-center gap-2 py-2">
                        <Label htmlFor="grid-visible" className="flex-1">
                          Show Grid
                        </Label>
                        <Switch
                          id="grid-visible"
                          checked={isGridVisible}
                          onCheckedChange={toggleGrid}
                        />
                      </div>
                      
                      {isGridVisible && (
                        <>
                          <div className="space-y-2 mt-3">
                            <div className="flex justify-between">
                              <Label>Grid Size: {gridSize}px</Label>
                            </div>
                            <Slider
                              value={[gridSize]}
                              min={5}
                              max={50}
                              step={5}
                              onValueChange={handleGridSizeChange}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 py-2">
                            <Label htmlFor="snap-to-grid" className="flex-1">
                              Snap to Grid
                            </Label>
                            <Switch
                              id="snap-to-grid"
                              checked={snapToGrid}
                              onCheckedChange={handleSnapToGridChange}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
} 