import type { ReactNode } from 'react';

/**
 * Demo layout — intentionally minimal.
 * No footer, no nav, no chrome. The demo pages are loaded inside iframes
 * in the docs shell and must render only the transition itself.
 */
export default function DemoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
