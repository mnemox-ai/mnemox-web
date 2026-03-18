'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { generateApiKey, getApiKeys, revokeApiKey } from '../actions';

interface ApiKey {
  key_hash: string;
  key_prefix: string;
  created_at: string;
}

export function ApiKeyManager() {
  const { t } = useI18n();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadKeys = useCallback(async () => {
    const result = await getApiKeys();
    if (!result.error) setKeys(result.keys);
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setNewKey(null);
    const result = await generateApiKey();
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.key) {
      setNewKey(result.key);
      loadKeys();
    }
  }

  async function handleRevoke(keyHash: string) {
    const result = await revokeApiKey(keyHash);
    if (result.error) {
      setError(result.error);
    } else {
      setKeys((prev) => prev.filter((k) => k.key_hash !== keyHash));
    }
  }

  async function handleCopy() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          {t('dash_api_keys')}
        </h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="font-mono text-xs px-4 py-2 bg-[#00b4ff] text-[#0a0a0f] rounded font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '...' : t('dash_generate_key')}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 mb-3">{error}</p>
      )}

      {newKey && (
        <div className="mb-4 p-4 rounded-lg bg-[rgba(0,180,255,0.08)] border border-[rgba(0,180,255,0.2)]">
          <p className="text-xs text-[#00b4ff] mb-2 font-semibold">
            {t('dash_key_warning')}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-white bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded font-mono break-all">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="font-mono text-xs px-3 py-2 border border-[rgba(255,255,255,0.15)] text-white rounded transition-colors hover:border-[#00b4ff]"
            >
              {copied ? t('dash_copied') : t('dash_copy')}
            </button>
          </div>
        </div>
      )}

      {keys.length === 0 ? (
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          {t('dash_no_keys')}
        </p>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div
              key={k.key_hash}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
            >
              <div>
                <code className="text-sm text-white font-mono">
                  {k.key_prefix}...
                </code>
                <span className="ml-3 text-xs text-[rgba(255,255,255,0.4)]">
                  {new Date(k.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => handleRevoke(k.key_hash)}
                className="font-mono text-xs px-3 py-1 text-red-400 border border-red-400/30 rounded transition-colors hover:bg-red-400/10"
              >
                {t('dash_revoke')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
