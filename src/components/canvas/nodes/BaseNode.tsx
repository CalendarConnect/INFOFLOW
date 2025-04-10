'use client';

import React, { memo, useCallback } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNodeStore } from '@/store/nodeStore';
import { Icon } from '@iconify/react';
import { useCanvasStore } from '@/store/canvasStore';

export type NodeShape = 'rectangle' | 'rounded' | 'pill' | 'diamond' | 'hexagon' | 'circle' | 'parallelogram';

export interface BaseNodeData {
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

interface ResizeHandleProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onResize: (deltaWidth: number, deltaHeight: number) => void;
}

const ResizeHandle = ({ position, onResize }: ResizeHandleProps) => {
  // Use refs instead of state for tracking drag operations
  const isDragging = React.useRef(false);
  const startPoint = React.useRef({ x: 0, y: 0 });
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Set starting point
    startPoint.current = { x: e.clientX, y: e.clientY };
    isDragging.current = true;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      const deltaX = moveEvent.clientX - startPoint.current.x;
      const deltaY = moveEvent.clientY - startPoint.current.y;
      
      let widthChange = 0;
      let heightChange = 0;
      
      // Calculate width/height changes based on handle position
      switch (position) {
        case 'top-left':
          widthChange = -deltaX;
          heightChange = -deltaY;
          break;
        case 'top-right':
          widthChange = deltaX;
          heightChange = -deltaY;
          break;
        case 'bottom-left':
          widthChange = -deltaX;
          heightChange = deltaY;
          break;
        case 'bottom-right':
          widthChange = deltaX;
          heightChange = deltaY;
          break;
      }
      
      // Update start point for next move event
      startPoint.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      
      // Apply resize
      onResize(widthChange, heightChange);
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      upEvent.preventDefault();
      upEvent.stopPropagation();
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add document-level event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, position]);
  
  const getCursorStyle = () => {
    switch (position) {
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize';
      default:
        return 'pointer';
    }
  };
  
  return (
    <div
      className={cn(
        'absolute w-6 h-6 resize-handle',
        position === 'top-left' && 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
        position === 'top-right' && 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
        position === 'bottom-left' && 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
        position === 'bottom-right' && 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
      )}
      style={{ 
        cursor: getCursorStyle(),
        pointerEvents: 'all',
        position: 'absolute',
        zIndex: 9999
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

// Helper function to get shape-specific styles
const getShapeStyles = (shape: NodeShape, width: number, height: number) => {
  const baseStyles: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
  };

  switch (shape) {
    case 'rectangle':
      return { ...baseStyles, borderRadius: '0px' };
    case 'rounded':
      return { ...baseStyles, borderRadius: '8px' };
    case 'pill':
      return { ...baseStyles, borderRadius: '999px' };
    case 'diamond':
      return { 
        ...baseStyles, 
        transform: 'rotate(45deg)',
        // Adjust content to counteract rotation
        '.node-content': {
          transform: 'rotate(-45deg)',
        }
      };
    case 'hexagon':
      return { 
        ...baseStyles, 
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        // Add padding for content inside the hexagon
        padding: '10px 25px',
      };
    case 'circle':
      return { 
        ...baseStyles, 
        borderRadius: '50%',
        // Make width and height equal for perfect circle
        width: `${Math.max(width, height)}px`,
        height: `${Math.max(width, height)}px`,
      };
    case 'parallelogram':
      return { 
        ...baseStyles, 
        transform: 'skew(-20deg)',
        // Adjust content to counteract skewing
        '.node-content': {
          transform: 'skew(20deg)',
        }
      };
    default:
      return { ...baseStyles, borderRadius: '8px' };
  }
};

// Animation variants for different effects
const animationVariants = {
  none: {},
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    }
  },
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }
  },
  wiggle: {
    rotate: [0, -2, 2, -2, 2, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }
  },
};

