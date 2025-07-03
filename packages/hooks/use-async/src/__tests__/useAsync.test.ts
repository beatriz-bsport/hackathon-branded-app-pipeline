import { act, renderHook } from "@testing-library/react";
import { Result } from "typescript-result";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAsync } from "#src/index";

describe("useAsync hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("returns data when asyncFn succeeds", async () => {
    const value = { ok: true };

    const asyncFn = vi.fn(async () => Result.ok(value));

    const { result } = renderHook(() => useAsync({ asyncFn }));

    await act(() => result.current[1]());

    expect(result.current[0].data).toEqual(value);
    expect(result.current[0].error).toBeUndefined();
    expect(asyncFn).toHaveBeenCalled();
  });

  it("returns error when asyncFn fails", async () => {
    const error = new Error("fail");

    const asyncFn = vi.fn(async () => Result.error(error));

    const { result } = renderHook(() => useAsync({ asyncFn }));

    await act(() => result.current[1]());

    expect(result.current[0].error).toEqual(error);
    expect(result.current[0].data).toBeUndefined();
  });

  it("calls onSuccess when asyncFn succeeds", async () => {
    const returnedValue = { success: true };
    const asyncFn = vi.fn(async (id: number) => {
      console.log("Call asyncFn with id :", id);
      return Result.ok(returnedValue);
    });
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useAsync({
        asyncFn,
        onSuccess,
      }),
    );

    const input = 1234;
    await act(() => result.current[1](input));

    expect(onSuccess).toHaveBeenCalledWith({
      value: returnedValue,
      args: [input],
    });
  });

  it("calls onFailure when asyncFn fails", async () => {
    const sourceError = new Error("fail");
    const asyncFn = vi.fn(async (id: number) => {
      console.log("Call asyncFn with id :", id);
      return Result.error(sourceError);
    });
    const onFailure = vi.fn();

    const { result } = renderHook(() =>
      useAsync({
        asyncFn,
        onFailure,
      }),
    );

    const input = 9999;
    await act(() => result.current[1](input));

    expect(onFailure).toHaveBeenCalledWith({
      error: sourceError,
      args: [input],
    });
  });

  it("returns correct type from onSuccess and onFailure", async () => {
    const asyncFn = vi.fn(async (n: number) => Result.ok(n * 2));

    const onSuccess = ({ value }: { value: number }) => {
      return `done: ${value}` as const;
    };

    const onFailure = ({ error }: { error: Error }) => {
      return `fail: ${error.message}` as const;
    };

    const hook = renderHook(() =>
      useAsync<typeof asyncFn, string, string>({
        asyncFn,
        onSuccess,
        onFailure,
      }),
    );

    const n = 10;
    const result = await act(() => hook.result.current[1](n));
    expect(result).toBe(onSuccess({ value: n * 2 }));
  });

  describe("refetchInterval", () => {
    it("should not set interval when refetchInterval is not provided", () => {
      const asyncFn = vi.fn(async () => Result.ok("test"));
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      renderHook(() => useAsync({ asyncFn }));

      expect(setIntervalSpy).not.toHaveBeenCalled();
    });

    it("should not set interval when refetchInterval is 0", () => {
      const asyncFn = vi.fn(async () => Result.ok("test"));
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      renderHook(() => useAsync({ asyncFn, refetchInterval: 0 }));

      expect(setIntervalSpy).not.toHaveBeenCalled();
    });

    it("should set interval when refetchInterval is provided", () => {
      const asyncFn = vi.fn(async () => Result.ok("test"));
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      renderHook(() => useAsync({ asyncFn, refetchInterval: 1000 }));

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it("should call asyncFn at specified intervals", async () => {
      const asyncFn = vi.fn(async () => Result.ok("test"));

      renderHook(() => useAsync({ asyncFn, refetchInterval: 1000 }));

      expect(asyncFn).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(asyncFn).toHaveBeenCalledTimes(1);

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(asyncFn).toHaveBeenCalledTimes(2);
    });

    it("should clear interval on unmount", () => {
      const asyncFn = vi.fn(async () => Result.ok("test"));
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { unmount } = renderHook(() =>
        useAsync({ asyncFn, refetchInterval: 1000 }),
      );

      expect(clearIntervalSpy).not.toHaveBeenCalled();

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it("should clear and reset interval when refetchInterval changes", async () => {
      const asyncFn = vi.fn(async () => Result.ok("test"));
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      const { rerender } = renderHook(
        ({ interval }) => useAsync({ asyncFn, refetchInterval: interval }),
        { initialProps: { interval: 1000 } },
      );

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(clearIntervalSpy).not.toHaveBeenCalled();

      rerender({ interval: 2000 });

      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
    });

    it("should update data state when interval triggers", async () => {
      let counter = 0;
      const asyncFn = vi.fn(async () => Result.ok(`test-${++counter}`));

      const { result } = renderHook(() =>
        useAsync({ asyncFn, refetchInterval: 1000 }),
      );

      expect(result.current[0].data).toBeUndefined();

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current[0].data).toBe("test-1");

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current[0].data).toBe("test-2");
    });
  });
});
