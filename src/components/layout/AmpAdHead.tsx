'use client';

import Script from 'next/script';

export function AmpAdHead() {
  return (
    <>
      {/* AMP script for AMP pages - this is the <script> tag shown in the first screenshot */}
      <Script
        id="amp-ad-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
          `,
        }}
      />
    </>
  );
} 