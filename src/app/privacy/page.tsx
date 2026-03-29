import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Mnemox AI',
  description: 'How Mnemox AI collects, uses, and protects your data.',
  alternates: { canonical: 'https://www.mnemox.ai/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-24 text-txt-dim leading-relaxed">
      <h1 className="mb-8 font-display text-3xl font-bold text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mb-4 text-xs text-txt-muted">Last updated: March 30, 2026</p>

      <Section title="1. Who We Are">
        <p>
          Mnemox AI is a Taipei-based studio that builds AI trading infrastructure.
          This policy covers <strong>www.mnemox.ai</strong> and all associated services.
        </p>
      </Section>

      <Section title="2. What We Collect">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account data</strong> — When you sign in via Clerk (Google OAuth), we store
            your name, email, and profile image to manage your account.
          </li>
          <li>
            <strong>Service inquiries</strong> — When you submit a booking form on the Services
            page, we store your name, email, platform preference, service tier, and description.
            Your IP address is hashed for rate limiting only.
          </li>
          <li>
            <strong>Idea checks</strong> — Idea Reality Check queries are logged anonymously
            (no account linkage). We store the idea text, score, and country for aggregate analytics.
          </li>
          <li>
            <strong>Usage data</strong> — Standard web analytics (Vercel Analytics, Google
            Analytics) collect page views, referrers, and device type. No personal data is
            shared with third parties.
          </li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To respond to service inquiries</li>
          <li>To generate aggregate analytics (Idea Pulse trends)</li>
          <li>To improve our products and user experience</li>
        </ul>
      </Section>

      <Section title="4. Data Sharing">
        <p>
          We do not sell your data. We share data only with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Clerk</strong> — Authentication provider</li>
          <li><strong>Supabase</strong> — Database hosting (US infrastructure)</li>
          <li><strong>Vercel</strong> — Website hosting and analytics</li>
          <li><strong>Google Analytics</strong> — Anonymized web analytics</li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        <p>
          Account data is retained while your account is active. Service inquiries are retained
          for 12 months. Idea check logs are retained indefinitely in anonymized form.
          You can request deletion by emailing <A href="mailto:dev@mnemox.ai">dev@mnemox.ai</A>.
        </p>
      </Section>

      <Section title="6. Cookies">
        <p>
          We use essential cookies for authentication (Clerk session) and analytics
          (Google Analytics, Vercel). We do not use advertising or tracking cookies.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>
          You can request access to, correction of, or deletion of your personal data
          at any time by contacting <A href="mailto:dev@mnemox.ai">dev@mnemox.ai</A>.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For privacy concerns, contact us at <A href="mailto:dev@mnemox.ai">dev@mnemox.ai</A>.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-display text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-cyan no-underline hover:underline">
      {children}
    </a>
  );
}
