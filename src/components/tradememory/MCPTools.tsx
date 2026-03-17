'use client';

import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import type { TranslationKey } from '@/lib/translations/en';

interface Tool {
  name: string;
  descKey: TranslationKey;
}

interface ToolGroup {
  labelKey: TranslationKey;
  color: string;
  tools: Tool[];
}

const toolGroups: ToolGroup[] = [
  {
    labelKey: 'tm_tools_group_core',
    color: 'var(--color-cyan)',
    tools: [
      { name: 'store_trade', descKey: 'tm_tool_store_trade' },
      { name: 'recall_trades', descKey: 'tm_tool_recall_trades' },
      { name: 'get_performance', descKey: 'tm_tool_get_performance' },
      { name: 'run_reflection', descKey: 'tm_tool_run_reflection' },
    ],
  },
  {
    labelKey: 'tm_tools_group_owm',
    color: 'var(--color-amber)',
    tools: [
      { name: 'remember_trade', descKey: 'tm_tool_remember_trade' },
      { name: 'recall_memories', descKey: 'tm_tool_recall_memories' },
      { name: 'get_behavioral_analysis', descKey: 'tm_tool_get_behavioral_analysis' },
      { name: 'get_agent_state', descKey: 'tm_tool_get_agent_state' },
      { name: 'create_trading_plan', descKey: 'tm_tool_create_trading_plan' },
      { name: 'check_active_plans', descKey: 'tm_tool_check_active_plans' },
    ],
  },
  {
    labelKey: 'tm_tools_group_evolution',
    color: 'var(--color-neon-green)',
    tools: [
      { name: 'evolve_strategies', descKey: 'tm_tool_evolve_strategies' },
      { name: 'discover_signals', descKey: 'tm_tool_discover_signals' },
      { name: 'generate_hypothesis', descKey: 'tm_tool_generate_hypothesis' },
      { name: 'run_backtest', descKey: 'tm_tool_run_backtest' },
      { name: 'select_survivors', descKey: 'tm_tool_select_survivors' },
    ],
  },
];

export function MCPTools() {
  const { t } = useI18n();

  return (
    <ScrollReveal>
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-3 text-center font-display text-2xl font-bold text-txt sm:text-3xl">
          {t('tm_tools_title')}
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-sm text-txt-dim">
          {t('tm_tools_subtitle')}
        </p>

        <div className="space-y-8">
          {toolGroups.map((group) => (
            <div key={group.labelKey}>
              {/* Group label */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span
                  className="font-mono text-xs font-semibold uppercase tracking-wider"
                  style={{ color: group.color }}
                >
                  {t(group.labelKey)}
                </span>
              </div>

              {/* Tool cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {group.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="group relative overflow-hidden rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-border-bright"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${group.color}, transparent)`,
                      }}
                    />
                    <p className="font-mono text-xs font-semibold text-txt">
                      {tool.name}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-txt-dim">
                      {t(tool.descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
