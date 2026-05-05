import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { createAppQueryClient } from "#src/query-client";

describe("createAppQueryClient", () => {
  it("should create a QueryClient with default retry logic", () => {
    const client = createAppQueryClient();
    expect(client).toBeInstanceOf(QueryClient);
    expect(client.getDefaultOptions().queries?.retry).toBe(false);
  });
});
