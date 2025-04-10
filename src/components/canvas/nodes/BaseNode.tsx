'use client';

import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { cn } from '@/lib/utils';

interface BaseNodeData {
  label: string;
  icon?: string;
  color?: string;
}

const BaseNode = memo(({ id, data, selected, isConnectable }: NodeProps<BaseNodeData>) => {
  const nodeColor = data.color || '#3b82f6'; // Default to blue if no color provided
  
  return (
    <div
      className={cn(
        'px-4 py-2 rounded-lg border-2 shadow-sm bg-white dark:bg-gray-800 transition-all duration-200',
        selected ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'
      )}
      style={{
        borderLeftColor: nodeColor,
        borderLeftWidth: '4px',
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
      />
      
      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
      />
      
      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
      />
      
      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-800"
      />
      
      {/* Node content */}
      <div className="flex items-center">
        {data.icon && (
          <div className="mr-2 flex-shrink-0">
            <span className="text-lg">{data.icon}</span>
          </div>
        )}
        <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {data.label}
        </div>
      </div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode; 