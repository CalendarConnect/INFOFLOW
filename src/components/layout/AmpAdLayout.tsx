'use client';

import { AmpAd } from "@/components/ads/AmpAd";
import { ReactNode } from "react";

interface AmpAdLayoutProps {
  children: ReactNode;
}

/**
 * AMP-compatible layout with ad units
 * This component should be used in AMP pages
 */
export function AmpAdLayout({ children }: AmpAdLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* HZ1 - Top Horizontal Banner (Ad Slot: 1013879949) */}
      <div className="w-full flex-shrink-0 h-[90px] flex justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-[728px] h-full">
          <AmpAd
            adSlot="1013879949"
            position="top"
            className="hz1-amp-ad-unit"
          />
        </div>
      </div>
      
      {/* Main Content with Side Banners */}
      <div className="flex-1 flex overflow-hidden">
        {/* VL1 - Left Vertical Banner (Ad Slot: 8620907222) */}
        <div className="w-[160px] flex-shrink-0 h-full flex justify-center border-r border-gray-200 dark:border-gray-700">
          <div className="w-full h-full">
            <AmpAd
              adSlot="8620907222"
              position="left"
              adType="vertical"
              className="vl1-amp-ad-unit"
            />
          </div>
        </div>
        
        {/* Center Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
        
        {/* VR1 - Right Vertical Banner (Ad Slot: 9340100968) */}
        <div className="w-[160px] flex-shrink-0 h-full flex justify-center border-l border-gray-200 dark:border-gray-700">
          <div className="w-full h-full">
            <AmpAd
              adSlot="9340100968"
              position="right"
              adType="vertical"
              className="vr1-amp-ad-unit"
            />
          </div>
        </div>
      </div>
      
      {/* HZ2 - Bottom Horizontal Banner (Ad Slot: 9387666749) */}
      <div className="w-full flex-shrink-0 h-[90px] flex justify-center border-t border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-[728px] h-full">
          <AmpAd
            adSlot="9387666749"
            position="bottom"
            className="hz2-amp-ad-unit"
          />
        </div>
      </div>
    </div>
  );
} 