'use client';

interface AmpAdElementProps {
  width?: string;
  height?: string;
  adSlot: string;
  className?: string;
  adType?: 'horizontal' | 'vertical';
}

/**
 * This component generates the HTML structure for an <amp-ad> element
 * to be used in AMP pages. This component should only be rendered
 * in AMP-enabled pages.
 */
export function AmpAdElement({ 
  width = "100%", 
  height = "100%", 
  adSlot, 
  className = "",
  adType = "horizontal" 
}: AmpAdElementProps) {
  // This is a special component that outputs the correct HTML structure for AMP ads
  // In a real AMP page, this would be server-rendered with the proper <amp-ad> element
  
  return (
    <div 
      className={`amp-ad-element w-full h-full ${className}`}
      dangerouslySetInnerHTML={{
        __html: `
          <amp-ad width="${width}" height="${height}"
            type="adsense"
            data-ad-client="ca-pub-2149767718310603"
            data-ad-slot="${adSlot}"
            data-auto-format="${adType === 'vertical' ? 'rspv' : 'rspv'}"
            data-full-width="true"
            layout="responsive">
            <div overflow=""></div>
          </amp-ad>
        `
      }}
    />
  );
} 