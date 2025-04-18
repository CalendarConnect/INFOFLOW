'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getIntegrationIconPath } from '@/lib/integrationIcons';
import { cn } from '@/lib/utils';

interface IntegrationIconProps {
  iconId: string;
  className?: string;
  size?: number;
  onClick?: () => void;
}

export function IntegrationIcon({ iconId, className, size = 24, onClick }: IntegrationIconProps) {
  const [error, setError] = useState(false);
  
  if (error) {
    return null;
  }
  
  const iconPath = getIntegrationIconPath(iconId);
  
  if (!iconPath) {
    return null;
  }
  
  return (
    <div 
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <Image
        src={iconPath}
        alt={`${iconId} icon`}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
} 