// Handle positions adjustment for different shapes
const getHandlePositions = (shape: NodeShape) => {
  const basePositions = {
    top: { left: '50%', top: '0%', transform: 'translate(-50%, -50%)' },
    right: { left: '100%', top: '50%', transform: 'translate(50%, -50%)' },
    bottom: { left: '50%', top: '100%', transform: 'translate(-50%, 50%)' },
    left: { left: '0%', top: '50%', transform: 'translate(-50%, -50%)' },
  };

  switch (shape) {
    case 'diamond':
      return {
        top: { left: '50%', top: '0%', transform: 'translate(-50%, -50%) rotate(-45deg)' },
        right: { left: '100%', top: '50%', transform: 'translate(50%, -50%) rotate(-45deg)' },
        bottom: { left: '50%', top: '100%', transform: 'translate(-50%, 50%) rotate(-45deg)' },
        left: { left: '0%', top: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)' },
      };
    case 'hexagon':
      return {
        top: { left: '50%', top: '0%', transform: 'translate(-50%, -50%)' },
        right: { left: '100%', top: '50%', transform: 'translate(50%, -50%)' },
        bottom: { left: '50%', top: '100%', transform: 'translate(-50%, 50%)' },
        left: { left: '0%', top: '50%', transform: 'translate(-50%, -50%)' },
      };
    case 'parallelogram':
      return {
        top: { left: '50%', top: '0%', transform: 'translate(-50%, -50%) skew(20deg)' },
        right: { left: '100%', top: '50%', transform: 'translate(50%, -50%) skew(20deg)' },
        bottom: { left: '50%', top: '100%', transform: 'translate(-50%, 50%) skew(20deg)' },
        left: { left: '0%', top: '50%', transform: 'translate(-50%, -50%) skew(20deg)' },
      };
    default:
      return basePositions;
  }
};

// Get icon placement styles
const getIconPositionStyles = (position: string) => {
  switch (position) {
    case 'left':
      return 'mr-2';
    case 'right':
      return 'ml-2 order-2';
    case 'top':
      return 'mb-2 flex-col';
    case 'bottom':
      return 'mt-2 flex-col-reverse';
    case 'center':
      return 'mb-2 flex-col';
    default:
      return 'mr-2';
  }
};

