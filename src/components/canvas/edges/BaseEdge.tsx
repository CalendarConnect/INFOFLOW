'use client';

import React, { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { cn } from '@/lib/utils';

interface BaseEdgeData {
  label?: string;
  animated?: boolean;
  color?: string;
  thickness?: number;
}

const CustomEdge = memo(({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps<BaseEdgeData>) => {
  // Default values if not provided in data
  const color = data?.color || '#64748b';
  const thickness = data?.thickness || 2;
  const animated = data?.animated !== undefined ? data.animated : false;

  // Calculate the path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Add animation and selection styles to the style object
  const pathStyle = {
    ...style,
    stroke: color,
    strokeWidth: thickness,
    strokeDasharray: style?.strokeDasharray || 'none',
  };

  // Apply animation if enabled
  if (animated) {
    pathStyle.strokeDasharray = '5,5';
    pathStyle.animation = 'flow 0.5s linear infinite';
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={pathStyle}
      />
      
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-2 py-1 bg-white dark:bg-gray-800 text-xs rounded-md shadow border border-gray-200 dark:border-gray-700"
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