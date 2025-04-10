'use client';

import { useEffect, useRef } from 'react';
import { injectAdSenseAd } from '@/lib/adsense';

export type AdSize = 'leaderboard' | 'skyscraper' | 'rectangle';
export type AdPosition = 'top' | 'bottom' | 'left' | 'right';

interface AdBannerProps {
  size: AdSize;
  position: AdPosition;
  className?: string;
  adSlot?: string; // Google AdSense ad slot ID
}

// Ad size configurations
const AD_SIZES = {
  leaderboard: { width: 728, height: 90 },    // Horizontal banner
  skyscraper: { width: 160, height: 600 },    // Vertical banner
  rectangle: { width: 300, height: 250 },     // Medium rectangle
};

// Ad unit mapping by position (with real ad slots)
const AD_SLOTS = {
  top: '1013879949',      // HZ1 - Horizontal 1 (top banner)
  bottom: '9387666749',   // HZ2 - Horizontal 2 (bottom banner)
  left: '8620907222',     // VL1 - Vertical Left 1 (skyscraper)
  right: '8340100968',    // VR1 - Vertical Right 1 (skyscraper)
};

// Ad unit names by position
const AD_NAMES = {
  top: 'HZ1',
  bottom: 'HZ2',
  left: 'VL1',
  right: 'VR1',
};

export function AdBanner({ size, position, className = '', adSlot }: AdBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const currentSlot = adSlot || AD_SLOTS[position];
  const adName = AD_NAMES[position];
  
  useEffect(() => {
    // Only execute on client-side
    if (typeof window !== 'undefined' && adContainerRef.current) {
      // Use the utility function to inject the ad
      injectAdSenseAd(adContainerRef.current, {
        slot: currentSlot,
        name: adName,
        format: 'auto',
        fullWidthResponsive: true
      });
    }
  }, [position, currentSlot, adName]);
  
  const { width, height } = AD_SIZES[size];
  
  return (
    <div 
      ref={adContainerRef}
      className={`ad-container ad-${position} bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center w-full h-full ${className}`}
      style={{ 
        minWidth: `${width}px`, 
        minHeight: `${height}px`,
        maxWidth: '100%',
      }}
      data-ad-slot={currentSlot}
      data-ad-name={adName}
    >
      {/* Placeholder content that will be replaced by the AdSense code */}
      <div className="text-gray-400 text-sm text-center">
        {adName} - Loading Ad...
        <div className="text-xs mt-1">Slot: {currentSlot}</div>
      </div>
    </div>
  );
} 