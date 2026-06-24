import { describe, expect, it } from "vitest";

import { buildCancelGroupSessionPayload } from "#src/utils/series-cancel-payload";

describe("series-cancel-payload", () => {
  it("builds a single-series cancel payload with notification enabled", () => {
    expect(buildCancelGroupSessionPayload({ notifyIfCancelled: true })).toEqual(
      {
        notify_if_cancelled: true,
        similar_group_ids: [],
      },
    );
  });

  it("keeps linked or similar group cancellation out of scope", () => {
    expect(
      buildCancelGroupSessionPayload({ notifyIfCancelled: false }),
    ).toEqual({
      notify_if_cancelled: false,
      similar_group_ids: [],
    });
  });
});
