/**
 * CSV parsing utilities for strategy validation.
 */

/**
 * Parse a standard daily returns CSV.
 * Expects: date,return (or just return per line)
 */
export function parseDailyReturnsCSV(lines: string[]): number[] {
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('date') || header.includes('return') || header.includes('pnl');
  const start = hasHeader ? 1 : 0;

  const returns: number[] = [];
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    // Try last column as the return value
    const val = parseFloat(cols[cols.length - 1]);
    if (!isNaN(val)) returns.push(val);
  }
  return returns;
}

/**
 * Parse a QuantConnect trade log CSV.
 * Expects: Symbol,EntryTime,ExitTime,EntryPrice,ExitPrice,Quantity,PnL,...
 */
export function parseQuantConnectCSV(lines: string[]): number[] {
  const header = lines[0].toLowerCase();
  const cols = header.split(',').map((c) => c.trim());
  const pnlIdx = cols.findIndex((c) => c === 'pnl' || c === 'profit' || c === 'net profit');
  const idx = pnlIdx >= 0 ? pnlIdx : cols.length - 1;

  const returns: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((c) => c.trim());
    const val = parseFloat(parts[idx]);
    if (!isNaN(val)) returns.push(val);
  }
  return returns;
}
