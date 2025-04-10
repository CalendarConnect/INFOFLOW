// This file contains utility functions for managing Google AdSense integration

const PUBLISHER_ID = 'ca-pub-2149767718310603';

interface AdConfig {
  slot: string;
  name: string;
  format?: string;
  fullWidthResponsive?: boolean;
}

/**
 * Creates and injects a standard AdSense ad unit into a container element
 * @param container The DOM element to inject the ad into
 * @param config The configuration for the ad unit
 */
export function injectAdSenseAd(container: HTMLElement, config: AdConfig): void {
  if (!container) return;
  
  try {
    // Clear the container
    container.innerHTML = '';
    
    // Create the HTML structure for the ad
    container.innerHTML = `
      <!-- ${config.name} -->
      <ins class="adsbygoogle"
           style="display:block;width:100%;height:100%;"
           data-ad-client="${PUBLISHER_ID}"
           data-ad-slot="${config.slot}"
           data-ad-format="${config.format || 'auto'}"
           data-full-width-responsive="${config.fullWidthResponsive === false ? 'false' : 'true'}"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    `;
  } catch (error) {
    console.error('Error injecting AdSense ad:', error);
  }
}

/**
 * Refreshes all ads on the page by reinitializing the adsbygoogle push
 */
export function refreshAds(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adsbygoogle = (window as any).adsbygoogle;
    if (adsbygoogle) {
      document.querySelectorAll('ins.adsbygoogle').forEach(() => {
        adsbygoogle.push({});
      });
    }
  } catch (error) {
    console.error('Error refreshing ads:', error);
  }
} 