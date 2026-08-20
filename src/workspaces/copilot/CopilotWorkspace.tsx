import { Sparkles } from 'lucide-react';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useCopilotStore } from '../../store/useCopilotStore';
import { ChatPanel } from './ChatPanel';
import { ToolCallTrace } from './ToolCallTrace';
import { InsightCard } from './InsightCard';

// The centerpiece workspace: a chat interface backed by a scripted,
// fully-inspectable tool-call trace, with the resulting evidence-backed
// Insight rendered alongside it. Both ToolCallTrace and the insight lookup
// subscribe directly to useCopilotStore, so they re-render live as
// runSardinellaDemo() (triggered from ChatPanel) streams updates in.
export function CopilotWorkspace() {
  const currentInsightId = useCopilotStore((s) => s.currentInsightId);
  const insight = useCopilotStore((s) => (s.currentInsightId ? s.insights[s.currentInsightId] : null));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WorkspaceHeader
        title="Copilot"
        description="Ask a question — every answer is backed by a live, inspectable tool-call trace."
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)]">
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <h3 className="text-sm font-medium text-[var(--color-text)]">Chat</h3>
            </div>
            <div className="min-h-0 flex-1">
              <ChatPanel />
            </div>
          </div>

          <div className="flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)]">
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <h3 className="text-sm font-medium text-[var(--color-text)]">Tool Call Trace</h3>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-3">
              <ToolCallTrace />
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-auto">
          {insight ? (
            <InsightCard key={currentInsightId} insight={insight} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={Sparkles}
                title="No insight yet"
                description="Ask the suggested question in the chat to see a full evidence-backed insight appear here."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
