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
    labelKey: 'tm_tools_group_memory',
    color: 'var(--color-cyan)',
    tools: [
      { name: 'remember_trade', descKey: 'tm_tool_remember_trade' },
      { name: 'recall_memories', descKey: 'tm_tool_recall_memories' },
      { name: 'get_behavioral_analysis', descKey: 'tm_tool_get_behavioral_analysis' },
      { name: 'get_agent_state', descKey: 'tm_tool_get_agent_state' },
    ],
  },
  {
    labelKey: 'tm_tools_group_risk',
    color: 'var(--color-amber)',
    tools: [
      { name: 'compute_dqs', descKey: 'tm_tool_compute_dqs' },
      { name: 'check_trade_legitimacy', descKey: 'tm_tool_check_trade_legitimacy' },
      { name: 'validate_strategy', descKey: 'tm_tool_validate_strategy' },
      { name: 'create_trading_plan', descKey: 'tm_tool_create_trading_plan' },
      { name: 'check_active_plans', descKey: 'tm_tool_check_active_plans' },
    ],
  },
  {
    labelKey: 'tm_tools_group_evolution',
    color: 'var(--color-neon-green)',
    tools: [
      { name: 'evolution_fetch_market_data', descKey: 'tm_tool_evo_fetch' },
      { name: 'evolution_discover_patterns', descKey: 'tm_tool_evo_discover' },
      { name: 'evolution_run_backtest', descKey: 'tm_tool_evo_backtest' },
      { name: 'evolution_evolve_strategy', descKey: 'tm_tool_evo_evolve' },
      { name: 'evolution_get_log', descKey: 'tm_tool_evo_log' },
    ],
  },
  {
    labelKey: 'tm_tools_group_audit',
    color: 'var(--color-cyan)',
    tools: [
      { name: 'export_audit_trail', descKey: 'tm_tool_export_audit' },
      { name: 'verify_audit_hash', descKey: 'tm_tool_verify_hash' },
      { name: 'verify_audit_chain', descKey: 'tm_tool_verify_chain' },
      { name: 'get_daily_root', descKey: 'tm_tool_daily_root' },
      { name: 'get_strategy_performance', descKey: 'tm_tool_strategy_perf' },
      { name: 'get_trade_reflection', descKey: 'tm_tool_trade_reflection' },
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
