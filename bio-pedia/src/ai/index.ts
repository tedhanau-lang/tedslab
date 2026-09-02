const knowledgeSources = [
  {
    name: 'Site overview',
    text: `# Site overview

Ted's Lab is a learning encyclopedia for biology, science, maths, English, history, and technology.

The site is designed around three learning habits:

1. Learn the idea from a clear article.
2. Check the connections between topics and sections.
3. Test memory with notes, flashcards, and notebook review.

The AI should answer in a helpful, structured way that supports students rather than just repeating facts.

Use the project structure when answering:
- Articles explain the core concept.
- Topic pages connect the concept to the broader subject.
- Study tools help recall and apply ideas.
- The notebook is for personal revision and writing answers.`
  },
  {
    name: 'Study methods',
    text: `# Study methods

Effective study is not just rereading. Students learn best when they:

- define the key idea in one sentence
- connect it to a real example
- explain it without notes
- check what they still misunderstand
- revise in short sessions instead of one long session

A good study answer should be clear, concrete, and actionable.

Use this sequence when responding to questions:
1. start with the core idea
2. explain the mechanism or steps
3. give a simple example
4. mention a common mistake
5. suggest a revision action

For biology questions, prefer concept-first explanations that teach the idea before the detail.`
  },
  {
    name: 'Biology foundations',
    text: `# Biology foundations

Biology is the study of life and living systems.

Key foundations:
- Cells are the basic units of life.
- DNA stores genetic information.
- Enzymes speed up chemical reactions.
- Energy flows through ecosystems.
- Evolution explains how populations change over time.
- Homeostasis keeps internal conditions stable.

Useful framing for answers:
- describe the process
- explain why it matters
- connect it to a larger system
- compare it to a related idea

Example: photosynthesis uses light energy to build sugars from carbon dioxide and water; cellular respiration releases stored energy from sugars for cell work.

The AI should simplify complex biology without becoming inaccurate. It should help students understand, not overwhelm them.`
  },
  {
    name: 'General learning',
    text: `# General learning framework

The best way to answer almost any question is to:

1. Identify the core concept in one sentence.
2. Explain the main parts or steps.
3. Give a simple example.
4. Mention the most common mistake.
5. Suggest how to review or apply it.

This learning method works for science, maths, writing, history, technology, and everyday problem-solving.

When the question is broad, answer in plain language first and add detail second. Helpful answers are short, structured, and actionable.

A strong explanation should do three things:
- define the idea
- connect it to a real example
- tell the learner what to do next`
  }
];

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractRelevantSections(question: string) {
  const query = normalize(question);
  const tokens = query.split(' ').filter(Boolean);

  return knowledgeSources
    .map((source) => {
      const text = source.text.toLowerCase();
      const score = tokens.reduce((total, token) => {
        if (!token) return total;
        const occurrences = (text.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        return total + occurrences;
      }, 0);

      return { ...source, score };
    })
    .filter((source) => source.score > 0)
    .sort((a, b) => b.score - a.score);
}

function buildGeneralAnswer(question: string) {
  const q = normalize(question);

  if (q.includes('photosynth') || q.includes('chlorophyll') || q.includes('glucose')) {
    return 'Photosynthesis is the process plants use to capture light energy and turn carbon dioxide and water into sugars, which store chemical energy. In simple terms: light powers the reaction, the plant makes food, and that food supports growth and survival.';
  }

  if (q.includes('cell') || q.includes('mitosis') || q.includes('dna') || q.includes('enzyme')) {
    return 'A cell is the basic unit of life, and its parts work together to keep the organism alive. The key idea is that structure and function are connected: DNA stores instructions, enzymes speed reactions, and cell processes keep energy, growth, and repair working properly.';
  }

  if (q.includes('energy') || q.includes('respiration') || q.includes('atp')) {
    return 'Cells need energy to move, grow, divide, and maintain order. In biology, energy is usually captured in chemical form and then released when the cell needs to do work, such as during cellular respiration where stored fuel is converted into usable energy.';
  }

  if (q.includes('study') || q.includes('revise') || q.includes('learn') || q.includes('exam') || q.includes('revision')) {
    return 'The best study method is to start with the core idea in one sentence, explain it without notes, then test yourself with one example and one question. Review the parts that feel fuzzy, keep sessions short, and repeat the process over time so knowledge becomes stable.';
  }

  if (q.includes('solve') || q.includes('equation') || q.includes('math') || q.includes('algebra')) {
    return 'To solve a mathematical problem, identify the goal, rewrite the information in simpler form, solve one step at a time, and then check the answer against the original question. This keeps the process clear and reduces careless mistakes.';
  }

  if (q.includes('why')) {
    return 'The reason is usually the purpose or mechanism behind the result. Explain the cause, then describe the effect in one sentence, and give a simple example so the logic is easy to follow.';
  }

  if (q.includes('how')) {
    return 'The clearest way to answer a how question is to describe the process step by step: what happens first, what changes next, and why that matters. Then finish with one example and one brief summary.';
  }

  if (q.includes('what is') || q.includes('define') || q.includes('meaning')) {
    return 'The main idea is the concept itself: define it in plain language, explain the most important parts, and give one example. That makes the answer clear without overwhelming the learner with unnecessary detail.';
  }

  if (q.includes('compare') || q.includes('difference') || q.includes('similar')) {
    return 'A comparison answer should name the two ideas, explain what they share, and then highlight the key difference in purpose, structure, or outcome. That gives the learner a clean contrast instead of a vague summary.';
  }

  if (q.includes('who')) {
    return 'A who question is usually about the person, process, or system involved. Name the key figure or category, explain their role briefly, and give one sentence on why they matter.';
  }

  return 'The strongest answer starts with the main idea in one sentence, explains the important parts in plain language, gives a simple example, and ends with a quick check for understanding. That structure works for science, study advice, and general questions alike.';
}

export function readKnowledge() {
  return knowledgeSources;
}

function getOpenRouterApiKey() {
  const maybeMetaKey = typeof import.meta !== 'undefined' ? (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_OPENROUTER_API_KEY : undefined;
  if (maybeMetaKey) return maybeMetaKey;

  if (typeof process !== 'undefined') {
    return process.env?.OPENROUTER_API_KEY ?? process.env?.VITE_OPENROUTER_API_KEY;
  }

  return undefined;
}

async function askOpenRouter(question: string): Promise<string | null> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) return null;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://study-hub.local',
        'X-Title': 'Study Hub AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful study tutor for a biology and learning site. Give clear, concise, educational answers and keep them practical and student-friendly.',
          },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter request failed:', response.status, errorText);
      return null;
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const answer = data.choices?.[0]?.message?.content?.trim();
    return answer && answer.length > 0 ? answer : null;
  } catch (error) {
    console.error('OpenRouter request error:', error);
    return null;
  }
}

export async function buildAiResponse(question: string) {
  const trimmed = question.trim();
  if (!trimmed) {
    return 'Ask me anything about the site, study methods, or biology concepts and I will answer using the project knowledge files.';
  }

  const directAnswer = await askOpenRouter(trimmed);
  if (directAnswer) {
    return directAnswer;
  }

  const relevant = extractRelevantSections(trimmed);
  const primary = relevant[0] ?? knowledgeSources[knowledgeSources.length - 1];
  const supporting = relevant.slice(1, 3);

  const answer = buildGeneralAnswer(trimmed);
  const intro = `I reviewed the project knowledge and focused on ${primary.name}.`;

  if (supporting.length > 0) {
    return `${intro}\n\n${answer}\n\nThis answer also connects with ${supporting.map((item) => item.name).join(', ')} so the guidance fits both the learning goals and the site structure.`;
  }

  return `${intro}\n\n${answer}`;
}
