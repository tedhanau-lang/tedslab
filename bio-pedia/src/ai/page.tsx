import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, BrainCircuit, FileText, MessageCircle, Sparkles, Wand2, Zap } from 'lucide-react';
import { buildAiResponse, readKnowledge } from '@/ai';

const starterPrompts = [
  'How should I study biology efficiently?',
  'What is this site designed to help me do?',
  'Explain the basics of cell energy in simple terms.',
  'Give me a 30-minute revision plan for tomorrow.',
];

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function Pate() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help with biology, revision planning, and understanding the study material on this site. Ask me anything.',
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [fullResponse, setFullResponse] = useState('');
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const knowledgeFiles = useMemo(() => readKnowledge(), []);

  // Typewriter effect for AI responses
  useEffect(() => {
    if (!isThinking && fullResponse && typingIndex < fullResponse.length) {
      typingIntervalRef.current = setTimeout(() => {
        setTypingIndex((prev) => prev + 1);
      }, 15); // Adjust speed here (lower = faster)

      return () => {
        if (typingIntervalRef.current) clearTimeout(typingIntervalRef.current);
      };
    }
  }, [typingIndex, fullResponse, isThinking]);

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setQuestion('');
    setIsThinking(true);
    setTypingIndex(0);
    setFullResponse('');

    const response = await buildAiResponse(trimmed);
    setFullResponse(response);
    setIsThinking(false);
    setTypingIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleAsk();
    }
  };

  // Add the typed response to messages when typing is complete
  useEffect(() => {
    if (fullResponse && typingIndex === fullResponse.length && !isThinking) {
      setMessages((prev) => {
        if (prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
          return prev;
        }
        return [...prev, { role: 'assistant', content: fullResponse }];
      });
      setFullResponse('');
      setTypingIndex(0);
    }
  }, [typingIndex, fullResponse, isThinking]);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-background to-secondary/40 p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BrainCircuit className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI study tutor</h2>
              <p className="text-sm text-muted-foreground">Built from your learning knowledge</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary">
            <Zap className="size-3.5" />
            Live tutor
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuestion(prompt)}
              className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <FileText className="size-3.5" />
              {knowledgeFiles.length} sources
            </div>
            <div className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
              isThinking 
                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' 
                : 'bg-green-500/10 text-green-600 dark:text-green-400'
            }`}>
              {isThinking ? '◐ Generating...' : '✓ Ready'}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-gradient-to-b from-muted/20 to-muted/5 p-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  {message.role === 'user' ? (
                    <MessageCircle className="size-4" />
                  ) : (
                    <BrainCircuit className="size-4" />
                  )}
                </div>

                <div className={`max-w-sm ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={[
                      'rounded-2xl px-5 py-4 text-sm leading-7 shadow-xs border',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/30 rounded-br-none'
                        : 'bg-gradient-to-br from-background/95 to-background/70 text-foreground border-border/40 rounded-bl-none',
                    ].join(' ')}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary">
                  <BrainCircuit className="size-4 animate-pulse" />
                </div>
                <div className="max-w-sm">
                  <div className="rounded-2xl rounded-bl-none px-5 py-4 text-sm text-muted-foreground bg-gradient-to-br from-background/95 to-background/70 border border-border/40 shadow-xs">
                    <div className="flex gap-2 items-center h-6">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-t from-primary to-primary/40 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-t from-primary to-primary/40 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-t from-primary to-primary/40 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }} />
                      </div>
                      <span className="text-xs ml-2 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {fullResponse && !isThinking && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 size-8 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
                  <BrainCircuit className="size-4" />
                </div>
                <div className="max-w-sm">
                  <div className="rounded-2xl rounded-bl-none px-5 py-4 text-sm leading-7 shadow-xs border bg-gradient-to-br from-background/95 to-background/70 text-foreground border-border/40">
                    <div className="whitespace-pre-wrap break-words">
                      {fullResponse.slice(0, typingIndex)}
                      {typingIndex < fullResponse.length && (
                        <span className="animate-pulse text-primary font-semibold">|</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wide">Your question</label>
            <div className="relative">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/80 focus:bg-background focus:ring-1 focus:ring-primary/30 transition-all"
                placeholder="Ask me about biology, study techniques, revision tips..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 rounded text-xs border border-border bg-muted">Enter</kbd> to send
              </div>
              <button
                type="button"
                onClick={() => void handleAsk()}
                disabled={isThinking || !question.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isThinking ? (
                  <>
                    <Wand2 className="size-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Ask Atom AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <ArrowUpRight className="size-4 text-primary" />
          Quick guide
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm leading-7 text-foreground">
          Ask for study advice, explanations of core concepts, revision plans, or a summary of how the site works.
        </div>
      </div>
    </div>
  );
}
