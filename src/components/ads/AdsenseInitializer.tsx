'use client';

import { useEffect } from 'react';

// Safer TypeScript approach that doesn't require complex interface definitions
export function AdsenseInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize the global adsbygoogle array using a safer type approach
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      
      // Handle any ads already in the DOM
      try {
        const adsElements = document.querySelectorAll('ins.adsbygoogle');
        if (adsElements.length > 0) {
          console.log(`Initializing ${adsElements.length} AdSense units`);
          adsElements.forEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((window as any).adsbygoogle || []).push({});
          });
        }
      } catch (error) {
        console.error('Error initializing AdSense:', error);
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
} 