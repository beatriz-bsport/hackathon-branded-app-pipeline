import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkHasPermission } from "#src/check-role-permissions";

const ROLE_PERMISSIONS = {
  navigationMenu: {
    simpleAllowed: true,
    simpleUnallowed: false,
    simpleUndefined: undefined,
    nestedWithSomeAllowed: {
      allowed: true,
      unallowed: false,
    },
    nestedWithAllUnallowed: {
      one: false,
      two: false,
    },
    deeplyNested: {
      nestedEvenMore: {
        allowed: true,
      },
      unallowed: false,
    },
  },
  restrictedPaths: ["a list of string"],
};

type Permissions = Omit<typeof ROLE_PERMISSIONS, "restrictedPaths">;

describe("checkHasPermission", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false if path is not provided", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
    });

    expect(result).toBe(false);
  });

  it("returns false if permissions are not provided", () => {
    const result = checkHasPermission<Permissions>({
      path: "navigationMenu.simpleAllowed",
    });

    expect(result).toBe(false);
  });

  it("returns true if path matches an allowed permission", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      path: "navigationMenu.simpleAllowed",
    });

    expect(result).toBe(true);
  });

  it("returns false if path matches an unallowed permission", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      path: "navigationMenu.simpleUnallowed",
    });

    expect(result).toBe(false);
  });

  it("returns false if path matches an undefined permission", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      path: "navigationMenu.simpleUndefined",
    });

    expect(result).toBe(false);
  });

  it("returns true if path matches a parent with an allowed direct child", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      path: "navigationMenu.nestedWithSomeAllowed",
    });
    expect(result).toBe(true);
  });

  it("returns false if path matches a parent with all descendant unallowed", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      path: "navigationMenu.nestedWithAllUnallowed",
    });

    expect(result).toBe(false);
  });

  it("returns true if path matches a parent with any allowed descendant", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      path: "navigationMenu.deeplyNested",
    });

    expect(result).toBe(true);
  });

  it("returns false if path does not exist (ts error normally)", () => {
    const result = checkHasPermission<Permissions>({
      permissions: ROLE_PERMISSIONS,
      // @ts-expect-error Path does not exist !
      path: "navigationMenu.wrongPath",
    });

    expect(result).toBe(false);
  });
});
