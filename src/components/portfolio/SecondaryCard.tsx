'use client';

import { useI18n } from '@/lib/i18n';
import type { SecondaryProject } from '@/lib/portfolio-data';

interface SecondaryCardProps {
  project: SecondaryProject;
}

export function SecondaryCard({ project }: SecondaryCardProps) {
  const { t } = useI18n();

  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border rounded-xl p-5 transition-colors hover:border-cyan/30 hover:bg-cyan/[0.02]"
    >
      <div className="font-semibold text-txt">{t(project.nameKey)}</div>
      <div className="text-xs text-txt-dim mt-1 leading-relaxed">{t(project.descKey)}</div>
      <div className="mt-4">
        <div className="font-mono text-lg text-cyan">{t(project.statKey)}</div>
        <div className="text-[9px] uppercase tracking-widest text-txt-dim mt-0.5">
          {t(project.statLblKey)}
        </div>
      </div>
    </a>
  );
}
