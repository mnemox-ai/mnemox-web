'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserFrame } from './demo/BrowserFrame';
import { StatCards } from './demo/StatCards';
import { EquityChart } from './demo/EquityChart';
import { DecisionLog } from './demo/DecisionLog';
import { AuditView } from './demo/AuditView';
import { MemoryView } from './demo/MemoryView';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'audit', label: 'Audit Trail' },
  { id: 'memory', label: 'Memory' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function DemoPreview() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <BrowserFrame title="AI Trading Dashboard — Mnemox">
      {/* Tab bar */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-bg/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
              activeTab === tab.id
                ? 'text-txt'
                : 'text-txt-dim hover:text-txt/70'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="demo-tab-bg"
                className="absolute inset-0 rounded-md bg-cyan/10 border border-cyan/20"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && (
            <>
              <StatCards />
              <EquityChart />
              <DecisionLog />
            </>
          )}
          {activeTab === 'audit' && <AuditView />}
          {activeTab === 'memory' && <MemoryView />}
        </motion.div>
      </AnimatePresence>
    </BrowserFrame>
  );
}
