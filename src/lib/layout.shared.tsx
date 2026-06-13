import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'SectionFlow',
    },
    links: [
      { text: 'Templates', url: '/templates' },
      { text: 'Docs', url: '/docs' },
    ],
  };
}
