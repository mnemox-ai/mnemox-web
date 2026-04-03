'use client';

import useSWR from 'swr';

export interface GitHubStars {
  idea_reality: number;
  tradememory: number;
  combined: number;
}

const fetcher = (url: string): Promise<GitHubStars> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch GitHub stars');
    return res.json();
  });

/**
 * SWR hook for fetching GitHub stars with caching.
 * The data is shared across all components using this hook,
 * preventing duplicate requests.
 */
export function useGitHubStars() {
  const { data, error, isLoading } = useSWR<GitHubStars>(
    '/api/github-stars',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      errorRetryCount: 2,
    }
  );

  return {
    stars: data ?? null,
    isLoading,
    isError: !!error,
  };
}
