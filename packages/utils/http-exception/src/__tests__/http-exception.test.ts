import { describe, expect, it } from "vitest";

import type { Serializable } from "#src/constants";
import {
  DEFAULT_CUSTOM_ERROR_CODES,
  DEFAULT_MESSAGE,
  DEFAULT_NAME,
  DEFAULT_STATUS_CODE,
} from "#src/constants";
import { HTTPException } from "#src/index";

describe("HTTPException", () => {
  describe("constructor", () => {
    it("should create an instance with default values", () => {
      const exception = new HTTPException({ path: "/api/test" });

      expect(exception).toBeInstanceOf(HTTPException);
      expect(exception).toBeInstanceOf(Error);
      expect(exception.path).toBe("/api/test");
      expect(exception.name).toBe(DEFAULT_NAME);
      expect(exception.message).toContain(DEFAULT_MESSAGE);
      expect(exception.statusCode).toBe(DEFAULT_STATUS_CODE);
      expect(exception.type).toBe("ClientError");
      expect(exception.context).toBe("");
      expect(exception.customErrorCodes).toEqual(DEFAULT_CUSTOM_ERROR_CODES);
    });

    it("should create an instance with custom values", () => {
      const customContext: Serializable = { userId: 123, action: "delete" };
      const customErrorCodes = [4001, 4002];

      const exception = new HTTPException({
        path: "/api/users",
        name: "UserNotFound",
        message: "User not found in database",
        statusCode: 404,
        context: customContext,
        customErrorCodes,
      });

      expect(exception.path).toBe("/api/users");
      expect(exception.name).toBe("UserNotFound");
      expect(exception.message).toContain("UserNotFound");
      expect(exception.message).toContain("User not found in database");
      expect(exception.statusCode).toBe(404);
      expect(exception.type).toBe("ClientError");
      expect(exception.context).toEqual(customContext);
      expect(exception.customErrorCodes).toEqual(customErrorCodes);
    });

    it("should include path in error message", () => {
      const exception = new HTTPException({ path: "/api/users/123" });
      expect(exception.message).toContain("/api/users/123");
    });

    it("should handle cause parameter", () => {
      const cause = new Error("Original error");
      const exception = new HTTPException({
        path: "/api/test",
        cause,
      });

      expect(exception.cause).toBe(cause);
    });
  });

  describe("type property", () => {
    it("should be ClientError for 4xx status codes", () => {
      const exception400 = new HTTPException({
        path: "/api/test",
        statusCode: 400,
      });
      expect(exception400.type).toBe("ClientError");

      const exception499 = new HTTPException({
        path: "/api/test",
        statusCode: 499,
      });
      expect(exception499.type).toBe("ClientError");
    });

    it("should be ServerError for 5xx status codes", () => {
      const exception500 = new HTTPException({
        path: "/api/test",
        statusCode: 500,
      });
      expect(exception500.type).toBe("ServerError");

      const exception599 = new HTTPException({
        path: "/api/test",
        statusCode: 599,
      });
      expect(exception599.type).toBe("ServerError");
    });

    it("should be Unknown for other status codes", () => {
      const exception200 = new HTTPException({
        path: "/api/test",
        statusCode: 200,
      });
      expect(exception200.type).toBe("Unknown");

      const exception399 = new HTTPException({
        path: "/api/test",
        statusCode: 399,
      });
      expect(exception399.type).toBe("Unknown");
    });
  });

  describe("name property", () => {
    it("should use provided string name", () => {
      const exception = new HTTPException({
        path: "/api/test",
        name: "CustomError",
      });

      expect(exception.name).toBe("CustomError");
    });

    it("should stringify object names", () => {
      const nameObject: Serializable = {
        error: "VALIDATION_ERROR",
        field: "email",
      };
      const exception = new HTTPException({
        path: "/api/test",
        name: nameObject,
      });

      expect(exception.name).toBe(JSON.stringify(nameObject));
    });

    it("should use default name for falsy values", () => {
      const exception1 = new HTTPException({
        path: "/api/test",
        name: "",
      });
      expect(exception1.name).toBe(DEFAULT_NAME);

      const exception2 = new HTTPException({
        path: "/api/test",
        name: null,
      });
      expect(exception2.name).toBe(DEFAULT_NAME);

      const exception3 = new HTTPException({
        path: "/api/test",
        name: undefined,
      });
      expect(exception3.name).toBe(DEFAULT_NAME);
    });
  });
});
