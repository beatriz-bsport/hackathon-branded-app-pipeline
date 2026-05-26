declare global {
  interface Window {
    __SM_RUNTIME__: {
      API_BASE_URL: string;
      GOOGLE_MAPS_API_KEY?: string;
    };
  }
}

export {};
