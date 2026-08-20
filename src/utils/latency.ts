export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function simulatedLatency(base = 400, jitter = 500): number {
  return base + Math.random() * jitter;
}
