export type Severity = "critical" | "important" | "watch";
export type Confidence = "high" | "medium" | "low" | "speculation";
export type Category =
  | "policy"
  | "regulation"
  | "finance"
  | "solar"
  | "storage"
  | "technology"
  | "customer"
  | "competitor"
  | "global"
  | "market";

export type ImpactTag =
  | "revenue"
  | "margin"
  | "capex"
  | "financing"
  | "demand"
  | "regulation"
  | "competition"
  | "technology"
  | "strategy"
  | "risk"
  | "fundraising";

export type SourceKind =
  | "institution"
  | "regulator"
  | "utility"
  | "media"
  | "research"
  | "financier"
  | "company"
  | "journalist"
  | "database"
  | "newsletter";

export type Citation = {
  name: string;
  url: string | null;
};

export type MarketNumber = {
  label: string;
  original: string;
  converted: string | null;
  assumption: string | null;
};

export type Source = {
  id: string;
  name: string;
  kind: SourceKind;
  url: string | null;
  platform: string | null;
  country: string | null;
  focus: string | null;
  tier: 1 | 2 | 3;
  score: number;
  scorePrimary: number;
  scoreAccuracy: number;
  scoreExpertise: number;
  scoreSpeed: number;
  scoreRelevance: number;
  scoreTransparency: number;
  scoreIndependence: number;
  rationale: string;
  lastSignalAt: string | null;
};

export type IntelligenceItem = {
  id: string;
  eventKey: string;
  title: string;
  whatHappened: string;
  evidence: string;
  whatChanged: string;
  whyItMatters: string;
  whoBenefits: string;
  whoLoses: string;
  whatNext: string;
  netsoMeaning: string;
  recommendedAction: string;
  deadline: string | null;
  severity: Severity;
  category: Category;
  impactTags: ImpactTag[];
  confidence: Confidence;
  verificationLevel: 1 | 2 | 3 | 4 | 5;
  conflictAlert: string | null;
  impact: number;
  urgency: number;
  probability: number;
  relevance: number;
  quality: number;
  priorityScore: number;
  citations: Citation[];
  numbers: MarketNumber[];
  eventDate: string | null;
  createdAt: string;
};

export type Brief = {
  id: string;
  kind: "daily" | "weekly" | "monthly";
  briefDate: string;
  strategicInterpretation: string;
  recommendedActions: string[];
  startStop: {
    start?: string[];
    stop?: string[];
    defer?: string[];
    accelerate?: string[];
    weeklyActions?: string[];
    biggest?: string[];
    policy?: string;
    market?: string;
    competitors?: string;
    technology?: string;
    financing?: string;
    customers?: string;
    threats?: string;
    opportunities?: string;
    numbers?: string[];
    implications?: string;
  };
  maps: {
    market?: string;
    regulatory?: string;
    competitor?: string;
    financing?: string;
    technology?: string;
    customer?: string;
    opportunity?: string;
    threat?: string;
    calls?: { initiative: string; call: "scale" | "experiment" | "shrink" | "defer" | "kill"; why: string }[];
  };
};

export type Assumption = {
  id: string;
  category: string;
  label: string;
  value: string;
  unit: string | null;
  previousValue: string | null;
  originalFigure: string | null;
  confidence: Confidence;
  needsReview: boolean;
  reviewReason: string | null;
  sourceNote: string | null;
  sortOrder: number;
  updatedAt: string;
};

export type Signal = {
  id: string;
  kind: "opportunity" | "threat";
  title: string;
  description: string;
  potentialValue: string | null;
  probability: string | null;
  timeSensitivity: string | null;
  executionDifficulty: string | null;
  strategicFit: string | null;
  rank: number;
};

export type CycleRun = {
  id: string;
  kind: string;
  status: string;
  summary: string | null;
  error: string | null;
  itemCount: number;
  createdAt: string;
};

export type DeskState = {
  sourceCount: number;
  tier1Count: number;
  criticalCount: number;
  reviewCount: number;
  lastCycle: CycleRun | null;
  briefDate: string;
};

export type CycleResult =
  | { ok: true; summary: string; itemCount: number }
  | { ok: false; error: string };
