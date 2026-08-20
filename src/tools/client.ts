export interface ToolResult<T> {
  data: T;
  toolName: string;
  args: Record<string, unknown>;
  calledAt: string;
  latencyMs: number;
  source: 'mock' | 'live';
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

// Every tool routes through here to call the real backend.
export async function liveCall<T>(
  toolName: string,
  args: Record<string, unknown>,
  path: string,
  init?: RequestInit
): Promise<ToolResult<T>> {
  const startedAt = Date.now();
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    throw new Error(`${toolName} failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as T;
  return {
    data,
    toolName,
    args,
    calledAt: new Date(startedAt).toISOString(),
    latencyMs: Date.now() - startedAt,
    source: 'live',
  };
}
