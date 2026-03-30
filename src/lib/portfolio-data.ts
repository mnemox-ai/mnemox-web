import type { TranslationKey } from './translations/en';

export interface CaseStudyMetric {
  val: TranslationKey;
  lbl: TranslationKey;
}

export interface SolutionComponent {
  title: TranslationKey;
  desc: TranslationKey;
}

export interface CaseStudy {
  id: string;
  nameKey: TranslationKey;
  taglineKey: TranslationKey;
  challengeKey: TranslationKey;
  challengeDescKey: TranslationKey;
  overviewKey: TranslationKey;
  tags: TranslationKey[];
  heroMetrics: CaseStudyMetric[];
  infoMetrics: CaseStudyMetric[];
  problemHeadKey: TranslationKey;
  problemDescKey: TranslationKey;
  solutionHeadKey: TranslationKey;
  solutions: SolutionComponent[];
  results: CaseStudyMetric[];
  githubUrl: string;
}

export interface SecondaryProject {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  statKey: TranslationKey;
  statLblKey: TranslationKey;
  githubUrl: string;
  tags: TranslationKey[];
}

export const FEATURED_CASES: CaseStudy[] = [
  {
    id: 'tradememory',
    nameKey: 'p_tm_name',
    taglineKey: 'p_tm_tagline',
    challengeKey: 'p_tm_challenge',
    challengeDescKey: 'p_tm_challenge_desc',
    overviewKey: 'p_tm_overview',
    tags: ['p_tag_mcp', 'p_tag_audit', 'p_tag_opensource'],
    heroMetrics: [
      { val: 'p_tm_m1_val', lbl: 'p_tm_m1_lbl' },
      { val: 'p_tm_m2_val', lbl: 'p_tm_m2_lbl' },
      { val: 'p_tm_m3_val', lbl: 'p_tm_m3_lbl' },
    ],
    infoMetrics: [
      { val: 'p_tm_i1_val', lbl: 'p_tm_i1_lbl' },
      { val: 'p_tm_i2_val', lbl: 'p_tm_i2_lbl' },
      { val: 'p_tm_i3_val', lbl: 'p_tm_i3_lbl' },
      { val: 'p_tm_i4_val', lbl: 'p_tm_i4_lbl' },
    ],
    problemHeadKey: 'p_tm_problem_h',
    problemDescKey: 'p_tm_problem_desc',
    solutionHeadKey: 'p_tm_solution_h',
    solutions: [
      { title: 'p_tm_s1_title', desc: 'p_tm_s1_desc' },
      { title: 'p_tm_s2_title', desc: 'p_tm_s2_desc' },
      { title: 'p_tm_s3_title', desc: 'p_tm_s3_desc' },
      { title: 'p_tm_s4_title', desc: 'p_tm_s4_desc' },
    ],
    results: [
      { val: 'p_tm_r1_val', lbl: 'p_tm_r1_lbl' },
      { val: 'p_tm_r2_val', lbl: 'p_tm_r2_lbl' },
      { val: 'p_tm_r3_val', lbl: 'p_tm_r3_lbl' },
    ],
    githubUrl: 'https://github.com/mnemox-ai/tradememory-protocol',
  },
  {
    id: 'nexusos',
    nameKey: 'p_nx_name',
    taglineKey: 'p_nx_tagline',
    challengeKey: 'p_nx_challenge',
    challengeDescKey: 'p_nx_challenge_desc',
    overviewKey: 'p_nx_overview',
    tags: ['p_tag_agentsdk', 'p_tag_dashboard', 'p_tag_realtime'],
    heroMetrics: [
      { val: 'p_nx_m1_val', lbl: 'p_nx_m1_lbl' },
      { val: 'p_nx_m2_val', lbl: 'p_nx_m2_lbl' },
    ],
    infoMetrics: [
      { val: 'p_nx_i1_val', lbl: 'p_nx_i1_lbl' },
      { val: 'p_nx_i2_val', lbl: 'p_nx_i2_lbl' },
      { val: 'p_nx_i3_val', lbl: 'p_nx_i3_lbl' },
      { val: 'p_nx_i4_val', lbl: 'p_nx_i4_lbl' },
    ],
    problemHeadKey: 'p_nx_problem_h',
    problemDescKey: 'p_nx_problem_desc',
    solutionHeadKey: 'p_nx_solution_h',
    solutions: [
      { title: 'p_nx_s1_title', desc: 'p_nx_s1_desc' },
      { title: 'p_nx_s2_title', desc: 'p_nx_s2_desc' },
      { title: 'p_nx_s3_title', desc: 'p_nx_s3_desc' },
      { title: 'p_nx_s4_title', desc: 'p_nx_s4_desc' },
    ],
    results: [
      { val: 'p_nx_r1_val', lbl: 'p_nx_r1_lbl' },
      { val: 'p_nx_r2_val', lbl: 'p_nx_r2_lbl' },
      { val: 'p_nx_r3_val', lbl: 'p_nx_r3_lbl' },
    ],
    githubUrl: 'https://github.com/mnemox-ai/nexusos',
  },
  {
    id: 'ng-gold',
    nameKey: 'p_ng_name',
    taglineKey: 'p_ng_tagline',
    challengeKey: 'p_ng_challenge',
    challengeDescKey: 'p_ng_challenge_desc',
    overviewKey: 'p_ng_overview',
    tags: ['p_tag_mt5', 'p_tag_risk', 'p_tag_xauusd'],
    heroMetrics: [
      { val: 'p_ng_m1_val', lbl: 'p_ng_m1_lbl' },
      { val: 'p_ng_m2_val', lbl: 'p_ng_m2_lbl' },
    ],
    infoMetrics: [
      { val: 'p_ng_i1_val', lbl: 'p_ng_i1_lbl' },
      { val: 'p_ng_i2_val', lbl: 'p_ng_i2_lbl' },
      { val: 'p_ng_i3_val', lbl: 'p_ng_i3_lbl' },
      { val: 'p_ng_i4_val', lbl: 'p_ng_i4_lbl' },
    ],
    problemHeadKey: 'p_ng_problem_h',
    problemDescKey: 'p_ng_problem_desc',
    solutionHeadKey: 'p_ng_solution_h',
    solutions: [
      { title: 'p_ng_s1_title', desc: 'p_ng_s1_desc' },
      { title: 'p_ng_s2_title', desc: 'p_ng_s2_desc' },
      { title: 'p_ng_s3_title', desc: 'p_ng_s3_desc' },
      { title: 'p_ng_s4_title', desc: 'p_ng_s4_desc' },
    ],
    results: [
      { val: 'p_ng_r1_val', lbl: 'p_ng_r1_lbl' },
      { val: 'p_ng_r2_val', lbl: 'p_ng_r2_lbl' },
      { val: 'p_ng_r3_val', lbl: 'p_ng_r3_lbl' },
    ],
    githubUrl: 'https://github.com/mnemox-ai/NG_Gold',
  },
];

export const SECONDARY_PROJECTS: SecondaryProject[] = [
  {
    id: 'idea-reality',
    nameKey: 'card_ir_name',
    descKey: 'p_sec_ir_desc',
    statKey: 'p_sec_ir_stat',
    statLblKey: 'p_sec_ir_stat_lbl',
    githubUrl: 'https://github.com/mnemox-ai/idea-reality-mcp',
    tags: ['p_tag_mcp', 'p_tag_opensource'],
  },
  {
    id: 'deflated-sharpe',
    nameKey: 'p_label_oss',
    descKey: 'p_sec_ds_desc',
    statKey: 'p_sec_ds_stat',
    statLblKey: 'p_sec_ds_stat_lbl',
    githubUrl: 'https://github.com/mnemox-ai/deflated-sharpe',
    tags: ['p_tag_opensource'],
  },
  {
    id: 'anti-resonance',
    nameKey: 'p_label_oss',
    descKey: 'p_sec_ar_desc',
    statKey: 'p_sec_ar_stat',
    statLblKey: 'p_sec_ar_stat_lbl',
    githubUrl: 'https://github.com/mnemox-ai/tradememory-protocol',
    tags: ['p_tag_opensource'],
  },
];
