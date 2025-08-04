import { describe, expect, it } from "vitest";

import { buildUrlParams } from "../buildUrlParams";

describe("buildUrlParams", () => {
  it("should return empty string for null or undefined params", () => {
    // @ts-expect-error null is not allowed
    expect(buildUrlParams(null)).toBe("");
    // @ts-expect-error undefined is not allowed
    expect(buildUrlParams(undefined)).toBe("");
  });

  it("should return empty string for empty object", () => {
    expect(buildUrlParams({})).toBe("?");
  });

  it("should build URL params from object with string values", () => {
    const params = {
      name: "john",
      city: "paris",
    };
    expect(buildUrlParams(params)).toBe("?name=john&city=paris");
  });

  it("should build URL params from object with number values", () => {
    const params = {
      age: 25,
      count: 0,
      negative: -5,
    };
    expect(buildUrlParams(params)).toBe("?age=25&count=0&negative=-5");
  });

  it("should build URL params from object with boolean values", () => {
    const params = {
      active: true,
      disabled: false,
    };
    expect(buildUrlParams(params)).toBe("?active=true&disabled=false");
  });

  it("should build URL params from object with mixed value types", () => {
    const params = {
      name: "john",
      age: 25,
      active: true,
      score: 0,
      verified: false,
    };
    expect(buildUrlParams(params)).toBe(
      "?name=john&age=25&active=true&score=0&verified=false",
    );
  });

  it("should URL encode special characters", () => {
    const params = {
      query: "hello world",
      email: "test@example.com",
      special: "a+b&c=d",
    };
    const result = buildUrlParams(params);
    expect(result).toContain("query=hello+world");
    expect(result).toContain("email=test%40example.com");
    expect(result).toContain("special=a%2Bb%26c%3Dd");
  });

  it("should handle empty string values", () => {
    const params = {
      empty: "",
      name: "john",
    };
    expect(buildUrlParams(params)).toBe("?empty=&name=john");
  });

  it("should maintain parameter order (object key order)", () => {
    const params = {
      z: "last",
      a: "first",
      m: "middle",
    };
    const result = buildUrlParams(params);
    expect(result).toBe("?z=last&a=first&m=middle");
  });
});
