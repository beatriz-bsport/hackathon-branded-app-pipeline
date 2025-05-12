import type { Fetch } from "@bsport/store-base";

/**
 * Creates a fetch function that matches the @bsport/store-base Fetch type signature.
 * This function will make real network requests that will be intercepted by MSW.
 *
 * @template T The expected response data type
 * @returns A function that matches the Fetch type from @bsport/store-base
 */
export function createTestFetch<T>(): Fetch<T> {
  return async (uri, init) => {
    const response = await fetch(`http://localhost/${uri}`, init);
    const data = await response.json();
    return { data, status: response.status };
  };
}
