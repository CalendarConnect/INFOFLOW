'use client';

interface AmpAdProps {
  width?: string;
  height?: string;
  adSlot: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  adType?: 'horizontal' | 'vertical';
}

const AD_SLOTS = {
  top: '1013879949',      // HZ1 - Horizontal 1 (top banner)
  bottom: '9387666749',   // HZ2 - Horizontal 2 (bottom banner)
  left: '8620907222',     // VL1 - Vertical Left 1 (skyscraper)
  right: '8340100968',    // VR1 - Vertical Right 1 (skyscraper)
};

export function AmpAd({ 
  width = "100%", 
  height = "100%", 
  adSlot, 
  className = "",
  position,
  // Keep adType in the parameters even if not directly used
  // to maintain API compatibility and for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adType = "horizontal"
}: AmpAdProps) {
  const slotId = adSlot || (position ? AD_SLOTS[position] : '');
  
  return (
    <div className={`amp-ad-wrapper w-full h-full ${className}`}>
      {/* This would be replaced with an actual <amp-ad> element in AMP pages */}
      {/* 
        In a real AMP page, this would be rendered as:
        
        <amp-ad width="100%" height="100%"
          type="adsense"
          data-ad-client="ca-pub-2149767718310603"
          data-ad-slot={slotId}
          data-auto-format="rspv"
          data-full-width="true"
          layout="responsive">
          <div overflow=""></div>
        </amp-ad>
      */}
      
      {/* This is a placeholder that can be used for non-AMP pages */}
      <div 
        className="amp-ad-placeholder bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center w-full h-full"
        style={{ 
          minHeight: position === 'top' || position === 'bottom' ? '90px' : '600px',
          minWidth: position === 'left' || position === 'right' ? '160px' : '100%'
        }}
      >
        <div className="text-gray-400 text-sm text-center">
          {position === 'top' ? 'HZ1 - AMP Horizontal 1' : 
           position === 'bottom' ? 'HZ2 - AMP Horizontal 2' : 
           position === 'left' ? 'VL1 - AMP Vertical Left 1' :
           position === 'right' ? 'VR1 - AMP Vertical Right 1' :
           'AMP Ad Placeholder'}
          <div className="text-xs mt-1">Slot: {slotId || adSlot}</div>
          <div className="text-xs">Responsive: {width} x {height}</div>
        </div>
      </div>
    </div>
  );
} 