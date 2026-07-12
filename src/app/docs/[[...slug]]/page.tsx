import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { DocsHomeContent } from '@/components/docs-home-content';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  if (!params.slug || params.slug.length === 0) {
    return <DocsHomeContent />;
  }

  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.2),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{page.data.title}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-white/70">{page.data.description}</p>
      </header>
      <article className="rounded-2xl border border-white/10 bg-[#101014] p-6 sm:p-8 prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/70 prose-strong:text-white prose-code:text-teal-200 prose-pre:bg-black/40 prose-a:text-teal-200 prose-li:text-white/70">
        <MDX components={getMDXComponents()} />
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  if (!params.slug || params.slug.length === 0) {
    return {
      title: 'Docs',
      description: 'Premium section transition documentation for React and Next.js with live demos, source code, and AI prompts.',
    };
  }

  const page = source.getPage(params.slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}
