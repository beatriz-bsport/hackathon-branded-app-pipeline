import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeaturePermission } from "#src/check-feature-permissions";
import * as getEnvModule from "#src/get-environment";

function mockGetEnvironment(env?: string) {
  vi.spyOn(getEnvModule, "getEnvironment").mockReturnValue({
    ...getEnvModule.DEFAULT_ENVS_MAP,
    ...(env ? { [env]: true } : {}),
  });
}

describe("checkFeaturePermission", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true if feature is enabled via environment override", () => {
    mockGetEnvironment("staging");

    const result = checkFeaturePermission({
      features: [],
      identifier: 123,
      enableInEnvMode: ["staging"],
    });

    expect(result).toBe(true);
  });

  it("returns false if no features and no env override", () => {
    mockGetEnvironment();

    const result = checkFeaturePermission({
      features: undefined,
      identifier: 123,
    });

    expect(result).toBe(false);
  });

  it("returns false if identifier is missing", () => {
    mockGetEnvironment();

    const result = checkFeaturePermission({
      features: [{ readable_identifier: "feature-a", upsell_identifier: 123 }],
      identifier: undefined,
    });

    expect(result).toBe(false);
  });

  it("returns false if features list is empty", () => {
    mockGetEnvironment();

    const result = checkFeaturePermission({
      features: [],
      identifier: 123,
    });

    expect(result).toBe(false);
  });

  it("returns true if identifier is found in features", () => {
    mockGetEnvironment();

    const result = checkFeaturePermission({
      features: [
        { readable_identifier: "feature-a", upsell_identifier: 123 },
        { readable_identifier: "feature-b", upsell_identifier: 456 },
      ],
      identifier: 123,
    });

    expect(result).toBe(true);
  });

  it("returns false if identifier is not found in features", () => {
    mockGetEnvironment();

    const result = checkFeaturePermission({
      features: [
        { readable_identifier: "feature-a", upsell_identifier: 111 },
        { readable_identifier: "feature-b", upsell_identifier: 222 },
      ],
      identifier: 999,
    });

    expect(result).toBe(false);
  });
});
