'use client';

import { SectionFlow, Section } from '@/library/core/section-flow';
import { transitionRegistry } from '@/library/core/registry';
import { DemoSection } from '@/library/demo/demo-section';

/**
 * v2 transition demo.
 *
 * Renders the selected transition as the outgoing edge of a SectionFlow, with
 * two DemoSections on either side so the handoff is visible in context. The
 * transition is resolved by slug from the v2 registry; sections are mounted
 * once as persistent layers — no `first`/`second`, no content cloning.
 */
export function TemplateDemo({ slug, name }: { slug: string; name: string }) {
  const transition = transitionRegistry[slug];

  if (!transition) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/60">
        Demo coming soon.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0e0e11]">
      <DemoSection
        variant="light"
        eyebrow="SectionFlow demo"
        title="Keep scrolling"
        body={`The “${name}” transition below is driven entirely by your scroll position. Scroll slowly to study it, fast to feel it.`}
      />
      <SectionFlow heightPerSection={200} restHeight={100}>
        {/* The outgoing edge carries the transition; the next section is its
            incoming layer. Both are mounted once inside the pinned span. */}
        <Section transition={transition}>
          <DemoSection
            variant="dark"
            eyebrow="Section A · outgoing"
            title="Everything begins here."
            body="This is the section your visitors are leaving. Watch how it hands the stage over."
          />
        </Section>
        <Section>
          <DemoSection
            variant="accent"
            eyebrow="Section B · incoming"
            title="And lands right here."
            body="A clean, 60 FPS arrival. The reading window before the handoff keeps this fully legible until the moment it animates."
          />
        </Section>
      </SectionFlow>
      <DemoSection
        variant="teal"
        eyebrow="End of demo"
        title="That's the transition."
        body="Resolve it by slug through transitionRegistry, or pass the component directly via <Section transition={...}>."
      />
    </div>
  );
}
