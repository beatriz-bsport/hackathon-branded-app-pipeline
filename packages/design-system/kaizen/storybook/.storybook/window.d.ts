declare global {
  interface Window {
    __SM_RUNTIME__: {
      API_BASE_URL: string;
    };
  }
}

export {};
