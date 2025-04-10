'use client';

import { AdLayout } from '@/components/layout/AdLayout';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AdLayout>
      {children}
    </AdLayout>
  );
} 