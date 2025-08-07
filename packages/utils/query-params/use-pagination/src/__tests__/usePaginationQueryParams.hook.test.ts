import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePaginationQueryParams } from "#src/usePaginationQueryParams.hook";

// Mock react-router
const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("react-router", () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

describe("usePaginationQueryParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.forEach((_, key) => mockSearchParams.delete(key));
  });

  describe("default behavior", () => {
    it("should return default values when no URL params are present", () => {
      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.currentPageSize).toBe(10);
      expect(result.current.allowedPageSizes).toEqual([10, 25, 50, 100]);
    });

    it("should return custom default values when provided", () => {
      // Set up mock to return the custom defaults
      mockSearchParams.set("page", "3");
      mockSearchParams.set("page_size", "25");

      const { result } = renderHook(() =>
        usePaginationQueryParams({
          defaultValues: { page: 3, page_size: 25 },
        }),
      );

      expect(result.current.currentPage).toBe(3);
      expect(result.current.currentPageSize).toBe(25);
    });
  });

  describe("reading from URL parameters", () => {
    it("should read valid page and page_size from URL", () => {
      mockSearchParams.set("page", "5");
      mockSearchParams.set("page_size", "50");

      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current.currentPage).toBe(5);
      expect(result.current.currentPageSize).toBe(50);
    });

    it("should handle invalid page numbers by using default", () => {
      mockSearchParams.set("page", "invalid");
      mockSearchParams.set("page_size", "25");

      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.currentPageSize).toBe(25);
    });

    it("should handle invalid page_size by using closest allowed size", () => {
      mockSearchParams.set("page", "2");
      mockSearchParams.set("page_size", "30"); // Closest to 25

      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current.currentPage).toBe(2);
      expect(result.current.currentPageSize).toBe(25);
    });

    it("should handle negative page numbers", () => {
      mockSearchParams.set("page", "-1");
      mockSearchParams.set("page_size", "10");

      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.currentPageSize).toBe(10);
    });

    it("should handle zero page number", () => {
      mockSearchParams.set("page", "0");
      mockSearchParams.set("page_size", "10");

      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.currentPageSize).toBe(10);
    });
  });

  describe("hook functions", () => {
    it("should call setSearchParams when setPage is called", () => {
      const { result } = renderHook(() => usePaginationQueryParams());

      act(() => {
        result.current.setPage(3);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), {
        replace: true,
      });
    });

    it("should call setSearchParams when setPageSize is called", () => {
      const { result } = renderHook(() => usePaginationQueryParams());

      act(() => {
        result.current.setPageSize(25);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), {
        replace: true,
      });
    });

    it("should call setSearchParams when setPageSettings is called", () => {
      const { result } = renderHook(() => usePaginationQueryParams());

      act(() => {
        result.current.setPageSettings(2, 50);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), {
        replace: true,
      });
    });
  });

  describe("shouldReplace option", () => {
    it("should use replace: false when shouldReplace is false", () => {
      const { result } = renderHook(() =>
        usePaginationQueryParams({ shouldReplace: false }),
      );

      act(() => {
        result.current.setPage(2);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), {
        replace: false,
      });
    });

    it("should use replace: true by default", () => {
      const { result } = renderHook(() => usePaginationQueryParams());

      act(() => {
        result.current.setPage(2);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), {
        replace: true,
      });
    });
  });

  describe("hook return values", () => {
    it("should return all expected properties", () => {
      const { result } = renderHook(() => usePaginationQueryParams());

      expect(result.current).toHaveProperty("currentPage");
      expect(result.current).toHaveProperty("currentPageSize");
      expect(result.current).toHaveProperty("setPage");
      expect(result.current).toHaveProperty("setPageSize");
      expect(result.current).toHaveProperty("setPageSettings");
      expect(result.current).toHaveProperty("allowedPageSizes");

      expect(typeof result.current.setPage).toBe("function");
      expect(typeof result.current.setPageSize).toBe("function");
      expect(typeof result.current.setPageSettings).toBe("function");
    });
  });
});
