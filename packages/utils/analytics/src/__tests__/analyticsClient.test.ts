import { beforeEach, describe, expect, it, vi } from "vitest";

import { AnalyticsClient } from "#src/AnalyticsClient";
import type { AnalyticsAdapter, AnalyticsEvent, Properties } from "#src/types";

describe("AnalyticsClient", () => {
  let mockAdapter: AnalyticsAdapter;
  let client: AnalyticsClient;

  beforeEach(() => {
    mockAdapter = {
      configure: vi.fn(),
      track: vi.fn(),
      identify: vi.fn(),
      resetIdentity: vi.fn(),
      flush: vi.fn(),
      overloadAddSuperProperties: vi.fn(),
      overloadRemoveSuperProperties: vi.fn(),
      overloadResetSuperProperties: vi.fn(),
    };
    client = new AnalyticsClient({
      adapter: mockAdapter,
      internalDebug: false,
    });
  });

  it("calls adapter.configure with provided config", () => {
    const config = { token: "abc" };

    client.configure(config);

    expect(mockAdapter.configure).toHaveBeenCalledWith(config);
  });

  it("adds super properties and merges them with event properties", () => {
    client.addSuperProperties({ app: "testApp" });
    const event: AnalyticsEvent = { eventType: "TEST_EVENT", foo: "bar" };

    client.track(event);

    expect(mockAdapter.track).toHaveBeenCalledWith({
      app: "testApp",
      eventType: "TEST_EVENT",
      foo: "bar",
    });
  });

  it("removes specific super properties", () => {
    client.addSuperProperties({
      keep: "yes",
      remove: "no",
      removeOther: "why-not",
    });

    client.removeSuperProperties(["remove", "removeOther"]);
    client.track({ eventType: "E" });

    expect(mockAdapter.track).toHaveBeenCalledWith({
      keep: "yes",
      eventType: "E",
    });
  });

  it("resets all super properties", () => {
    client.addSuperProperties({ foo: "bar", foo2: "bar2" });

    client.resetSuperProperties();
    client.track({ eventType: "E" });

    expect(mockAdapter.track).toHaveBeenCalledWith({ eventType: "E" });
  });

  it("forwards identify, resetIdentity, flush to adapter", () => {
    const traits: Properties = { role: "admin" };

    client.identify({ userId: "u1", traits });

    expect(mockAdapter.identify).toHaveBeenCalledWith({ userId: "u1", traits });

    client.resetIdentity();

    expect(mockAdapter.resetIdentity).toHaveBeenCalled();

    client.flush();

    expect(mockAdapter.flush).toHaveBeenCalled();
  });

  it("handles undefined overload methods gracefully", () => {
    delete mockAdapter.overloadAddSuperProperties;

    expect(() =>
      client.overloadAddSuperProperties({ foo: "bar" }),
    ).not.toThrow();
  });

  it("logs messages only when debug mode is enabled", () => {
    const client = new AnalyticsClient({
      adapter: mockAdapter,
      internalDebug: false,
    });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Debug disabled
    client.track({ eventType: "test_event" });
    expect(logSpy).not.toHaveBeenCalled();

    // Enable debug mode
    client.setInternalDebugMode(true);
    client.track({ eventType: "test_event" });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Analytics] Tracked event: "),
      expect.any(String),
    );

    // Error logging example
    mockAdapter.configure = () => {
      throw new Error("boom");
    };
    client.configure({ token: "123" });
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Analytics] Configuration failed: "),
      expect.any(Object),
    );

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
