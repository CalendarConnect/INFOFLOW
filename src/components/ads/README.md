# FlowCanvas Ad Implementation Guide

This directory contains components for implementing Google AdSense ads in FlowCanvas.

## Ad Units

FlowCanvas uses the following ad units:

| Name | Position | Ad Slot      | Size      | Description        |
|------|----------|--------------|-----------|-------------------|
| HZ1  | Top      | 1013879949   | 728x90    | Top horizontal banner |
| HZ2  | Bottom   | 9387666749   | 728x90    | Bottom horizontal banner |
| VL1  | Left     | 8620907222   | 160x600   | Left vertical skyscraper |
| VR1  | Right    | 8340100968   | 160x600   | Right vertical skyscraper |

## AdSense Implementation

FlowCanvas uses the standard Google AdSense HTML code snippets. The ads are implemented via the `AdBanner` component which dynamically injects the required AdSense code:

```tsx
import { AdBanner } from "@/components/ads/AdBanner";

// HZ1 - Top banner
<AdBanner 
  size="leaderboard" 
  position="top" 
  adSlot="1013879949"
  className="hz1-ad-unit w-full" 
/>

// HZ2 - Bottom banner
<AdBanner 
  size="leaderboard" 
  position="bottom" 
  adSlot="9387666749"
  className="hz2-ad-unit w-full"
/>

// VL1 - Left vertical banner
<AdBanner 
  size="skyscraper" 
  position="left" 
  adSlot="8620907222"
  className="vl1-ad-unit h-full" 
/>

// VR1 - Right vertical banner
<AdBanner 
  size="skyscraper" 
  position="right" 
  adSlot="8340100968"
  className="vr1-ad-unit h-full" 
/>
```

## Standard AdSense HTML

Under the hood, each ad unit uses the following standard AdSense HTML structure:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2149767718310603"
     crossorigin="anonymous"></script>
<!-- [AD_NAME] -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2149767718310603"
     data-ad-slot="[AD_SLOT]"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## Full Page Layout

For a complete page layout with all ad units, use the provided layout component:

```tsx
import { AdLayout } from "@/components/layout/AdLayout";

<AdLayout>
  {/* Your page content */}
</AdLayout>
```

## AdSense Script Loading

The AdSense script is loaded once at the application level in the root layout:

```tsx
// In app/layout.tsx
<head>
  <Script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2149767718310603"
    strategy="beforeInteractive"
    crossOrigin="anonymous"
  />
</head>
```

## Responsive Behavior

All ad units are configured to be responsive:

- Horizontal ads (HZ1, HZ2) will expand to fill their containers up to 728px width
- Vertical ads (VL1, VR1) will expand to fill their containers vertically
- All ads maintain minimum sizes based on standard ad dimensions
- The `data-full-width-responsive="true"` attribute enables responsive behavior

## Troubleshooting

- If ads aren't appearing, check the browser console for errors
- Make sure the AdSense account is approved and active
- Verify that the ad slots are correctly configured in the AdSense dashboard
- Check network requests to ensure the AdSense script is loading correctly
- For responsive issues, ensure container elements have appropriate sizing 