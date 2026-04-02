'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ValidateFormProps {
  onSubmit: (formData: FormData) => void;
}

export function ValidateForm({ onSubmit }: ValidateFormProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [format, setFormat] = useState<'quantconnect' | 'daily_returns'>('daily_returns');
  const [strategyName, setStrategyName] = useState('');
  const [numStrategies, setNumStrategies] = useState('1');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.type === 'text/csv')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }, []);

  const handleSubmit = () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('format', format);
    fd.append('strategy_name', strategyName || file.name.replace('.csv', ''));
    fd.append('num_strategies', numStrategies);
    onSubmit(fd);
  };

  return (
    <div className="rounded-xl border border-border bg-bg-card p-8 mb-8">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-all ${
          dragOver
            ? 'border-cyan bg-cyan-glow'
            : file
            ? 'border-neon-green/40 bg-neon-green/5'
            : 'border-border hover:border-cyan-dim hover:bg-cyan-glow'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <>
            <FileText className="h-8 w-8 text-neon-green" />
            <div className="text-center">
              <p className="font-mono text-sm text-txt font-medium">{file.name}</p>
              <p className="font-mono text-[11px] text-txt-dim mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="mt-1 flex items-center gap-1 rounded border border-border px-2 py-1 font-mono text-[11px] text-txt-dim hover:border-danger hover:text-danger transition-colors"
            >
              <X className="h-3 w-3" />
              {t('val_remove_file')}
            </button>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-txt-dim" />
            <p className="font-mono text-sm text-txt-dim">{t('val_drop_csv')}</p>
            <p className="font-mono text-[11px] text-txt-muted">{t('val_drop_hint')}</p>
          </>
        )}
      </div>

      {/* Format selector */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-wider text-txt-dim mb-2 block">
            {t('val_format_label')}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormat('daily_returns')}
              className={`flex-1 rounded-lg border px-3 py-2 font-mono text-xs transition-all ${
                format === 'daily_returns'
                  ? 'border-cyan bg-cyan-glow text-cyan'
                  : 'border-border text-txt-dim hover:border-cyan-dim'
              }`}
            >
              {t('val_format_daily')}
            </button>
            <button
              type="button"
              onClick={() => setFormat('quantconnect')}
              className={`flex-1 rounded-lg border px-3 py-2 font-mono text-xs transition-all ${
                format === 'quantconnect'
                  ? 'border-cyan bg-cyan-glow text-cyan'
                  : 'border-border text-txt-dim hover:border-cyan-dim'
              }`}
            >
              {t('val_format_qc')}
            </button>
          </div>
        </div>

        <div>
          <label className="font-mono text-[11px] uppercase tracking-wider text-txt-dim mb-2 block">
            {t('val_strategy_name')}
          </label>
          <input
            type="text"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            placeholder={t('val_strategy_placeholder')}
            className="w-full rounded-lg border border-border bg-black/30 px-3 py-2 font-mono text-sm text-txt transition-colors focus:border-cyan focus:outline-none placeholder:text-txt-muted"
          />
        </div>
      </div>

      {/* Num strategies tested */}
      <div className="mt-4">
        <label className="font-mono text-[11px] uppercase tracking-wider text-txt-dim mb-2 block">
          {t('val_num_strategies')}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="1000"
            value={numStrategies}
            onChange={(e) => setNumStrategies(e.target.value)}
            className="w-24 rounded-lg border border-border bg-black/30 px-3 py-2 font-mono text-sm text-txt transition-colors focus:border-cyan focus:outline-none"
          />
          <span className="font-mono text-[11px] text-txt-muted">{t('val_num_strategies_hint')}</span>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6 flex items-center justify-between">
        <p className="font-mono text-[11px] text-txt-muted max-w-[300px]">
          {t('val_csv_hint')}
        </p>
        <button
          onClick={handleSubmit}
          disabled={!file}
          className="whitespace-nowrap rounded-lg bg-cyan px-8 py-3 font-display text-[15px] font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('val_btn_validate')}
        </button>
      </div>
    </div>
  );
}
