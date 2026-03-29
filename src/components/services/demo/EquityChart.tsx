'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { EQUITY_DATA } from './mock-data';

export function EquityChart() {
  return (
    <div className="mt-4 rounded-lg border border-border bg-bg/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-txt-dim">Equity Curve (90d)</span>
        <span className="font-mono text-xs text-emerald-400">
          +47.8%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={EQUITY_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-cyan)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
            axisLine={false}
            interval={14}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            domain={['dataMin - 2000', 'dataMax + 2000']}
            width={45}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10,10,20,0.95)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Equity']}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="var(--color-cyan)"
            strokeWidth={2}
            fill="url(#equityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
