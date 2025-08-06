import { describe, expect, it, vi } from "vitest";

import { updateSearchParams } from "#src/index";

describe("updateSearchParams", () => {
  it("should call setter with updater function and replace option", () => {
    const mockSetter = vi.fn();
    const mockUpdater = vi.fn();
    const shouldReplace = true;

    updateSearchParams({
      setter: mockSetter,
      updater: mockUpdater,
      shouldReplace,
    });

    expect(mockSetter).toHaveBeenCalledTimes(1);
    expect(mockSetter).toHaveBeenCalledWith(expect.any(Function), {
      replace: shouldReplace,
    });
  });

  it("should call setter with replace: false when shouldReplace is false", () => {
    const mockSetter = vi.fn();
    const mockUpdater = vi.fn();
    const shouldReplace = false;

    updateSearchParams({
      setter: mockSetter,
      updater: mockUpdater,
      shouldReplace,
    });

    expect(mockSetter).toHaveBeenCalledWith(expect.any(Function), {
      replace: shouldReplace,
    });
  });
});
