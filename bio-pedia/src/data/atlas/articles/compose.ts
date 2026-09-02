import { CLUSTERS, NODE_BY_ID, NODES, backlinksTo, neighborsOf } from "../catalog";
import type { Article, ArticleCore, AtlasNode, ClusterIdOrAtlas, NodeKind } from "../types";
import { CORES } from "./cores";

function words(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function clusterTitle(id: ClusterIdOrAtlas): string {
  if (id === "atlas") return "the Atlas";
  return CLUSTERS.find((c) => c.id === id)?.title ?? id;
}

function link(id: string): string {
  const n = NODE_BY_ID[id];
  return n ? `[[${n.id}|${n.title}]]` : id;
}

function kindPhrase(kind: NodeKind): string {
  switch (kind) {
    case "atlas":
      return "the map itself";
    case "hub":
      return "a continent of the atlas";
    case "topic":
      return "a major field of inquiry";
    case "figure":
      return "a person who moved the map";
    case "concept":
      return "a working idea";
  }
}

function relationSentences(from: AtlasNode, to: AtlasNode): string {
  const A = link(from.id);
  const B = link(to.id);
  const t = to.summary.replace(/\s+/g, " ").trim().replace(/\.$/, "");
  const pair = `${from.kind}:${to.kind}`;

  const variants: Record<string, string[]> = {
    "topic:figure": [
      `${A} is bound to a life as well as a literature. ${B} (${to.born ?? "dates disputed"}) stands in this neighborhood because the field still argues in their vocabulary. ${t}. Read from here, their work is not a biography tacked on but a method the topic never quite outgrew.`,
      `No account of ${A} is complete without ${B}. Born ${to.born ?? "into an earlier map of the world"}, they left tools the field still uses. ${t}. The atlas treats the person as a node, not a monument: click through and the same edges run the other way.`,
    ],
    "topic:concept": [
      `${A} becomes precise only when it borrows the language of ${B}. ${t}. The concept is not a decoration on the field; it is one of the load-bearing walls. Lose it and the topic sags into metaphor.`,
      `Inside ${A} sits ${B}, a tighter knot of meaning. ${t}. Moving between the two is the ordinary work of the atlas: from a landscape to a landmark, then back again with better questions.`,
    ],
    "topic:topic": [
      `${A} and ${B} share a border that is not always drawn on departmental maps. ${t}. Students who stay inside one field miss the weather coming in from the other. This vault insists on the crossing.`,
      `Set ${A} beside ${B} and a third subject appears in the gap. ${t}. The atlas keeps both in view so that explanation in one register can be checked against explanation in the other.`,
    ],
    "figure:topic": [
      `${from.title} is filed here as a person, but the work lives in ${B}. ${t}. Biography is the door; the room is the problem they would not leave alone.`,
      `What ${from.title} touched most lastingly is ${B}. ${t}. The figure node exists so a reader can approach that field through a temperament, a century, and a set of stubborn questions.`,
    ],
    "figure:concept": [
      `${from.title}'s name clings to ${B} the way a discoverer's name clings to a coastline. ${t}. Whether the attribution is fair is a historical argument; that the idea still organizes work is not.`,
    ],
    "figure:figure": [
      `${link(from.id)} and ${B} are neighbors because their problems overlap even when their answers do not. ${t}. Intellectual history is a graph of such near-misses and hand-offs.`,
    ],
    "concept:topic": [
      `${A} is a tool; ${B} is one of the workshops that still uses it. ${t}. A concept that cannot survive contact with a living field is a relic. This one has not yet become a relic.`,
      `To see why ${A} earns a node of its own, watch it operate inside ${B}. ${t}. The field gives the idea consequences; the idea gives the field a way to speak.`,
    ],
    "concept:concept": [
      `${A} and ${B} sharpen each other. ${t}. Held apart they look like jargon; held together they look like a small theory.`,
    ],
    "concept:figure": [
      `The phrase ${A.replace(/\[\[|\]\]/g, "")} is never only a phrase. ${B} gave it a life in public argument. ${t}.`,
    ],
    "hub:topic": [
      `As a continent, ${A} is useless without interior. ${B} is one of its ranges. ${t}. A reader who only skims the hub article will mistake a coastline for a country.`,
      `${B} is not a subfolder of ${A} so much as a climate inside it. ${t}. The hub gathers; the topic argues.`,
    ],
    "hub:figure": [
      `Every continent has its cartographers. ${B} is one of ${A}'s. ${t}. Their node is a reminder that fields are made by people who could have done otherwise.`,
    ],
    "hub:concept": [
      `${A} keeps ${B} in circulation as part of its working vocabulary. ${t}. Hubs are not summaries; they are junctions.`,
    ],
    "hub:hub": [
      `${A} meets ${B} at a seam the departmental university pretends is a wall. ${t}. The atlas is built to make that seam clickable.`,
    ],
    "atlas:hub": [
      `From the center of the vault, ${B} is one of eight glowing continents. ${t}. The atlas is not above these fields; it is the way of traveling among them.`,
    ],
    "topic:hub": [
      `${A} belongs to the larger weather of ${B}. ${t}. Zoom out and the topic is a city; zoom in and it is a world.`,
    ],
    "concept:hub": [
      `${A} is filed under ${B} because that is the climate in which it is most often used — not the only climate in which it lives. ${t}.`,
    ],
    "figure:hub": [
      `${from.title} is placed in ${B} the way a library places a life among its problems rather than among its dates. ${t}.`,
    ],
  };

  const pool = variants[pair] ?? [
    `${A} leans toward ${B}. ${t}. In a graph this is an edge; in a mind it is a habit of reaching.`,
    `Follow ${A} far enough and you find ${B} already waiting. ${t}. The atlas records the meeting so you do not have to rediscover it alone.`,
  ];

  const hash = Math.abs(hashId(from.id + "->" + to.id));
  return pool[hash % pool.length];
}

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

function fallbackCore(node: AtlasNode): ArticleCore {
  const cluster = clusterTitle(node.cluster);
  const figures = node.related
    .map((id) => NODE_BY_ID[id])
    .filter((n): n is AtlasNode => n?.kind === "figure")
    .slice(0, 4);
  const concepts = node.related
    .map((id) => NODE_BY_ID[id])
    .filter((n): n is AtlasNode => n?.kind === "concept")
    .slice(0, 4);
  const topics = node.related
    .map((id) => NODE_BY_ID[id])
    .filter((n): n is AtlasNode => n?.kind === "topic" || n?.kind === "hub")
    .slice(0, 5);
  const born = node.born ? ` The record of a life begins around ${node.born}.` : "";
  const tagLine = node.tags.length
    ? ` Its working tags in this vault — ${node.tags.map((t) => `*${t}*`).join(", ")} — are handles for retrieval, not a claim that the subject has been tamed.`
    : "";

  return {
    lede: `${node.title} is ${kindPhrase(node.kind)} in ${cluster}, kept here as a place you can enter from any neighboring idea.${born} ${node.summary} The atlas refuses to treat this as a dictionary gloss. It is a room with doors, and the doors have names: ${node.related
      .slice(0, 5)
      .map(link)
      .join(", ")}. To read the entry is to accept that the shortest path through ${node.title.toLowerCase()} is rarely a straight line.`,
    idea: `${node.title} is not a slogan and not a course title. It names a region of argument with methods, enemies, and a habit of producing further questions. ${node.summary} What follows treats the idea as something that can be inhabited: interior rooms, not a label on a cabinet. ${
      topics.length
        ? `The surrounding fields — ${topics.map((t) => link(t.id)).join(", ")} — are not "see also" afterthoughts. They are the load-bearing walls.`
        : ""
    } ${
      concepts.length
        ? `Working vocabulary collected here includes ${concepts.map((c) => link(c.id)).join(", ")}. Each of those nodes is a tighter knot; this one is the climate they share.`
        : ""
    } A serious reader of ${node.title} learns to hold at least two descriptions at once: the official one taught in survey courses, and the one that shows up when the official one fails. The atlas is built for the second description without discarding the first.${tagLine}`,
    lineage: `The lineage of ${node.title} is the story of people who needed a word for a difficulty and then had to live with the word they chose. In ${cluster} that story crosses centuries and sometimes continents.${born} ${
      figures.length
        ? `Names collected in this neighborhood — ${figures.map((n) => link(n.id)).join(", ")} — mark turns in the path rather than destinations. Biography is a door; the room is the problem they would not leave alone.`
        : `The cartographers of this idea are scattered across adjacent nodes; follow the edges rather than hunting a single founder.`
    } Intellectual history is often told as a relay of geniuses. A graph tells a ruder truth: most of the work is done in the edges, in the hand-offs, in the misunderstandings that became research programs. ${node.title} survived because it could be misread productively. The atlas prefers paths to pedestals, and it keeps the path clickable.`,
    tension: `Every live idea has a fault line. For ${node.title} the fault is not that scholars disagree — disagreement is the sound of the field working — but that the disagreement is about what would even count as settling the matter. Some neighbors pull toward formalization, others toward history, others toward use in ${
      topics[0] ? link(topics[0].id) : cluster.toLowerCase()
    }. There is a further strain: the popular thumbnail of ${node.title} is often a century behind the working literature, and the working literature is often a decade behind the problems that made the idea necessary. The atlas does not pick a winner. It keeps the tension visible so a reader can feel the strain that produces new work, then step sideways into ${
      node.related[0] ? link(node.related[0]) : "a neighbor"
    } when the strain becomes a question with a different name.`,
  };
}

function sectionTitles(kind: NodeKind): { idea: string; lineage: string; net: string; tension: string } {
  switch (kind) {
    case "figure":
      return { idea: "Work", lineage: "Life and century", net: "Who they pull in", tension: "Afterlives and arguments" };
    case "hub":
      return { idea: "The continent", lineage: "How the field gathered", net: "Interior ranges", tension: "Fault lines" };
    case "atlas":
      return { idea: "What a map of knowledge is", lineage: "Earlier atlases", net: "The eight climates", tension: "What a map conceals" };
    case "concept":
      return { idea: "The working idea", lineage: "Where the word came from", net: "Where it is used", tension: "What it cannot yet do" };
    default:
      return { idea: "The field", lineage: "A brief lineage", net: "A neighborhood", tension: "Open problems" };
  }
}

export function composeBody(node: AtlasNode): string {
  const core = CORES[node.id] ?? fallbackCore(node);
  const titles = sectionTitles(node.kind);
  const neigh = neighborsOf(node.id)
    .map((id) => NODE_BY_ID[id])
    .filter((n): n is AtlasNode => Boolean(n));

  const preferred = [...neigh].sort((a, b) => {
    const rank = (k: NodeKind) => ({ hub: 0, topic: 1, concept: 2, figure: 3, atlas: 4 })[k];
    return rank(a.kind) - rank(b.kind);
  });

  const used = new Set<string>();
  const relationParas: string[] = [];
  for (const other of preferred) {
    if (used.has(other.id)) continue;
    used.add(other.id);
    relationParas.push(relationSentences(node, other));
    if (relationParas.length >= 12) break;
  }

  const backs = backlinksTo(node.id)
    .filter((id) => !used.has(id))
    .slice(0, 4)
    .map((id) => NODE_BY_ID[id])
    .filter((n): n is AtlasNode => Boolean(n));

  const backPara =
    backs.length > 0
      ? `The atlas also records incoming paths. ${backs
          .map(
            (b) =>
              `${link(b.id)} reaches ${link(node.id)} from ${clusterTitle(b.cluster).toLowerCase()}: ${b.summary}`,
          )
          .join(" ")} Following a backlink is how a reader discovers that a private obsession is already a public road.`
      : `Some nodes are sources more than destinations. ${link(node.id)} is densely outgoing; its backlinks will thicken as the vault is read, because reading is itself a way of drawing edges.`;

  const close = `To read ${link(node.id)} well is not to finish it. It is to leave with two or three neighbors open, a disagreement you can name, and a sense of where this idea sits in ${clusterTitle(
    node.cluster,
  )}. The Knowledge Atlas is built for that kind of unfinished reading — the kind that turns a single page into a journey across glowing filaments. Return to the graph. The node will still be there, a little brighter for having been visited.`;

  const tags = node.tags.map((t) => `*${t}*`).join(", ");

  return [
    core.lede,
    "",
    `## ${titles.idea}`,
    "",
    core.idea,
    "",
    `## ${titles.lineage}`,
    "",
    core.lineage,
    "",
    `## ${titles.net}`,
    "",
    ...relationParas.flatMap((p) => [p, ""]),
    backPara,
    "",
    `## ${titles.tension}`,
    "",
    core.tension,
    "",
    `## In the atlas`,
    "",
    `${node.title} is filed as ${kindPhrase(node.kind)} inside ${clusterTitle(
      node.cluster,
    )}. Its tags — ${tags} — are handles, not a taxonomy that could ever be complete. ${close}`,
  ].join("\n");
}

export function wordCountOf(body: string): number {
  return words(body.replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1").replace(/[#*_]/g, " "));
}

export function getArticle(id: string): Article | undefined {
  const node = NODE_BY_ID[id];
  if (!node) return undefined;
  const body = composeBody(node);
  return {
    id: node.id,
    title: node.title,
    cluster: node.cluster,
    kind: node.kind,
    tags: node.tags,
    summary: node.summary,
    related: node.related,
    body,
    wordCount: wordCountOf(body),
  };
}

export const ARTICLES: Record<string, Article> = Object.fromEntries(
  NODES.map((n) => {
    const a = getArticle(n.id)!;
    return [n.id, a];
  }),
);
