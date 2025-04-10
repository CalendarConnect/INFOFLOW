'use client';

import { AdBanner } from "@/components/ads/AdBanner";
import { ReactNode } from "react";

interface AdLayoutProps {
  children: ReactNode;
}

export function AdLayout({ children }: AdLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* HZ1 - Top Horizontal Banner (Ad Slot: 1013879949) */}
      <div className="w-full flex-shrink-0 h-[90px] flex justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-[728px] h-full flex items-center justify-center">
          <AdBanner 
            size="leaderboard" 
            position="top" 
            adSlot="1013879949"
            className="hz1-ad-unit w-full" 
          />
        </div>
      </div>
      
      {/* Main Content with Side Banners */}
      <div className="flex-1 flex overflow-hidden">
        {/* VL1 - Left Vertical Banner (Ad Slot: 8620907222) */}
        <div className="w-[160px] flex-shrink-0 h-full flex justify-center border-r border-gray-200 dark:border-gray-700">
          <div className="w-full h-full flex items-center justify-center">
            <AdBanner 
              size="skyscraper" 
              position="left" 
              adSlot="8620907222"
              className="vl1-ad-unit h-full" 
            />
          </div>
        </div>
        
        {/* Center Content */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
        
        {/* VR1 - Right Vertical Banner (Ad Slot: 9340100968) */}
        <div className="w-[160px] flex-shrink-0 h-full flex justify-center border-l border-gray-200 dark:border-gray-700">
          <div className="w-full h-full flex items-center justify-center">
            <AdBanner 
              size="skyscraper" 
              position="right" 
              adSlot="9340100968"
              className="vr1-ad-unit h-full"
            />
          </div>
        </div>
      </div>
      
      {/* HZ2 - Bottom Horizontal Banner (Ad Slot: 9387666749) */}
      <div className="w-full flex-shrink-0 h-[90px] flex justify-center border-t border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-[728px] h-full flex items-center justify-center">
          <AdBanner 
            size="leaderboard" 
            position="bottom" 
            adSlot="9387666749"
            className="hz2-ad-unit w-full"
          />
        </div>
      </div>
    </div>
  );
} 