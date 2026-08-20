import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';
import { runSardinellaDemo } from '../../demo/demoRunner';
import { SARDINELLA_QUESTION } from '../../demo/sardinellaScript';
import { nextId } from '../../utils/id';
import { DemoModeToggle } from './DemoModeToggle';

const FALLBACK_TEXT =
  "I can answer questions about Sardinella longiceps decline in Kerala — try asking why it's declining.";

// Matches the demo's topic loosely (case-insensitive "sardin"/"declin"
// substrings) so both the suggested chip and reasonably-phrased free text
// trigger the scripted tool-call sequence.
const TOPIC_PATTERN = /sardin|declin/i;

export function ChatPanel() {
  const messages = useCopilotStore((s) => s.messages);
  const isRunning = useCopilotStore((s) => s.isRunning);
  const addMessage = useCopilotStore((s) => s.addMessage);

  const [input, setInput] = useState('');
  const [demoMode, setDemoMode] = useState(true);

  async function handleAsk(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isRunning) return;

    addMessage({ id: nextId('msg'), role: 'user', text: trimmed });
    setInput('');

    if (demoMode && TOPIC_PATTERN.test(trimmed)) {
      const insight = await runSardinellaDemo();
      addMessage({ id: nextId('msg'), role: 'assistant', text: 'Here is what I found:', insightId: insight.id });
    } else {
      addMessage({ id: nextId('msg'), role: 'assistant', text: FALLBACK_TEXT });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void handleAsk(input);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--color-text-dim)]">
            Ask a question about ocean, fisheries, or biodiversity data — or try the suggested question below.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={clsx('flex items-start gap-2', m.role === 'user' && 'flex-row-reverse')}>
            <div
              className={clsx(
                'flex h-7 w-7 flex-none items-center justify-center rounded-full border',
                m.role === 'user'
                  ? 'border-[var(--color-accent-strong)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] text-[var(--color-text-muted)]'
              )}
            >
              {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            <div
              className={clsx(
                'max-w-[80%] rounded-xl border px-3 py-2 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'border-[var(--color-accent-strong)]/30 bg-[var(--color-accent-soft)] text-[var(--color-text)]'
                  : 'border-[var(--color-border)] bg-[var(--color-panel-hover)] text-[var(--color-text)]'
              )}
            >
              {m.text}
              {m.insightId && (
                <p className="mt-1 text-xs text-[var(--color-text-dim)]">See the insight panel for the full breakdown.</p>
              )}
            </div>
          </div>
        ))}
        {isRunning && (
          <div className="flex items-center gap-2 pl-9 text-xs text-[var(--color-text-dim)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            investigating…
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleAsk(SARDINELLA_QUESTION)}
            disabled={isRunning}
            title={SARDINELLA_QUESTION}
            className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-lg border border-[var(--color-accent-strong)]/40 bg-[var(--color-accent-soft)] px-3 py-1.5 text-left text-xs text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 flex-none" />
            <span className="truncate">{SARDINELLA_QUESTION}</span>
          </button>
          <DemoModeToggle enabled={demoMode} onChange={setDemoMode} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isRunning}
            placeholder={isRunning ? 'Investigating…' : 'Ask a question…'}
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isRunning || !input.trim()}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
