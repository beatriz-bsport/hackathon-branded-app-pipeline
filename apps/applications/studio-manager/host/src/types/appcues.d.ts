// Minimal surface for now; expand when needed.
interface AppcuesClient {
  page(): void;
  identify?(userId: string | number, attrs?: Record<string, unknown>): void;
  track?(eventName: string, props?: Record<string, unknown>): void;
  anonymous?(): void;
}

declare global {
  interface Window {
    Appcues?: AppcuesClient;
    AppcuesSettings?: Record<string, unknown>;
  }
}

export {};
