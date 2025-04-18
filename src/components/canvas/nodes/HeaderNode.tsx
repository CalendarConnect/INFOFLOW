'use client';

import React, { memo, useCallback } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNodeStore } from '@/store/nodeStore';
import { useCanvasStore } from '@/store/canvasStore';

export interface HeaderNodeData {
  text: string;
  level: 'h1' | 'h2' | 'h3'; // h1 for header, h2/h3 for subheaders
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily: 'sans' | 'serif' | 'mono';
  color: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
  opacity?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  width?: number;
}

interface ResizeHandleProps {
  position: 'left' | 'right';
  onResize: (deltaWidth: number) => void;
}

const ResizeHandle = ({ position, onResize }: ResizeHandleProps) => {
  const isDragging = React.useRef(false);
  const startPoint = React.useRef({ x: 0 });
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    startPoint.current = { x: e.clientX };
    isDragging.current = true;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      const deltaX = moveEvent.clientX - startPoint.current.x;
      
      let widthChange = position === 'right' ? deltaX : -deltaX;
      
      startPoint.current = { x: moveEvent.clientX };
      
      onResize(widthChange);
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      upEvent.preventDefault();
      upEvent.stopPropagation();
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, position]);
  
  return (
    <div
      className={cn(
        'absolute w-4 h-full resize-handle',
        position === 'left' && 'left-0 -translate-x-1/2',
        position === 'right' && 'right-0 translate-x-1/2',
      )}
      style={{ 
        cursor: 'ew-resize',
        pointerEvents: 'all',
        position: 'absolute',
        zIndex: 9999
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-2 h-6 bg-blue-500 border-2 border-white rounded-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

// Get font size based on header level
const getFontSize = (level: string, fontSize: number) => {
  if (fontSize) return fontSize;
  
  switch (level) {
    case 'h1': return 28;
    case 'h2': return 22;
    case 'h3': return 18;
    default: return 28;
  }
};

// Get font weight based on settings
const getFontWeight = (weight: string) => {
  switch (weight) {
    case 'normal': return 400;
    case 'medium': return 500;
    case 'semibold': return 600;
    case 'bold': return 700;
    default: return 600;
  }
};

// Get font family class
const getFontFamilyClass = (family: string) => {
  switch (family) {
    case 'sans': return 'font-sans';
    case 'serif': return 'font-serif';
    case 'mono': return 'font-mono';
    default: return 'font-sans';
  }
};

// Generate shadow class based on setting
const getShadowClass = (shadow: string = 'none') => {
  if (shadow === 'none') return '';
  if (shadow === 'sm') return 'shadow-sm';
  if (shadow === 'md') return 'shadow-md';
  if (shadow === 'lg') return 'shadow-lg';
  return '';
};

// Get text alignment class
const getAlignmentClass = (alignment: string) => {
  switch (alignment) {
    case 'left': return 'text-left';
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
};

const HeaderNode = memo(({ id, data, selected }: NodeProps<HeaderNodeData>) => {
  const { updateNode, selectedNodeIds } = useNodeStore();
  
  // Apply defaults for all node properties
  const level = data.level || 'h1';
  const fontSize = getFontSize(level, data.fontSize || 0);
  const fontWeight = data.fontWeight || 'semibold';
  const fontFamily = data.fontFamily || 'sans';
  const color = data.color || '#ffffff';
  const alignment = data.alignment || 'left';
  const backgroundColor = data.backgroundColor;
  const opacity = data.opacity !== undefined ? data.opacity : 1;
  const shadow = data.shadow || 'none';
  const width = data.width || 320;
  
  // Reference to the text element for direct editing
  const textRef = React.useRef<HTMLHeadingElement>(null);
  
  // Handle resize
  const handleResize = useCallback((deltaWidth: number) => {
    // Calculate new width with constraints
    const newWidth = Math.max(100, width + deltaWidth); // Minimum width of 100px
    
    // Update the store with the new width
    updateNode(id, {
      width: newWidth,
    });
  }, [id, width, updateNode]);
  
  // Enable content editing when double-clicked
  const handleDoubleClick = () => {
    if (textRef.current) {
      textRef.current.contentEditable = 'true';
      textRef.current.focus();
      
      // Select all text
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };
  
  // Save content when focus is lost
  const handleBlur = () => {
    if (textRef.current) {
      textRef.current.contentEditable = 'false';
      
      // Update store with new text if changed
      if (textRef.current.textContent !== data.text) {
        updateNode(id, {
          text: textRef.current.textContent || '',
        });
      }
    }
  };
  
  // Prevent node selection change when editing text
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textRef.current?.blur();
    }
  };
  
  return (
    <motion.div
      className={cn(
        'relative border-2 transition-all duration-100',
        selected ? 'border-blue-500' : 'border-transparent',
        getShadowClass(shadow)
      )}
      style={{
        width: `${width}px`,
        minHeight: '40px',
        border: selected ? `2px solid #3b82f6` : `2px solid transparent`,
        opacity,
        backgroundColor: backgroundColor || 'transparent',
      }}
    >
      {/* Header content */}
      <div 
        className={cn(
          "py-1 px-0.5 h-full node-content flex items-center",
          getAlignmentClass(alignment),
          getFontFamilyClass(fontFamily)
        )}
      >
        {level === 'h1' && (
          <h1 
            ref={textRef}
            className="outline-none w-full"
            style={{ 
              fontSize: `${fontSize}px`,
              fontWeight: getFontWeight(fontWeight),
              color 
            }}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          >
            {data.text}
          </h1>
        )}
        
        {level === 'h2' && (
          <h2 
            ref={textRef}
            className="outline-none w-full"
            style={{ 
              fontSize: `${fontSize}px`,
              fontWeight: getFontWeight(fontWeight),
              color 
            }}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          >
            {data.text}
          </h2>
        )}
        
        {level === 'h3' && (
          <h3 
            ref={textRef}
            className="outline-none w-full"
            style={{ 
              fontSize: `${fontSize}px`,
              fontWeight: getFontWeight(fontWeight),
              color 
            }}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          >
            {data.text}
          </h3>
        )}
      </div>
      
      {/* Resize handles - only show when selected */}
      {selected && (
        <>
          <ResizeHandle position="left" onResize={handleResize} />
          <ResizeHandle position="right" onResize={handleResize} />
        </>
      )}
    </motion.div>
  );
});

HeaderNode.displayName = 'HeaderNode';

export default HeaderNode; 