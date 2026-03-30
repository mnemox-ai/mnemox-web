import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyDetail } from '@/components/portfolio/CaseStudyDetail';
import { FEATURED_CASES } from '@/lib/portfolio-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FEATURED_CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = FEATURED_CASES.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: cs.metaTitle,
    description: cs.metaDescription,
    openGraph: {
      title: cs.metaTitle,
      description: cs.metaDescription,
      url: `https://www.mnemox.ai/portfolio/${slug}`,
      images: [{ url: '/assets/og-home.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: cs.metaTitle, images: ['/assets/og-home.png'] },
    alternates: { canonical: `https://www.mnemox.ai/portfolio/${slug}` },
    other: {
      'application-ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: cs.metaTitle,
        description: cs.metaDescription,
        author: { '@type': 'Organization', name: 'Mnemox AI', url: 'https://www.mnemox.ai' },
        dateCreated: '2026-03-16',
        url: `https://www.mnemox.ai/portfolio/${slug}`,
      }),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = FEATURED_CASES.find((c) => c.slug === slug);
  if (!cs) notFound();
  return <CaseStudyDetail caseStudy={cs} />;
}
