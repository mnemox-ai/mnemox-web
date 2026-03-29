import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Mnemox AI',
  description: 'Terms and conditions for using Mnemox AI services.',
  alternates: { canonical: 'https://www.mnemox.ai/terms' },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-24 text-txt-dim leading-relaxed">
      <h1 className="mb-8 font-display text-3xl font-bold text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mb-4 text-xs text-txt-muted">Last updated: March 30, 2026</p>

      <Section title="1. Acceptance">
        <p>
          By accessing or using <strong>www.mnemox.ai</strong> and associated services,
          you agree to these terms. If you do not agree, do not use our services.
        </p>
      </Section>

      <Section title="2. Services">
        <p>Mnemox AI provides:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Open-source tools</strong> — TradeMemory Protocol and Idea Reality Check,
            available under the MIT License.
          </li>
          <li>
            <strong>Custom development services</strong> — AI trading infrastructure built to
            your specifications, governed by individual service agreements.
          </li>
          <li>
            <strong>Hosted API</strong> — Cloud-hosted TradeMemory endpoints (when available),
            subject to usage limits per your plan.
          </li>
        </ul>
      </Section>

      <Section title="3. User Accounts">
        <p>
          You are responsible for maintaining the security of your account credentials and API
          keys. You must not share API keys or use them in a way that violates these terms.
        </p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Use our services for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Abuse rate limits or API quotas</li>
          <li>Reverse engineer our proprietary services (open-source tools are exempt)</li>
        </ul>
      </Section>

      <Section title="5. Custom Services">
        <p>
          Custom development projects (Decision Audit Trail, AI Trading System, AI War Room) are
          governed by individual service agreements. Source code ownership, delivery timelines,
          and support terms are specified in each agreement.
        </p>
      </Section>

      <Section title="6. Financial Disclaimer">
        <p>
          Mnemox AI builds trading infrastructure tools. We do not provide financial advice,
          investment recommendations, or guarantee trading results. All trading involves risk.
          Past performance does not guarantee future results. You are solely responsible for
          your trading decisions.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          Open-source components (TradeMemory Protocol, Idea Reality Check) are released under
          the MIT License. Custom-built code delivered to clients becomes their property as
          specified in the service agreement. The Mnemox brand, logo, and website content remain
          our property.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          Mnemox AI is not liable for any indirect, incidental, or consequential damages arising
          from use of our services, including but not limited to trading losses, data loss, or
          service interruptions.
        </p>
      </Section>

      <Section title="9. Termination">
        <p>
          We may suspend or terminate your access if you violate these terms. You may close your
          account at any time by contacting <A href="mailto:dev@mnemox.ai">dev@mnemox.ai</A>.
        </p>
      </Section>

      <Section title="10. Changes">
        <p>
          We may update these terms from time to time. Continued use of our services after
          changes constitutes acceptance. Material changes will be communicated via the website.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Questions about these terms? Contact us at{' '}
          <A href="mailto:dev@mnemox.ai">dev@mnemox.ai</A>.
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
