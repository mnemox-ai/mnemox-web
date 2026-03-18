import type { Metadata } from 'next';
import { ApiKeyManager } from './_components/ApiKeyManager';
import { UsageStats } from './_components/UsageStats';
import { SubscriptionCard } from './_components/SubscriptionCard';

export const metadata: Metadata = {
  title: 'Dashboard — Mnemox AI',
  description: 'Manage your API keys, view usage stats, and subscription.',
};

export default function DashboardPage() {
  return (
    <section className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

        <SubscriptionCard />
        <UsageStats />
        <ApiKeyManager />
      </div>
    </section>
  );
}
