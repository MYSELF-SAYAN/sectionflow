import { notFound } from 'next/navigation';
import { TransitionDocsShell } from '@/components/transition-docs-shell';
import {
  getRelatedTransitions,
  getTransitionBySlug,
  getTransitionSourceCode,
  getTransitionSourceHtml,
  getCoreFiles,
  getUsageCode,
  getUsageHtml,
} from '@/lib/transition-docs';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const transition = getTransitionBySlug(params.slug);
  if (!transition) return { title: 'Transition' };
  return {
    title: transition.name,
    description: `${transition.name} documentation with live demo, source code, core files, usage example, and AI prompt.`,
  };
}

export async function generateStaticParams() {
  return (await import('@/library/registry')).transitions.map((t) => ({ slug: t.slug }));
}

export default async function TransitionDocsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const transition = getTransitionBySlug(params.slug);
  if (!transition) notFound();

  const [sourceCode, sourceHtml, coreFiles, usageCode, usageHtml] = await Promise.all([
    getTransitionSourceCode(transition.slug),
    getTransitionSourceHtml(transition.slug),
    getCoreFiles(),
    Promise.resolve(getUsageCode(transition.slug)),
    getUsageHtml(transition.slug),
  ]);

  const relatedTransitions = getRelatedTransitions(transition);

  return (
    <TransitionDocsShell
      transition={transition}
      sourceCode={sourceCode}
      sourceHtml={sourceHtml}
      coreFiles={coreFiles}
      usageCode={usageCode}
      usageHtml={usageHtml}
      relatedTransitions={relatedTransitions}
    />
  );
}
