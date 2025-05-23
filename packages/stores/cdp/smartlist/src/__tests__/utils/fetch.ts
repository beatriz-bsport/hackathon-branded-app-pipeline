import type { Fetch } from "@bsport/store-base";

/**
 * Creates a fetch function that matches the @bsport/store-base Fetch type signature.
 * This function will make real network requests that will be intercepted by MSW.
 *
 * @template T The expected response data type
 * @returns A function that matches the Fetch type from @bsport/store-base
 */
export function createTestFetch<T>(): Fetch<T> {
  return async (
    uri: string,
    init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
  ): Promise<{
    data: T;
    status: number;
    backgroundTaskUuid: string | null;
  }> => {
    const response = await fetch(`http://localhost/${uri}`, init);

    // Throw an error for non-2xx status codes
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // For 204 No Content responses, return undefined as data
    if (response.status === 204) {
      return {
        data: undefined as unknown as T,
        status: response.status,
        backgroundTaskUuid: "",
      };
    }

    // For other responses, parse JSON
    const data = (await response.json()) as T;
    return { data, status: response.status, backgroundTaskUuid: "" };
  };
}
