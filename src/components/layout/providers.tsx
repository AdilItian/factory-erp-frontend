'use client';
import React from 'react';
import { ActiveThemeProvider } from '../themes/active-theme';
import QueryProvider from './query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <QueryProvider>
        <TooltipProvider delay={400}>{children}</TooltipProvider>
      </QueryProvider>
    </ActiveThemeProvider>
  );
}
