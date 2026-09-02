import type { ArticleCore } from "../types";

export type MiniFact = {
  id: string;
  title: string;
  born?: string;
  hook: string;
  claim: string;
  scene: string;
  origin: string;
  work: string;
  quarrel: string;
  still: string;
  links: string;
};

function w(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function expandFact(f: MiniFact): ArticleCore {
  const who = f.born ? ` The record of a life begins around ${f.born}.` : "";
  const name = `[[${f.id}|${f.title}]]`;
  return {
    lede: w(
      `${name} is kept in this vault as a room you can enter from any neighboring idea.${who} ${f.hook} ${f.scene} ${f.links} The atlas refuses to treat the subject as a dictionary gloss. It is a climate with doors, and the doors have names. To read the entry is to accept that the shortest path through ${f.title} is rarely a straight line, and that a serious account must hold the official story and the one that appears when the official story fails.`,
    ),
    idea: w(
      `${f.claim} That is the load-bearing sentence; everything else in this article is a way of living with it. ${f.scene} ${f.work} ${f.links} A reader who wants a slogan will be disappointed. ${f.title} is not a course title and not a brand. It names a region of argument with methods, enemies, and a habit of producing further questions. The surrounding nodes are not "see also" afterthoughts. They are the load-bearing walls. Held apart they look like jargon; held together they look like a small theory. The atlas is built for the second description without discarding the first, so that a survey-course version of ${f.title} can sit in the same room as the version that shows up in a lab, a clinic, a parliament, or a late-night notebook.`,
    ),
    lineage: w(
      `The lineage of ${name} is the story of people who needed a word for a difficulty and then had to live with the word they chose.${who} ${f.origin} ${f.work} Intellectual history is often told as a relay of geniuses. A graph tells a ruder truth: most of the work is done in the edges, in the hand-offs, in the misunderstandings that became research programs. ${f.title} survived because it could be misread productively. Names collected in this neighborhood mark turns in the path rather than destinations. Biography is a door; the room is the problem they would not leave alone. The atlas prefers paths to pedestals, and it keeps the path clickable so a reader can walk from a century to a method without pretending the century was a preface.`,
    ),
    tension: w(
      `Every live idea has a fault line. ${f.quarrel} ${f.still} The popular thumbnail of ${f.title} is often a century behind the working literature, and the working literature is often a decade behind the problems that made the idea necessary. The atlas does not pick a winner. It keeps the tension visible so a reader can feel the strain that produces new work, then step sideways into a neighbor when the strain becomes a question with a different name. Disagreement here is not a failure of the field. It is the sound of the field working, provided the disagreement is about what would even count as settling the matter.`,
    ),
  };
}
