import type { ReactNode } from 'react';
import { DocsShell } from '@/components/docs-shell';

export const metadata = {
  title: {
    default: 'SectionFlow Docs',
    template: '%s | SectionFlow Docs',
  },
  description: 'Premium section transition documentation for React and Next.js with live demos, source code, and AI prompts.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
