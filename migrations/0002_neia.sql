create table if not exists sources (
  id text primary key,
  name text not null,
  kind text not null,
  url text,
  platform text,
  country text,
  focus text,
  tier integer not null,
  score integer not null,
  score_primary integer not null default 0,
  score_accuracy integer not null default 0,
  score_expertise integer not null default 0,
  score_speed integer not null default 0,
  score_relevance integer not null default 0,
  score_transparency integer not null default 0,
  score_independence integer not null default 0,
  rationale text not null default '',
  last_signal_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists intelligence_items (
  id text primary key,
  event_key text not null,
  title text not null,
  what_happened text not null,
  evidence text not null,
  what_changed text not null default '',
  why_it_matters text not null,
  who_benefits text not null default '',
  who_loses text not null default '',
  what_next text not null default '',
  netso_meaning text not null,
  recommended_action text not null,
  deadline text,
  severity text not null,
  category text not null,
  impact_tags text not null default '[]',
  confidence text not null,
  verification_level integer not null,
  conflict_alert text,
  impact integer not null default 0,
  urgency integer not null default 0,
  probability integer not null default 0,
  relevance integer not null default 0,
  quality integer not null default 0,
  priority_score integer not null default 0,
  citations_json text not null default '[]',
  numbers_json text not null default '[]',
  event_date date,
  created_at timestamptz not null default now()
);

create unique index if not exists intelligence_items_event_key_idx
  on intelligence_items (event_key);

create table if not exists briefs (
  id text primary key,
  kind text not null,
  brief_date date not null,
  strategic_interpretation text not null default '',
  recommended_actions_json text not null default '[]',
  start_stop_json text not null default '{}',
  maps_json text not null default '{}',
  created_at timestamptz not null default now()
);

create unique index if not exists briefs_kind_date_idx
  on briefs (kind, brief_date);

create table if not exists assumptions (
  id text primary key,
  category text not null,
  label text not null,
  value text not null,
  unit text,
  previous_value text,
  original_figure text,
  confidence text not null,
  needs_review boolean not null default false,
  review_reason text,
  source_note text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists signals (
  id text primary key,
  kind text not null,
  title text not null,
  description text not null,
  potential_value text,
  probability text,
  time_sensitivity text,
  execution_difficulty text,
  strategic_fit text,
  rank integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists cycle_runs (
  id text primary key,
  kind text not null,
  status text not null,
  summary text,
  error text,
  item_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists cycle_runs_created_at_idx on cycle_runs (created_at desc);
