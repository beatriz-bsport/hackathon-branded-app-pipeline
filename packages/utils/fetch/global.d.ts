declare global {
  type RuntimeFetchEnv = {
    API_BASE_URL?: string;
    VITE_API_BASE_URL?: string;
  };

  interface Window {
    runtime?: {
      env?: RuntimeFetchEnv;
    };
    runtimeBsport?: {
      env?: RuntimeFetchEnv;
    };
  }
}

export {};
