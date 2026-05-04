import { describe, expect, it } from "vitest";

import { buildWatchScriptContent, getRemotesToStart } from "./executor";

describe("getRemotesToStart", () => {
  it("prefers explicit remotes, including empty arrays", () => {
    expect(
      getRemotesToStart(
        { remotes: ["@bsport/custom-remote"] },
        {
          devPort: 4000,
          remotes: {
            "sm-navigation-sidebar": { devPort: 4050 },
          },
        },
      ),
    ).toEqual(["@bsport/custom-remote"]);

    expect(
      getRemotesToStart(
        { remotes: [] },
        {
          devPort: 4000,
          remotes: {
            "sm-navigation-sidebar": { devPort: 4050 },
          },
        },
      ),
    ).toEqual([]);
  });

  it("derives bsport package names from federation remotes", () => {
    expect(
      getRemotesToStart(
        {},
        {
          devPort: 4000,
          remotes: {
            "sm-navigation-sidebar": { devPort: 4050 },
            "sm-giftcard": { devPort: 4150 },
          },
        },
      ),
    ).toEqual(["@bsport/sm-navigation-sidebar", "@bsport/sm-giftcard"]);
  });

  it("returns no remotes when federation has none", () => {
    expect(getRemotesToStart({}, { devPort: 4000 })).toEqual([]);
  });
});

describe("buildWatchScriptContent", () => {
  it("builds the nx watch helper script with the chosen package manager", () => {
    const script = buildWatchScriptContent("pnpm exec");

    expect(script).toContain("#!/bin/bash");
    expect(script).toContain('cd "');
    expect(script).toContain(
      "PROJECT=$(pnpm exec nx show projects --affected --files=$NX_FILE_CHANGES 2>/dev/null | head -n 1)",
    );
    expect(script).toContain('echo "Building: $PROJECT"');
    expect(script).toContain('pnpm exec nx run "$PROJECT:build"');
  });
});
