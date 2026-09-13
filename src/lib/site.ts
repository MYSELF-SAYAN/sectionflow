/**
 * Returns the canonical base site URL for SectionFlow.
 * Checks environment variables in priority order, falling back to production domain.
 */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://sectionflow.vercel.app/');

  return url.replace(/\/+$/, '');
}
