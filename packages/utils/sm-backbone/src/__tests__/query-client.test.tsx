import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { HTTPException } from "@bsport/fetch";

import { createAppQueryClient } from "#src/query-client";

describe("createAppQueryClient", () => {
  it("should create a QueryClient with default retry logic", () => {
    const client = createAppQueryClient();
    expect(client).toBeInstanceOf(QueryClient);
    expect(client.getDefaultOptions().queries?.retry).toBeDefined();
  });

  it("should not retry on 4xx (ClientError)", () => {
    const client = createAppQueryClient();
    const retryFn = client.getDefaultOptions().queries?.retry;
    const error = new HTTPException({ path: "/my-path", statusCode: 401 });

    // @ts-expect-error retryFn not callable
    expect(retryFn?.(1, error)).toBe(false);
  });

  it("should retry up to 3 times on 5xx/Network errors", () => {
    const client = createAppQueryClient();
    const retryFn = client.getDefaultOptions().queries?.retry;
    const error = new HTTPException({ statusCode: 500, path: "/my-path" });
    // @ts-expect-error retryFn not callable
    expect(retryFn?.(1, error)).toBe(true);
    // @ts-expect-error retryFn not callable
    expect(retryFn?.(2, error)).toBe(true);
    // @ts-expect-error retryFn not callable
    expect(retryFn?.(3, error)).toBe(false);
  });
});
