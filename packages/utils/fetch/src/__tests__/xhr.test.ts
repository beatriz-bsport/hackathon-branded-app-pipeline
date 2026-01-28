import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HTTPException } from "@bsport/http-exception";

import { MAP_ENV_TO_API_URL } from "#src/uri-management";
import { BACKGROUND_TASK_UUID_HEADER } from "#src/utils";

import { getXhr } from "../xhr";
import { server } from "./setup";

// Mock external dependencies
vi.mock("@bsport/local-storage-auth-token", () => ({
  getAuthToken: vi.fn(() => "test-token"),
}));

vi.mock("@bsport/sentry", () => ({
  getSessionId: vi.fn(() => "test-session-id"),
  getTransactionId: vi.fn(() => "test-transaction-id"),
}));

vi.mock("@bsport/timezone-utils", () => ({
  getCompanyTimezone: vi.fn(() => "Europe/Paris"),
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: { href: "https://backoffice.dev.bsport.io/dashboard" },
  writable: true,
});

describe("getXhr", () => {
  const xhrFn = getXhr();
  const baseUrl = MAP_ENV_TO_API_URL.dev;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful requests", () => {
    it("should make a successful GET request", async () => {
      const mockData = { id: 1, name: "test" };
      server.use(
        http.get(`${baseUrl}/platform/v1/users`, () => {
          return HttpResponse.json(mockData, { status: 200 });
        }),
      );

      const result = await xhrFn("platform/v1/users", {});

      expect(result).toEqual({
        data: mockData,
        status: 200,
        backgroundTaskUuid: null,
      });
    });

    it("should include background task UUID when present", async () => {
      const taskUuid = "task-uuid-123";
      server.use(
        http.get(`${baseUrl}/platform/v1/task`, () => {
          return HttpResponse.json(
            { success: true },
            {
              status: 200,
              headers: {
                [BACKGROUND_TASK_UUID_HEADER]: taskUuid,
              },
            },
          );
        }),
      );

      const result = await xhrFn("platform/v1/task", {});

      expect(result.backgroundTaskUuid).toBe(taskUuid);
    });

    it("should handle empty response", async () => {
      server.use(
        http.delete(`${baseUrl}/platform/v1/delete`, () => {
          return HttpResponse.json({}, { status: 200 });
        }),
      );

      const result = await xhrFn("platform/v1/delete", { method: "DELETE" });

      expect(result).toEqual({
        data: {},
        status: 200,
        backgroundTaskUuid: null,
      });
    });

    it("should set custom headers", async () => {
      let capturedHeaders: Headers | undefined;

      server.use(
        http.post(`${baseUrl}/platform/v1/custom`, ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ success: true });
        }),
      );

      const customHeaders = {
        "X-Custom-Header": "custom-value",
        "Content-Type": "multipart/form-data",
      };

      await xhrFn("platform/v1/custom", {
        headers: customHeaders,
        method: "POST",
      });

      expect(capturedHeaders?.get("X-Custom-Header")).toBe("custom-value");
      expect(capturedHeaders?.get("Content-Type")).toBe("multipart/form-data");
      expect(capturedHeaders?.get("Authorization")).toBe("Token test-token");
    });
  });

  describe("error handling", () => {
    it("should throw HTTPException for 400 error with valid JSON", async () => {
      const errorResponse = {
        error_code: 1001,
        message: "Validation failed",
        statusCode: 400,
      };

      server.use(
        http.post(`${baseUrl}/platform/v1/error`, () => {
          return HttpResponse.json(errorResponse, { status: 400 });
        }),
      );

      await expect(
        xhrFn("platform/v1/error", { method: "POST" }),
      ).rejects.toThrow(HTTPException);

      try {
        await xhrFn("platform/v1/error", { method: "POST" });
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.path).toBe("platform/v1/error");
        expect(httpError.statusCode).toBe(400);
        expect(httpError.customErrorCodes).toEqual([1001]);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/error) because: [1001] Validation failed",
        );
      }
    });

    it("should throw HTTPException for error with malformed JSON", async () => {
      server.use(
        http.post(`${baseUrl}/platform/v1/malformed`, () => {
          return new Response("invalid json{", {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }),
      );

      try {
        await xhrFn("platform/v1/malformed", { method: "POST" });
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.path).toBe("platform/v1/malformed");
        expect(httpError.statusCode).toBe(400);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/malformed) because: [UNKNOWN] Failed request with invalid JSON",
        );
      }
    });

    it("should throw HTTPException for JSON parsing error on success response", async () => {
      server.use(
        http.get(`${baseUrl}/platform/v1/bad-success`, () => {
          return new Response("invalid json{", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }),
      );

      try {
        await xhrFn("platform/v1/bad-success", {});
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.path).toBe("platform/v1/bad-success");
        expect(httpError.statusCode).toBe(200);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/bad-success) because: [UNKNOWN] Failed to parse JSON response",
        );
      }
    });

    it("should handle network errors", async () => {
      server.use(
        http.get(`${baseUrl}/platform/v1/network-error`, () => {
          return HttpResponse.error();
        }),
      );

      await expect(xhrFn("platform/v1/network-error", {})).rejects.toThrow();
    });
  });

  describe("abort signal handling", () => {
    it("should abort request when signal is aborted", async () => {
      const abortController = new AbortController();

      server.use(
        http.get(`${baseUrl}/platform/v1/abort-test`, () => {
          // Delay the response so we can abort it
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(HttpResponse.json({ success: true }));
            }, 100);
          });
        }),
      );

      const promise = xhrFn("platform/v1/abort-test", {
        signal: abortController.signal,
      });

      // Abort the request immediately
      abortController.abort();

      await expect(promise).rejects.toThrow("Request aborted by the user.");
    });

    it("should clean up abort listener on request completion", async () => {
      const abortController = new AbortController();
      const removeEventListenerSpy = vi.spyOn(
        abortController.signal,
        "removeEventListener",
      );

      server.use(
        http.get(`${baseUrl}/platform/v1/cleanup-test`, () => {
          return HttpResponse.json({ success: true });
        }),
      );

      const result = await xhrFn("platform/v1/cleanup-test", {
        signal: abortController.signal,
      });

      expect(result.data).toEqual({ success: true });
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "abort",
        expect.any(Function),
      );
    });

    it("should work without abort signal", async () => {
      server.use(
        http.get(`${baseUrl}/platform/v1/no-signal`, () => {
          return HttpResponse.json({ success: true });
        }),
      );

      const result = await xhrFn("platform/v1/no-signal", {});

      expect(result.data).toEqual({ success: true });
    });
  });

  describe("method handling", () => {
    it("should default to GET method", async () => {
      let capturedMethod: string | undefined;

      server.use(
        http.get(`${baseUrl}/platform/v1/default-method`, ({ request }) => {
          capturedMethod = request.method;
          return HttpResponse.json({ success: true });
        }),
      );

      await xhrFn("platform/v1/default-method", {});

      expect(capturedMethod).toBe("GET");
    });

    it("should use specified method", async () => {
      let capturedMethod: string | undefined;

      server.use(
        http.post(`${baseUrl}/platform/v1/post-method`, ({ request }) => {
          capturedMethod = request.method;
          return HttpResponse.json({ created: true });
        }),
      );

      await xhrFn("platform/v1/post-method", {
        method: "POST",
      });

      expect(capturedMethod).toBe("POST");
    });
  });
});
