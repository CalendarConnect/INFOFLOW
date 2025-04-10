'use client';

// Modified to remove Convex dependency
export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simply render children without Convex provider
  return <>{children}</>;
} 