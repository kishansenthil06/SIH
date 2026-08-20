import { delay, simulatedLatency } from '../utils/latency';

export interface ToolResult<T> {
  data: T;
  toolName: string;
  args: Record<string, unknown>;
  calledAt: string;
  latencyMs: number;
  source: 'mock' | 'live';
}

// Every mock tool routes through here so latency, timestamps, and the
// mock/live tag are applied uniformly -- this is what a real backend swap
// would replace (return a fetch() call instead of calling `compute`).
export async function callTool<T>(toolName: string, args: Record<string, unknown>, compute: () => T): Promise<ToolResult<T>> {
  const latencyMs = simulatedLatency();
  const startedAt = Date.now();
  await delay(latencyMs);
  const data = compute();
  return {
    data,
    toolName,
    args,
    calledAt: new Date(startedAt).toISOString(),
    latencyMs: Math.round(latencyMs),
    source: 'mock',
  };
}
