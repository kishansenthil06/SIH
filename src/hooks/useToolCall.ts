import { useEffect, useRef, useState } from 'react';
import type { ToolResult } from '../tools/client';

interface UseToolCallState<T> {
  data: T | null;
  result: ToolResult<T> | null;
  loading: boolean;
  error: Error | null;
}

// Generic query-shaped wrapper around any tools/* function. Pass `args` as
// null to skip the call until the caller has what it needs (e.g. a selected
// species). Every workspace uses this same hook against the same tools/*
// functions the Copilot's demo script calls, so results stay consistent.
export function useToolCall<Args, T>(
  fn: (args: Args) => Promise<ToolResult<T>>,
  args: Args | null,
  deps: unknown[] = []
): UseToolCallState<T> {
  const [state, setState] = useState<UseToolCallState<T>>({ data: null, result: null, loading: args !== null, error: null });
  const requestId = useRef(0);

  useEffect(() => {
    if (args === null) {
      setState({ data: null, result: null, loading: false, error: null });
      return;
    }
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn(args)
      .then((result) => {
        if (requestId.current !== id) return;
        setState({ data: result.data, result, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (requestId.current !== id) return;
        setState({ data: null, result: null, loading: false, error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
