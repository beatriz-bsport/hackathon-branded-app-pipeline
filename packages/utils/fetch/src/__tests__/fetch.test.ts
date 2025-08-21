import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HTTPException } from "@bsport/http-exception";

import { getFetch } from "../fetch";
import { server } from "./setup";

// Mock external dependencies
vi.mock("@bsport/local-storage-auth-token", () => ({
  getAuthToken: vi.fn(() => "test-token"),
}));

vi.mock("@bsport/request-from-header", () => ({
  getBsportRequestFrom: vi.fn(() => "backoffice"),
}));

vi.mock("@bsport/sentry", () => ({
  getSessionId: vi.fn(() => "test-session-id"),
  getTransactionId: vi.fn(() => "test-transaction-id"),
}));

vi.mock("@bsport/timezone-utils", () => ({
  getTimezoneName: vi.fn(() => "Europe/Paris"),
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: { href: "https://app.bsport.io/dashboard" },
  writable: true,
});

describe("getFetch", () => {
  const fetchFn = getFetch();
  const baseUrl = "https://api.dev.bsport.io";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful responses", () => {
    it("should make a successful GET request with json response", async () => {
      const mockData = { id: 1, name: "test" };
      server.use(
        http.get(`${baseUrl}/platform/v1/users`, () => {
          return HttpResponse.json(mockData, { status: 200 });
        }),
      );

      const result = await fetchFn("platform/v1/users");

      expect(result).toEqual({
        data: mockData,
        status: 200,
        backgroundTaskUuid: null,
      });
    });

    it("should make a successful POST request with json response", async () => {
      const mockData = { id: 1, created: true };
      server.use(
        http.post(`${baseUrl}/platform/v1/users`, () => {
          return HttpResponse.json(mockData, { status: 201 });
        }),
      );

      const result = await fetchFn("platform/v1/users", {
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      });

      expect(result).toEqual({
        data: mockData,
        status: 201,
        backgroundTaskUuid: null,
      });
    });

    it("should handle text response type", async () => {
      const mockText = "plain text response";
      server.use(
        http.get(`${baseUrl}/platform/v1/text`, () => {
          return new Response(mockText, {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          });
        }),
      );

      const result = await fetchFn("platform/v1/text", {
        responseType: "text",
      });

      expect(result).toEqual({
        data: mockText,
        status: 200,
        backgroundTaskUuid: null,
      });
    });

    it("should handle buffer response type", async () => {
      const mockBuffer = new ArrayBuffer(8);
      server.use(
        http.get(`${baseUrl}/platform/v1/buffer`, () => {
          return new Response(mockBuffer, {
            status: 200,
            headers: { "Content-Type": "application/octet-stream" },
          });
        }),
      );

      const result = await fetchFn("platform/v1/buffer", {
        responseType: "buffer",
      });

      expect(result.data).toBeInstanceOf(ArrayBuffer);
      expect(result.status).toBe(200);
      expect(result.backgroundTaskUuid).toBe(null);
    });

    it("should include background task UUID when present in response headers", async () => {
      const mockData = { id: 1 };
      const taskUuid = "task-uuid-123";

      server.use(
        http.get(`${baseUrl}/platform/v1/users`, () => {
          return HttpResponse.json(mockData, {
            status: 200,
            headers: {
              "x-background-task-uuid": taskUuid,
            },
          });
        }),
      );

      const result = await fetchFn("platform/v1/users");

      expect(result.backgroundTaskUuid).toBe(taskUuid);
    });

    it("should handle malformed JSON responses gracefully", async () => {
      server.use(
        http.get(`${baseUrl}/platform/v1/malformed`, () => {
          return new Response("invalid json{", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }),
      );

      const result = await fetchFn("platform/v1/malformed");

      expect(result).toEqual({
        data: null,
        status: 200,
        backgroundTaskUuid: null,
      });
    });
  });

  describe("error responses", () => {
    it("should throw HTTPException for 400 error with error_code", async () => {
      const errorResponse = {
        error_code: 1001,
        message: "Validation failed",
        statusCode: 400,
      };

      server.use(
        http.get(`${baseUrl}/platform/v1/error`, () => {
          return HttpResponse.json(errorResponse, { status: 400 });
        }),
      );

      await expect(fetchFn("platform/v1/error")).rejects.toThrow(HTTPException);

      try {
        await fetchFn("platform/v1/error");
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.path).toBe("platform/v1/error");
        expect(httpError.name).toBe("1001");
        expect(httpError.statusCode).toBe(400);
        expect(httpError.customErrorCodes).toEqual([1001]);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/error) because: [1001] Validation failed",
        );
      }
    });

    it("should throw HTTPException for error with errors_arrays", async () => {
      const errorResponse = {
        errors_arrays: [
          { error_code: 1001, error_message: "First error" },
          { error_code: 1002, error_message: "Second error" },
        ],
      };

      server.use(
        http.get(`${baseUrl}/platform/v1/errors`, () => {
          return HttpResponse.json(errorResponse, { status: 422 });
        }),
      );

      try {
        await fetchFn("platform/v1/errors");
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.customErrorCodes).toEqual([1001, 1002]);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/errors) because: [1001;1002] First error;Second error",
        );
        expect(httpError.name).toBe("1001;1002");
      }
    });

    it("should throw HTTPException for 500 error with code field", async () => {
      const errorResponse = {
        code: "INTERNAL_ERROR",
        error_message: "Internal server error",
      };

      server.use(
        http.get(`${baseUrl}/platform/v1/server-error`, () => {
          return HttpResponse.json(errorResponse, { status: 500 });
        }),
      );

      try {
        await fetchFn("platform/v1/server-error");
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.name).toBe("INTERNAL_ERROR");
        expect(httpError.statusCode).toBe(500);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/server-error) because: [INTERNAL_ERROR] Internal server error",
        );
      }
    });

    it("should handle error responses with malformed JSON", async () => {
      server.use(
        http.get(`${baseUrl}/platform/v1/malformed-error`, () => {
          return new Response("invalid json{", {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }),
      );

      try {
        await fetchFn("platform/v1/malformed-error");
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.statusCode).toBe(400);
        expect(httpError.message).toBe(
          "Error calling backend (path: platform/v1/malformed-error) because: [UNKNOWN] ",
        );
        expect(httpError.customErrorCodes).toEqual([]);
      }
    });

    it("should use response status when statusCode is not in payload", async () => {
      const errorResponse = {
        message: "Not found",
      };

      server.use(
        http.get(`${baseUrl}/platform/v1/not-found`, () => {
          return HttpResponse.json(errorResponse, { status: 404 });
        }),
      );

      try {
        await fetchFn("platform/v1/not-found");
      } catch (error) {
        const httpError = error as HTTPException;
        expect(httpError.statusCode).toBe(404);
      }
    });
  });

  describe("request configuration", () => {
    it("should include default headers", async () => {
      let capturedRequest: Request | undefined;

      server.use(
        http.get(`${baseUrl}/platform/v1/headers`, ({ request }) => {
          capturedRequest = request;
          return HttpResponse.json({ success: true });
        }),
      );

      await fetchFn("platform/v1/headers");

      expect(capturedRequest?.headers.get("Content-Type")).toBe(
        "application/json",
      );
      expect(capturedRequest?.headers.get("Accept")).toBe("application/json");
      expect(capturedRequest?.headers.get("Authorization")).toBe(
        "Token test-token",
      );
      expect(capturedRequest?.headers.get("X-Session-ID")).toBe(
        "test-session-id",
      );
      expect(capturedRequest?.headers.get("X-Transaction-ID")).toBe(
        "test-transaction-id",
      );
      expect(capturedRequest?.headers.get("X-Timezone-Name")).toBe(
        "Europe/Paris",
      );
      expect(capturedRequest?.headers.get("X-bsport-request-from")).toBe(
        "backoffice",
      );
    });

    it("should merge custom headers with defaults", async () => {
      let capturedRequest: Request | undefined;

      server.use(
        http.post(`${baseUrl}/platform/v1/custom-headers`, ({ request }) => {
          capturedRequest = request;
          return HttpResponse.json({ success: true });
        }),
      );

      await fetchFn("platform/v1/custom-headers", {
        method: "POST",
        headers: {
          "X-Custom-Header": "custom-value",
          "Content-Type": "multipart/form-data",
        },
      });

      expect(capturedRequest?.headers.get("X-Custom-Header")).toBe(
        "custom-value",
      );
      expect(capturedRequest?.headers.get("Content-Type")).toBe(
        "multipart/form-data",
      );
      expect(capturedRequest?.headers.get("Authorization")).toBe(
        "Token test-token",
      );
      expect(capturedRequest?.headers.get("X-bsport-request-from")).toBe(
        "backoffice",
      );
    });

    it("should pass through other RequestInit options", async () => {
      let capturedRequest: Request | undefined;

      server.use(
        http.post(`${baseUrl}/platform/v1/options`, ({ request }) => {
          capturedRequest = request;
          return HttpResponse.json({ success: true });
        }),
      );

      const body = JSON.stringify({ data: "test" });
      await fetchFn("platform/v1/options", {
        method: "POST",
        body,
        credentials: "include",
      });

      expect(capturedRequest?.method).toBe("POST");
      expect(await capturedRequest?.text()).toBe(body);
      expect(capturedRequest?.credentials).toBe("include");
    });
  });

  describe("response type handling", () => {
    it("should default to json response type", async () => {
      const mockData = { default: "json" };
      server.use(
        http.get(`${baseUrl}/platform/v1/default`, () => {
          return HttpResponse.json(mockData, { status: 200 });
        }),
      );

      const result = await fetchFn("platform/v1/default");

      expect(result.data).toEqual(mockData);
    });

    it("should handle empty response bodies", async () => {
      server.use(
        http.delete(`${baseUrl}/platform/v1/empty`, () => {
          return new Response(null, { status: 204 });
        }),
      );

      const result = await fetchFn("platform/v1/empty", {
        method: "DELETE",
      });

      expect(result).toEqual({
        data: null,
        status: 204,
        backgroundTaskUuid: null,
      });
    });
  });
});
