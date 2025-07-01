import { act, renderHook } from "@testing-library/react";
import { Result } from "typescript-result";
import { describe, expect, it, vi } from "vitest";

import { useAsync } from "#src/index";

describe("useAsync hook", () => {
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
});