const BaseNode = memo(({ id, data, selected, isConnectable }: NodeProps<BaseNodeData>) => {
  const { updateNode, selectedNodeIds } = useNodeStore();
  // Get animation state from canvas store
  const isAnimationActive = useCanvasStore(state => state.isAnimationActive);
  
  // Check if any node is selected in the entire canvas
  const anyNodeSelected = selectedNodeIds.length > 0;
  
  // Apply defaults for all node properties
  const nodeColor = data.color || '#444444';
  const showGlow = (data.glowEffect || false) && isAnimationActive; // Only show glow if animation is active
  const glowColor = data.glowColor || nodeColor;
  const glowIntensity = data.glowIntensity || 5;
  const width = data.width || 180;
  const height = data.height || 80;
  const shape = data.shape || 'rounded';
  const borderWidth = data.borderWidth || 1;
  const borderStyle = data.borderStyle || 'solid';
  const textColor = data.textColor || '#ffffff';
  const backgroundColor = data.backgroundColor || '#222222';
  const opacity = data.opacity !== undefined ? data.opacity : 1;
  const shadow = data.shadow || 'md';
  const animation = data.animation || 'none';
  const animationDuration = data.animationDuration || 2;
  const iconSize = data.iconSize || 18;
  const iconPosition = data.iconPosition || 'left';
  
  // Get handle positions based on shape
  const handlePositions = getHandlePositions(shape);
  
  // Calculate shape-specific styles
  const shapeStyles = getShapeStyles(shape, width, height);
  
  // Don't use a ref for element updating - we'll update the store directly
  const handleResize = useCallback((deltaWidth: number, deltaHeight: number) => {
    // Calculate new dimensions with constraints
    const newWidth = Math.max(100, width + deltaWidth); // Minimum width of 100px
    const newHeight = Math.max(50, height + deltaHeight); // Minimum height of 50px
    
    // Update the store with the new dimensions
    updateNode(id, {
      width: newWidth,
      height: newHeight,
    });
  }, [id, width, height, updateNode]);
  
  // Generate border style based on settings
  const getBorderStyle = () => {
    if (borderStyle === 'dashed') return `${borderWidth}px dashed ${nodeColor}`;
    if (borderStyle === 'dotted') return `${borderWidth}px dotted ${nodeColor}`;
    return `${borderWidth}px solid #555555`;
  };
  
  // Generate shadow class based on setting
  const getShadowClass = () => {
    if (shadow === 'none') return '';
    if (shadow === 'sm') return 'shadow-sm';
    if (shadow === 'md') return 'shadow-md';
    if (shadow === 'lg') return 'shadow-lg';
    return 'shadow-sm';
  };
  
  return (
    <motion.div
      className={cn(
        'relative border-2 transition-all duration-100',
        selected ? 'border-blue-500' : 'border-transparent',
        getShadowClass()
      )}
      style={{
        ...shapeStyles,
        border: selected ? `2px solid #3b82f6` : `2px solid transparent`,
        opacity,
      }}
      animate={animation !== 'none' && isAnimationActive ? animationVariants[animation as keyof typeof animationVariants] : undefined}
      transition={{ duration: animationDuration }}
    >
      {/* Actual node shape with styling */}
      <div
        className={cn(
          'absolute inset-0 bg-white dark:bg-gray-800 overflow-hidden',
          shape === 'rounded' && 'rounded-lg',
          shape === 'pill' && 'rounded-full',
          shape === 'circle' && 'rounded-full',
        )}
        style={{
          border: getBorderStyle(),
          backgroundColor,
          color: textColor || (backgroundColor === 'white' ? 'black' : 'white'),
        }}
      >
        {/* Glow effect */}
        {showGlow && (
          <motion.div
            className="absolute inset-0"
            style={{
              zIndex: -1,
              pointerEvents: 'none',
              borderRadius: 'inherit'
            }}
            animate={{
              boxShadow: [
                `0 0 ${glowIntensity}px 0px ${glowColor}`,
                `0 0 ${glowIntensity * 2}px ${glowIntensity / 2}px ${glowColor}`,
                `0 0 ${glowIntensity}px 0px ${glowColor}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Node content */}
        <div 
          className={cn(
            "flex items-center justify-center h-full p-2 node-content",
            iconPosition === 'top' || iconPosition === 'bottom' ? 'flex-col' : 'flex-row',
          )}
        >
          {data.icon && (
            <div className={cn("flex-shrink-0", getIconPositionStyles(iconPosition))}>
              {data.icon.includes(':') ? (
                <Icon 
                  icon={data.icon} 
                  style={{ fontSize: `${iconSize}px` }} 
                  onError={(e) => {
                    console.error(`Failed to load icon: ${data.icon}`, e);
                  }}
                />
              ) : (
                <span style={{ fontSize: `${iconSize}px` }}>{data.icon}</span>
              )}
            </div>
          )}
          <div 
            className={cn(
              "font-medium text-sm overflow-hidden text-ellipsis",
              iconPosition === 'center' && "text-center w-full"
            )}
          >
            {data.label}
          </div>
        </div>
      </div>
      
      {/* Connection handles - always present but only visually shown when needed */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
        style={{
          ...handlePositions.top,
          opacity: anyNodeSelected ? 1 : 0,
          // We must keep pointer events active even when invisible so connections work
          pointerEvents: 'all'
        }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
        style={{
          ...handlePositions.right,
          opacity: anyNodeSelected ? 1 : 0,
          pointerEvents: 'all'
        }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
        style={{
          ...handlePositions.bottom,
          opacity: anyNodeSelected ? 1 : 0,
          pointerEvents: 'all'
        }}
      />
      
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
        style={{
          ...handlePositions.left,
          opacity: anyNodeSelected ? 1 : 0,
          pointerEvents: 'all'
        }}
      />
      
      {/* Resize handles - only show when selected */}
      {selected && (
        <>
          <ResizeHandle position="top-left" onResize={handleResize} />
          <ResizeHandle position="top-right" onResize={handleResize} />
          <ResizeHandle position="bottom-left" onResize={handleResize} />
          <ResizeHandle position="bottom-right" onResize={handleResize} />
        </>
      )}
    </motion.div>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode; 