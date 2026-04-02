'use client';

import { useState } from 'react';
import { Download, RotateCcw, Copy, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { VerdictBadge } from './VerdictBadge';
import { StatsGrid } from './StatsGrid';
import { TestCard } from './TestCard';
import type { ValidationResult } from './page';

interface ValidateResultsProps {
  result: ValidationResult;
  onReset: () => void;
}

export function ValidateResults({ result, onReset }: ValidateResultsProps) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const lines = [
      `Strategy: ${result.strategy_name}`,
      `Verdict: ${result.verdict} (${result.overall_score}/100)`,
      '',
      '--- Summary ---',
      `Sharpe: ${result.summary.sharpe_ratio.toFixed(2)}`,
      `Win Rate: ${(result.summary.win_rate * 100).toFixed(1)}%`,
      `Max DD: ${(result.summary.max_drawdown * 100).toFixed(1)}%`,
      `Profit Factor: ${result.summary.profit_factor.toFixed(2)}`,
      `Trades: ${result.summary.total_trades}`,
      `Total PnL: ${result.summary.total_pnl.toFixed(2)}`,
      '',
      '--- Tests ---',
      ...result.tests.map(
        (test) => `${test.passed ? 'PASS' : 'FAIL'} ${test.name}: ${test.score}/100 — ${test.details}`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadReport = () => {
    // Generate a simple HTML report for download
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>Strategy Validation Report — ${result.strategy_name}</title>
<style>
  body { font-family: 'JetBrains Mono', monospace; background: #04060b; color: #e0e0e8; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { color: #00e5ff; }
  .verdict { font-size: 48px; font-weight: 900; margin: 20px 0; }
  .pass { color: #00ff88; }
  .caution { color: #ffaa00; }
  .fail { color: #ff3366; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { padding: 8px 12px; border: 1px solid #1a1a28; text-align: left; font-size: 13px; }
  th { background: #0b1120; color: #6a6a80; text-transform: uppercase; font-size: 11px; }
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
  .stat-card { background: #0b1120; border: 1px solid #1a1a28; border-radius: 8px; padding: 16px; text-align: center; }
  .stat-val { font-size: 20px; font-weight: 700; }
  .stat-lbl { font-size: 10px; text-transform: uppercase; color: #6a6a80; margin-top: 4px; }
  .test { background: #0b1120; border: 1px solid #1a1a28; border-radius: 8px; padding: 16px; margin: 8px 0; }
  .test-pass { border-left: 3px solid #00ff88; }
  .test-fail { border-left: 3px solid #ff3366; }
  .disclaimer { font-size: 11px; color: #3a3a50; margin-top: 40px; border-top: 1px solid #1a1a28; padding-top: 20px; }
  .green { color: #00ff88; }
  .red { color: #ff3366; }
</style>
</head>
<body>
<h1>Strategy Validation Report</h1>
<p style="color:#6a6a80">Generated ${new Date().toISOString().split('T')[0]} by mnemox.ai</p>

<div class="verdict ${result.verdict.toLowerCase()}">${result.verdict} — ${result.overall_score}/100</div>
<p><strong>Strategy:</strong> ${result.strategy_name}</p>

<h2>Summary Statistics</h2>
<div class="stat-grid">
  <div class="stat-card"><div class="stat-val">${result.summary.sharpe_ratio.toFixed(2)}</div><div class="stat-lbl">Sharpe</div></div>
  <div class="stat-card"><div class="stat-val">${(result.summary.win_rate * 100).toFixed(1)}%</div><div class="stat-lbl">Win Rate</div></div>
  <div class="stat-card"><div class="stat-val red">${(result.summary.max_drawdown * 100).toFixed(1)}%</div><div class="stat-lbl">Max DD</div></div>
  <div class="stat-card"><div class="stat-val">${result.summary.profit_factor.toFixed(2)}</div><div class="stat-lbl">Profit Factor</div></div>
  <div class="stat-card"><div class="stat-val">${result.summary.total_trades}</div><div class="stat-lbl">Trades</div></div>
  <div class="stat-card"><div class="stat-val ${result.summary.avg_trade_pnl >= 0 ? 'green' : 'red'}">${result.summary.avg_trade_pnl >= 0 ? '+' : ''}${result.summary.avg_trade_pnl.toFixed(2)}</div><div class="stat-lbl">Avg PnL</div></div>
  <div class="stat-card"><div class="stat-val ${result.summary.total_pnl >= 0 ? 'green' : 'red'}">${result.summary.total_pnl >= 0 ? '+' : ''}${result.summary.total_pnl.toFixed(2)}</div><div class="stat-lbl">Total PnL</div></div>
  <div class="stat-card"><div class="stat-val">${result.summary.avg_hold_time}</div><div class="stat-lbl">Avg Hold</div></div>
</div>

<h2>Validation Tests</h2>
${result.tests.map(test => `
<div class="test ${test.passed ? 'test-pass' : 'test-fail'}">
  <strong>${test.passed ? 'PASS' : 'FAIL'}</strong> — ${test.name} (${test.score}/100)
  <p style="color:#6a6a80;margin:4px 0 0">${test.details}</p>
  ${test.sub_results ? `<table>${test.sub_results.map(s => `<tr><td>${s.label}</td><td class="${s.passed ? 'green' : 'red'}">${s.value}</td></tr>`).join('')}</table>` : ''}
</div>`).join('')}

<div class="disclaimer">
  <p>This report is generated by Mnemox Strategy Validator. It is not financial advice. Past performance does not guarantee future results. Statistical tests have inherent limitations — use as one input among many in your decision-making process.</p>
  <p>Powered by <a href="https://github.com/mnemox-ai/tradememory-protocol" style="color:#00e5ff">tradememory-protocol</a></p>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${result.strategy_name.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Verdict */}
      <ScrollReveal>
        <div className="text-center">
          <VerdictBadge verdict={result.verdict} score={result.overall_score} />
          <p className="mt-4 font-mono text-sm text-txt-dim">
            {lang === 'zh' ? '策略：' : 'Strategy: '}
            <span className="text-txt font-bold">{result.strategy_name}</span>
          </p>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <ScrollReveal>
        <div>
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-cyan">
            {t('val_section_summary')}
          </h3>
          <StatsGrid summary={result.summary} />
        </div>
      </ScrollReveal>

      {/* Test Results */}
      <ScrollReveal>
        <div>
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-cyan">
            {t('val_section_tests')}
          </h3>
          <div className="space-y-3">
            {result.tests.map((test) => (
              <TestCard key={test.name} test={test} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 rounded-lg bg-cyan px-6 py-2.5 font-mono text-sm font-bold text-black transition-colors hover:bg-white"
        >
          <Download className="h-4 w-4" />
          {t('val_download_report')}
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-cyan-dim bg-cyan-glow px-6 py-2.5 font-mono text-sm text-cyan transition-colors hover:bg-cyan hover:text-black"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t('val_copied') : t('val_copy_results')}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 font-mono text-sm text-txt-dim transition-colors hover:border-cyan hover:text-cyan"
        >
          <RotateCcw className="h-4 w-4" />
          {t('val_validate_another')}
        </button>
      </div>
    </div>
  );
}
