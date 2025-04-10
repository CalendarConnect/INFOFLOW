'use client';

import { useEffect } from 'react';

export function AdsenseInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize the global adsbygoogle array
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      
      // Handle any ads already in the DOM
      try {
        const adsElements = document.querySelectorAll('ins.adsbygoogle');
        if (adsElements.length > 0) {
          console.log(`Initializing ${adsElements.length} AdSense units`);
          adsElements.forEach(() => {
            (window as any).adsbygoogle.push({});
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