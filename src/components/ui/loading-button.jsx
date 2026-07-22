'use client';

import { Button } from '@/components/ui/button';

/**
 * LoadingButton — use this for every form submit or mutation action.
 * Accepts all Button props plus:
 *  - isLoading: boolean  — shows spinner and disables the button
 *  - loadingText: string — label shown while loading (optional)
 */
export default function LoadingButton({ isLoading, loadingText, children, ...props }) {
  return (
    <Button isLoading={isLoading} disabled={isLoading} {...props}>
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
