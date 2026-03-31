declare global {
  type RuntimeFetchEnv = {
    API_BASE_URL?: string;
    VITE_API_BASE_URL?: string;
  };

  interface Window {
    __API_ENV__?: string;
    runtime?: {
      env?: RuntimeFetchEnv;
    };
    runtimeBsport?: {
      env?: RuntimeFetchEnv;
    };
  }
}

export {};
