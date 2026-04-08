/// <reference types="vite/client" />

interface Window {
  __SM_RUNTIME__?: {
    UNLEASH_PROXY_URL?: string;
    UNLEASH_CLIENT_KEY?: string;
    UNLEASH_ENVIRONMENT?: string;
  };
}
