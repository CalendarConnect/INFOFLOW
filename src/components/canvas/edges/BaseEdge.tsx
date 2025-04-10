'use client';

import React, { memo, useMemo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { EdgeData } from '@/store/edgeStore';
import { useCanvasStore } from '@/store/canvasStore';

// Define keyframe animations for edges and dots
const EdgeAnimations = ({ id, path, source, target }: { id: string, path: string, source: { x: number, y: number }, target: { x: number, y: number } }) => (
  <style jsx global>{`
    /* --- EDGE LINE ANIMATIONS --- */
    @keyframes flow-forward {
      from { stroke-dashoffset: 20; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes flow-backward {
      from { stroke-dashoffset: 0; }
      to { stroke-dashoffset: 20; }
    }
    
    @keyframes pulse {
      0% { stroke-width: var(--base-thickness); stroke-opacity: 0.8; }
      50% { stroke-width: calc(var(--base-thickness) * 1.5); stroke-opacity: 1; }
      100% { stroke-width: var(--base-thickness); stroke-opacity: 0.8; }
    }
    
    @keyframes dash-forward {
      from { stroke-dashoffset: 20; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes dash-backward {
      from { stroke-dashoffset: 0; }
      to { stroke-dashoffset: 20; }
    }
    
    @keyframes rainbow {
      0% { stroke: #ff0000; }
      16% { stroke: #ff8000; }
      33% { stroke: #ffff00; }
      50% { stroke: #00ff00; }
      67% { stroke: #0000ff; }
      83% { stroke: #8000ff; }
      100% { stroke: #ff0000; }
    }
    
    @keyframes laser {
      0% { stroke-opacity: 0.2; filter: drop-shadow(0 0 2px var(--edge-color)); }
      50% { stroke-opacity: 1; filter: drop-shadow(0 0 8px var(--edge-color)); }
      100% { stroke-opacity: 0.2; filter: drop-shadow(0 0 2px var(--edge-color)); }
    }
    
    @keyframes glow {
      0% { filter: drop-shadow(0 0 2px var(--edge-color)); }
      50% { filter: drop-shadow(0 0 10px var(--edge-color)) drop-shadow(0 0 20px var(--edge-color)); }
      100% { filter: drop-shadow(0 0 2px var(--edge-color)); }
    }
    
    @keyframes wave {
      0% { stroke-width: var(--base-thickness); }
      25% { stroke-width: calc(var(--base-thickness) * 1.5); }
      50% { stroke-width: var(--base-thickness); }
      75% { stroke-width: calc(var(--base-thickness) * 0.5); }
      100% { stroke-width: var(--base-thickness); }
    }
    
    /* --- DOT ANIMATIONS --- */
    @keyframes dot-pulse {
      0% { r: var(--dot-size); opacity: 0.7; }
      50% { r: calc(var(--dot-size) * 1.3); opacity: 1; }
      100% { r: var(--dot-size); opacity: 0.7; }
    }
    
    @keyframes dot-grow {
      0% { r: calc(var(--dot-size) * 0.5); }
      50% { r: calc(var(--dot-size) * 1.5); }
      100% { r: calc(var(--dot-size) * 0.5); }
    }
    
    @keyframes dot-fadeIn {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    @keyframes dot-bounce {
      0%, 100% { cy: 0; }
      50% { cy: -10px; }
    }
    
    @keyframes dot-accelerate {
      0% { 
        motion-offset: 0%; 
        r: calc(var(--dot-size) * 0.8);
      }
      10% { 
        motion-offset: 5%; 
        r: calc(var(--dot-size) * 0.9);
      }
      60% { 
        motion-offset: 60%; 
        r: var(--dot-size); 
      }
      100% { 
        motion-offset: 100%; 
        r: calc(var(--dot-size) * 1.2);
      }
    }
    
    /* Dot traffic colors */
    @keyframes dot-traffic {
      0%, 33% { fill: red; }
      33%, 66% { fill: #ffcc00; }
      66%, 100% { fill: #00cc00; }
    }
    
    /* Simple linear dot motion along a straight line */
    @keyframes moveAlongPath${id} {
      0% {
        cx: ${source.x}px;
        cy: ${source.y}px;
      }
      100% {
        cx: ${target.x}px;
        cy: ${target.y}px;
      }
    }
    
    /* Dot animations */
    .dot {
      r: var(--dot-size);
      fill: var(--dot-color);
      filter: drop-shadow(0 0 3px var(--dot-color));
    }
    
    .dot-pulse {
      animation: dot-pulse var(--animation-speed) ease-in-out infinite;
    }
    
    .dot-traffic {
      animation: dot-traffic calc(var(--animation-speed) * 3) steps(1) infinite;
    }
  `}</style>
);

// Helper function to create SVG path for zigzag pattern
const createZigzagPath = (path: string): string => {
  // Simple implementation - in a real product we would implement proper path parsing
  return path;
};

const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style: edgeStyle = {},
  markerEnd,
  data,
  selected,
}: EdgeProps<EdgeData>) => {
  // Get global animation state
  const isAnimationActive = useCanvasStore(state => state.isAnimationActive);
  
  // Default values if not provided in data
  const color = data?.color || '#64748b';
  const thickness = data?.thickness || 2;
  const animated = data?.animated !== undefined ? data.animated : false;
  const showDot = data?.showDot !== undefined ? data.showDot : false;
  const dotSize = data?.dotSize || 4;
  const dotColor = data?.dotColor || color;
  const dotCount = data?.dotCount || 1;
  const animationSpeed = data?.animationSpeed || 2;
  const lineStyle = data?.lineStyle || 'solid';
  const animationType = data?.animationType || 'flow';
  const dotAnimationType = data?.dotAnimationType || 'standard';
  const endArrow = data?.endArrow !== undefined ? data.endArrow : false;
  const startArrow = data?.startArrow || false;
  const bidirectional = data?.bidirectional || false;
  const pattern = data?.pattern || 'solid';
  const curvature = data?.curvature !== undefined ? data.curvature : 0.5;
  const opacity = data?.opacity !== undefined ? data.opacity : 1;
  const shadowColor = data?.shadowColor || color;
  const shadowBlur = data?.shadowBlur || 0;
  const gradientColors = data?.gradientColors || [color, '#ffffff'];
  const labelBgColor = data?.labelBgColor || '#ffffff';
  const labelTextColor = data?.labelTextColor || '#000000';
  const reverseAnimation = data?.reverseAnimation !== undefined ? data.reverseAnimation : false;

  // For debugging: Log edge properties when selected
  React.useEffect(() => {
    if (selected) {
      console.log(`Edge ${id} selected:`, {
        lineStyle,
        pattern,
        thickness,
        animated,
        animationType,
        showDot,
        dotCount,
        dotAnimationType,
        data
      });
    }
  }, [selected, id, lineStyle, pattern, thickness, animated, animationType, showDot, dotCount, dotAnimationType, data]);

  // Generate unique IDs for markers and gradients
  const startArrowId = `start-arrow-${id}`;
  const endArrowId = `end-arrow-${id}`;
  const gradientId = `edge-gradient-${id}`;

  // Calculate the path with custom curvature
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature,
  });

  // Create zigzag path if needed
  const finalPath = pattern === 'zigzag' ? createZigzagPath(edgePath) : edgePath;

  // Determine stroke dash array based on line style and pattern
  const dashArray = useMemo(() => {
    // Pattern takes precedence over lineStyle
    switch (pattern) {
      case 'dashed':
        return `${thickness * 3} ${thickness * 2}`;
      case 'dotted':
        return `${thickness} ${thickness * 2}`;
      default:
        // If pattern isn't dashed/dotted, check lineStyle
        switch (lineStyle) {
          case 'dashed':
            return `${thickness * 3} ${thickness * 2}`;
          case 'dotted':
            return `${thickness} ${thickness * 2}`;
          default:
            return 'none';
        }
    }
  }, [pattern, lineStyle, thickness]);

  // Create the appropriate path style for the edge type
  const pathStyle = useMemo(() => {
    // Start with the base style
    const calculatedStyle: Record<string, unknown> = {
      stroke: pattern === 'gradient' ? `url(#${gradientId})` : color,
      strokeWidth: thickness,
      opacity,
      ...edgeStyle
    };
    
    // CSS custom properties
    calculatedStyle['--edge-color'] = color;
    calculatedStyle['--base-thickness'] = `${thickness}px`;
    calculatedStyle['--dot-size'] = `${dotSize}px`;
    calculatedStyle['--dot-color'] = dotColor;
    calculatedStyle['--animation-speed'] = `${animationSpeed}s`;
    
    // Add stroke dash array for dashed or dotted lines
    if (dashArray !== 'none') {
      // For flow and dash animations, we need to set the dash array but let the animation control it
      if (animated && isAnimationActive && 
         (animationType === 'flow' || animationType === 'dash')) {
        calculatedStyle.strokeDasharray = '5, 5';
        
        // Apply the appropriate animation based on the type and direction
        const direction = reverseAnimation ? 'forward' : 'backward';
        if (animationType === 'flow') {
          calculatedStyle.animation = `flow-${direction} ${animationSpeed}s linear infinite`;
        } else if (animationType === 'dash') {
          calculatedStyle.animation = `dash-${direction} ${animationSpeed}s linear infinite`;
        }
      } else {
        // For non-animated paths or other animation types, just apply the dash array
        calculatedStyle.strokeDasharray = dashArray;
      }
    }
    
    // Apply other animations if needed
    if (animated && isAnimationActive && animationType !== 'none' && 
        animationType !== 'flow' && animationType !== 'dash') {
      
      switch (animationType) {
        case 'pulse':
          calculatedStyle.animation = `pulse ${animationSpeed}s infinite ease-in-out`;
          break;
        case 'rainbow':
          calculatedStyle.animation = `rainbow ${animationSpeed * 2}s linear infinite`;
          break;
        case 'laser':
          calculatedStyle.animation = `laser ${animationSpeed / 2}s ease-in-out infinite`;
          break;
        case 'glow':
          calculatedStyle.animation = `glow ${animationSpeed}s ease-in-out infinite`;
          break;
        case 'wave':
          calculatedStyle.animation = `wave ${animationSpeed}s ease-in-out infinite`;
          break;
      }
    }
    
    // Add selection styling
    if (selected) {
      calculatedStyle.filter = `drop-shadow(0 0 2px ${color})`;
      calculatedStyle.strokeWidth = thickness + 1;
    }
    
    // Add shadow if enabled
    if (shadowBlur > 0) {
      calculatedStyle.filter = `drop-shadow(0 0 ${shadowBlur}px ${shadowColor})`;
    }
    
    return calculatedStyle as React.CSSProperties;
  }, [
    pattern, color, thickness, opacity, animated, isAnimationActive, 
    dashArray, selected, shadowBlur, shadowColor,
    animationType, dotSize, dotColor, animationSpeed, gradientId,
    reverseAnimation, edgeStyle
  ]);

  // Generate dots for the edge
  const renderDots = () => {
    // More comprehensive debugging
    console.log(`Edge ${id} dot rendering:`, {
      showDot,
      isAnimationActive,
      dotCount,
      animationType,
      reverseAnimation,
      animationSpeed,
      dotAnimationType,
      edgePath,
      finalPath,
      sourceX,
      sourceY,
      targetX,
      targetY
    });
    
    // Now actually check both flags
    if (!showDot || !isAnimationActive) {
      return null;
    }
    
    // We'll use a simpler, more direct approach that should work in all browsers
    return Array.from({ length: dotCount > 0 ? dotCount : 3 }).map((_, index) => {
      // Evenly distribute traffic light colors
      const isTraffic = animationType === 'traffic' || dotAnimationType === 'traffic';
      const dotFill = isTraffic 
        ? (index % 3 === 0 ? 'red' : index % 3 === 1 ? '#ffcc00' : '#00cc00') 
        : dotColor;
      
      // Calculate an offset for this dot based on its index and dot count
      const delay = (index / dotCount) * animationSpeed;
      
      // Configure specific dot animations based on preset type
      let additionalProps = {};
      let circleClassName = '';
      
      switch (dotAnimationType) {
        case 'pulse':
          circleClassName = 'dot-pulse';
          break;
        case 'grow':
          additionalProps = {
            style: { 
              animation: `dot-grow ${animationSpeed}s infinite ease-in-out`,
              animationDelay: `${delay}s`
            }
          };
          break;
        case 'fadeIn':
          additionalProps = {
            style: { 
              animation: `dot-fadeIn ${animationSpeed}s infinite ease-in-out`,
              animationDelay: `${delay}s`
            }
          };
          break;
        case 'bounce':
          // We'll handle the bounce effect using a different approach
          // as it needs to work with the motion path
          break;
        case 'accelerate':
          // Acceleration is handled via the animateMotion element
          break;
        case 'traffic':
          circleClassName = 'dot-traffic';
          break;
        default:
          // Standard dot animation
          break;
      }
      
      return (
        <g key={`dot-${id}-${index}`}>
          {/* Use proper SVG path animation that follows the exact curve */}
          <circle
            r={dotSize}
            fill={dotFill}
            filter={`drop-shadow(0 0 3px ${dotFill})`}
            style={{ opacity: 0.9 }}
            className={circleClassName}
            {...additionalProps}
          >
            <animateMotion
              path={finalPath}
              dur={dotAnimationType === 'accelerate' ? `${animationSpeed * 1.5}s` : `${animationSpeed}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
              rotate="auto"
              calcMode={dotAnimationType === 'accelerate' ? 'spline' : 'linear'}
              keySplines={dotAnimationType === 'accelerate' ? "0.42 0 1 1" : undefined}
              keyPoints={reverseAnimation ? "0;1" : "1;0"}
              keyTimes="0;1"
            >
              {dotAnimationType === 'bounce' && (
                <animate
                  attributeName="cy"
                  values="0;-5;0"
                  dur={`${animationSpeed / 2}s`}
                  repeatCount="indefinite"
                />
              )}
            </animateMotion>
          </circle>
        </g>
      );
    });
  };

  return (
    <>
      {/* Global animation definitions */}
      <EdgeAnimations id={id} path={finalPath} source={{ x: sourceX, y: sourceY }} target={{ x: targetX, y: targetY }} />
      
      {/* SVG Definitions */}
      <defs>
        {/* Start Arrow */}
        {(startArrow || bidirectional) && (
          <marker
            id={startArrowId}
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        )}
        
        {/* End Arrow */}
        {(endArrow || bidirectional) && (
          <marker
            id={endArrowId}
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        )}
        
        {/* Gradient definition */}
        {pattern === 'gradient' && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientColors.map((color, index) => (
              <stop 
                key={index} 
                offset={`${index * (100 / (gradientColors.length - 1))}%`} 
                stopColor={color} 
              />
            ))}
          </linearGradient>
        )}
      </defs>
      
      {/* Double line pattern */}
      {pattern === 'double' && (
        <BaseEdge
          path={finalPath}
          style={{
            ...pathStyle,
            strokeWidth: thickness * 2.5,
            stroke: 'white',
          }}
        />
      )}
      
      {/* Main edge path */}
      <BaseEdge
        path={finalPath}
        markerEnd={endArrow || bidirectional ? `url(#${endArrowId})` : markerEnd}
        markerStart={startArrow || bidirectional ? `url(#${startArrowId})` : undefined}
        style={pathStyle}
      />
      
      {/* Animated dots */}
      {renderDots()}
      
      {/* Edge label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              backgroundColor: labelBgColor,
              color: labelTextColor,
            }}
            className="px-2 py-1 text-xs rounded-md shadow border border-gray-200 dark:border-gray-700"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge; 