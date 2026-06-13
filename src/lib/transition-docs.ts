import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { transitions, type TransitionMeta } from '@/library/registry';
import { codeToHtml } from 'shiki';

export const transitionGroups = ['Wave', 'SVG', 'Perspective', 'Scroll', 'Grid', 'Morph', 'Parallax', 'Other'] as const;

export function getTransitionGroup(meta: TransitionMeta) {
  if (meta.group) {
    return meta.group;
  }

  if (meta.slug.includes('wave')) return 'Wave';
  if (meta.slug.includes('portal') || meta.slug.includes('spotlight') || meta.slug.includes('ink') || meta.slug.includes('wipe') || meta.slug.includes('gradient') || meta.slug.includes('mask')) return 'SVG';
  if (meta.slug.includes('flip') || meta.slug.includes('fold') || meta.slug.includes('stack') || meta.slug.includes('cinematic') || meta.slug.includes('depth')) return 'Perspective';
  if (meta.slug.includes('zoom') || meta.slug.includes('elastic') || meta.slug.includes('parallax') || meta.slug.includes('pin') || meta.slug.includes('scroll') || meta.slug.includes('gsap')) return 'Scroll';
  if (meta.slug.includes('dot') || meta.slug.includes('grid')) return 'Grid';
  if (meta.slug.includes('morph') || meta.slug.includes('liquid') || meta.slug.includes('mesh')) return 'Morph';
  if (meta.slug.includes('parallax')) return 'Parallax';
  return 'Other';
}

export function getGroupedTransitions() {
  const grouped = new Map<string, TransitionMeta[]>();
  for (const group of transitionGroups) {
    grouped.set(group, []);
  }

  for (const transition of transitions) {
    const group = getTransitionGroup(transition);
    grouped.get(group)?.push(transition);
  }

  return transitionGroups
    .map((group) => ({
      group,
      transitions: (grouped.get(group) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((item) => item.transitions.length > 0);
}

export const getFeaturedTransitions = cache(() => transitions.filter((item) => item.featured && item.status === 'available'));

export const getTransitionBySlug = cache((slug: string) => transitions.find((item) => item.slug === slug));

export const getTransitionSourceCode = cache(async (slug: string) => {
  const filePath = path.join(process.cwd(), 'src', 'library', 'transitions', `${slug}.tsx`);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return `// Source is not available for ${slug} yet.`;
  }
});

export const getTransitionSourceHtml = cache(async (slug: string) => {
  const source = await getTransitionSourceCode(slug);
  try {
    const html = await codeToHtml(source, {
      lang: 'tsx',
      theme: 'github-dark',
    });
    return html;
  } catch {
    // Fallback: wrap in a plain pre if Shiki fails for any reason
    const escaped = source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre style="color:#e1e4e8">${escaped}</pre>`;
  }
});

export function getTransitionPrompt(meta: TransitionMeta) {
  if (meta.prompt) return meta.prompt;

  return `Create a premium ${meta.name.toLowerCase()} section transition for a React and Next.js landing page. Use smooth Framer Motion motion, polished depth, and a clear handoff between two sections. Keep the transition production-ready, responsive, and visually refined.`;
}

export function getRelatedTransitions(meta: TransitionMeta) {
  const sameGroup = transitions.filter((item) => item.status === 'available' && item.slug !== meta.slug && getTransitionGroup(item) === getTransitionGroup(meta));
  return sameGroup.slice(0, 4);
}

export function getDocsStats() {
  const available = transitions.filter((item) => item.status === 'available').length;
  return [
    { label: 'Transitions', value: `${transitions.length}+` },
    { label: 'Available demos', value: `${available}` },
    { label: 'Engine', value: 'Framer Motion' },
    { label: 'TypeScript', value: 'First-class' },
  ];
}
