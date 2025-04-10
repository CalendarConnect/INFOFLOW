'use client';

import { AdSize, AdPosition } from './AdBanner';

interface AmpAdBannerProps {
  size: AdSize;
  position: AdPosition;
  className?: string;
  adSlot?: string;
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
  left: '1013879949',     // Using HZ1 slot for left for now
  right: '1013879949',    // Using HZ1 slot for right for now
};

export function AmpAdBanner({ size, position, className = '', adSlot }: AmpAdBannerProps) {
  const { width, height } = AD_SIZES[size];
  const slotId = adSlot || AD_SLOTS[position];
  
  return (
    <div className={`amp-ad-container ${className}`}>
      {/* 
        This is the AMP-compatible version of the ad that would render in AMP pages.
        In a real implementation, this would be replaced by actual <amp-ad> tags.
        
        Example AMP ad implementation:
        <amp-ad 
          width={width}
          height={height}
          type="adsense"
          data-ad-client="ca-pub-2149767718310603"
          data-ad-slot={slotId}
          data-auto-format="rspv"
          data-full-width="">
          <div overflow=""></div>
        </amp-ad>
      */}
      <div 
        className={`ad-placeholder ad-${position} bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          maxWidth: '100%',
        }}
      >
        <div className="text-gray-400 text-sm text-center">
          {position === 'top' ? 'HZ1 - AMP Horizontal 1' : 
           position === 'bottom' ? 'HZ2 - AMP Horizontal 2' : 
           `AMP Ad (${width}x${height})`}
          <div className="text-xs mt-1">Position: {position}</div>
        </div>
      </div>
    </div>
  );
} 