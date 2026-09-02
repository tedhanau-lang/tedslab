import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { CLUSTERS, EDGES, NODES } from "@/data/atlas/catalog";
import type { AtlasNode } from "@/data/atlas/types";

export type SimNode = AtlasNode & {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  degree: number;
};

export type SimLink = {
  source: SimNode;
  target: SimNode;
};

const CLUSTER_ANGLE: Record<string, number> = Object.fromEntries(
  CLUSTERS.map((c, i) => [c.id, (Math.PI * 2 * i) / CLUSTERS.length - Math.PI / 2]),
);

/** Distance of each cluster hub from the atlas center. */
const HUB_R = 1280;
const KIND_RING: Record<string, number> = {
  hub: 0,
  topic: 520,
  figure: 820,
  concept: 1140,
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function jitter(id: string, span: number): number {
  return ((hash(id) % 1000) / 1000 - 0.5) * span;
}

function radiusFor(n: AtlasNode, degree: number): number {
  const base =
    n.kind === "atlas" ? 16 : n.kind === "hub" ? 10.5 : n.kind === "topic" ? 7.2 : n.kind === "figure" ? 5.6 : 5.0;
  return base + Math.min(2.2, degree * 0.07);
}

function polar(r: number, a: number): { x: number; y: number } {
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}

function clusterHubXY(cluster: string): { x: number; y: number } {
  const a = CLUSTER_ANGLE[cluster] ?? 0;
  return polar(HUB_R, a);
}

/**
 * Place each cluster as a solar system so neighboring dots stay far
 * enough apart that titles can be read without overlapping.
 */
function seedXY(n: AtlasNode, indexInKind: number, kindCount: number): { x: number; y: number } {
  if (n.cluster === "atlas" || n.kind === "atlas") return { x: 0, y: 0 };
  const hub = clusterHubXY(n.cluster);
  if (n.kind === "hub") return hub;
  const a0 = CLUSTER_ANGLE[n.cluster] ?? 0;
  const ring = KIND_RING[n.kind] ?? 900;
  const step = (Math.PI * 2) / Math.max(1, kindCount);
  const kindShift = n.kind === "topic" ? 0.12 : n.kind === "figure" ? 0.38 : 0.64;
  const ang = a0 + step * (indexInKind + kindShift) + jitter(n.id, 0.14);
  const r = ring + jitter(n.id + "r", 70);
  return { x: hub.x + Math.cos(ang) * r, y: hub.y + Math.sin(ang) * r };
}

function forceClusterRings(nodes: SimNode[]) {
  const strength = 0.09;
  return (alpha: number) => {
    for (const n of nodes) {
      if (n.kind === "atlas") {
        n.vx -= n.x * 0.08 * alpha;
        n.vy -= n.y * 0.08 * alpha;
        continue;
      }
      const hub = clusterHubXY(n.cluster);
      const targetR = KIND_RING[n.kind] ?? 900;
      const dx = n.x - hub.x;
      const dy = n.y - hub.y;
      const dist = Math.hypot(dx, dy) || 1;
      const k = (targetR - dist) * strength * alpha;
      n.vx += (dx / dist) * k;
      n.vy += (dy / dist) * k;
    }
  };
}

export function buildSimulation(): { nodes: SimNode[]; links: SimLink[] } {
  const degree = new Map<string, number>();
  for (const e of EDGES) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }

  const kindIndex = new Map<string, { i: number; n: number }>();
  for (const cluster of ["atlas", ...CLUSTERS.map((c) => c.id)]) {
    for (const kind of ["hub", "topic", "figure", "concept"] as const) {
      const group = NODES.filter((n) => n.cluster === cluster && n.kind === kind);
      group.forEach((n, i) => kindIndex.set(n.id, { i, n: group.length }));
    }
  }

  const nodes: SimNode[] = NODES.map((n) => {
    const d = degree.get(n.id) ?? 1;
    const ki = kindIndex.get(n.id) ?? { i: 0, n: 1 };
    const c = seedXY(n, ki.i, ki.n);
    return {
      ...n,
      degree: d,
      r: radiusFor(n, d),
      x: c.x,
      y: c.y,
      vx: 0,
      vy: 0,
    };
  });

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const links = EDGES.map((e) => ({
    source: byId.get(e.source)!,
    target: byId.get(e.target)!,
  })).filter((l) => l.source && l.target);

  const sim = forceSimulation(nodes)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance((l) => {
          if (l.source.kind === "atlas" || l.target.kind === "atlas") return 560;
          if (l.source.kind === "hub" || l.target.kind === "hub") {
            return l.source.cluster === l.target.cluster ? 380 : 920;
          }
          if (l.source.cluster === l.target.cluster) return 196;
          return 560;
        })
        .strength((l) => {
          if (l.source.kind === "atlas" || l.target.kind === "atlas") return 0.16;
          return l.source.cluster === l.target.cluster ? 0.22 : 0.035;
        }),
    )
    .force(
      "charge",
      forceManyBody<SimNode>()
        .strength((d) =>
          d.kind === "atlas" ? -1600 : d.kind === "hub" ? -820 : d.kind === "topic" ? -280 : -180,
        )
        .distanceMax(1600),
    )
    .force(
      "collide",
      forceCollide<SimNode>()
        .radius((d) => {
          if (d.kind === "atlas") return d.r + 64;
          if (d.kind === "hub") return d.r + 58;
          if (d.kind === "topic") return d.r + 46;
          return d.r + 38;
        })
        .iterations(5)
        .strength(0.95),
    )
    .force("center", forceCenter(0, 0).strength(0.015))
    .force(
      "x",
      forceX<SimNode>((d) => (d.kind === "atlas" ? 0 : clusterHubXY(d.cluster).x)).strength((d) =>
        d.kind === "atlas" ? 0.16 : d.kind === "hub" ? 0.12 : 0.028,
      ),
    )
    .force(
      "y",
      forceY<SimNode>((d) => (d.kind === "atlas" ? 0 : clusterHubXY(d.cluster).y)).strength((d) =>
        d.kind === "atlas" ? 0.16 : d.kind === "hub" ? 0.12 : 0.028,
      ),
    )
    .force("rings", forceClusterRings(nodes))
    .stop();

  for (let i = 0; i < 480; i++) sim.tick();

  return { nodes, links };
}

let cached: { nodes: SimNode[]; links: SimLink[] } | null = null;

export function getLaidOutGraph() {
  if (!cached) cached = buildSimulation();
  return cached;
}

export { HUB_R, CLUSTER_ANGLE, clusterHubXY };
