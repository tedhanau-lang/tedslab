export type ClusterId =
  | "philosophy"
  | "physics"
  | "mathematics"
  | "biology"
  | "computing"
  | "history"
  | "mind"
  | "systems";

export type NodeKind = "atlas" | "hub" | "topic" | "figure" | "concept";

export type ClusterIdOrAtlas = ClusterId | "atlas";

export type AtlasNode = {
  id: string;
  title: string;
  cluster: ClusterIdOrAtlas;
  kind: NodeKind;
  tags: string[];
  summary: string;
  related: string[];
  born?: string;
};

export type AtlasEdge = {
  source: string;
  target: string;
};

export type ClusterMeta = {
  id: ClusterId;
  title: string;
  subtitle: string;
  accent: string;
};

export type ArticleCore = {
  lede: string;
  idea: string;
  lineage: string;
  tension: string;
};

export type Article = {
  id: string;
  title: string;
  cluster: ClusterIdOrAtlas;
  kind: NodeKind;
  tags: string[];
  summary: string;
  body: string;
  related: string[];
  wordCount: number;
};
