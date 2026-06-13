import { notFound } from 'next/navigation';
import { TemplateDemo } from '@/components/template-demo';
import { ComingSoonCard } from '@/components/coming-soon-card';
import { getTransitionBySlug } from '@/lib/transition-docs';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const transition = getTransitionBySlug(params.slug);
  if (!transition) return { title: 'Demo' };

  return {
    title: `${transition.name} Demo`,
    description: `Full-screen ${transition.name} transition demo for SectionFlow.`,
  };
}

export async function generateStaticParams() {
  return (await import('@/library/registry')).transitions.map((transition) => ({ slug: transition.slug }));
}

export default async function DemoPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const transition = getTransitionBySlug(params.slug);
  if (!transition) notFound();

  if (transition.status !== 'available') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070c] px-6 text-white">
        <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <ComingSoonCard title={transition.name} description="This transition is in the roadmap and will soon ship with a live full-page experience." />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e11] text-[#fbfaf7]">
      <TemplateDemo slug={transition.slug} name={transition.name} />
    </main>
  );
}
