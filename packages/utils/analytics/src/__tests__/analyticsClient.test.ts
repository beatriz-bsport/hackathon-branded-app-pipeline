import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { AnalyticsClient } from "#src/AnalyticsClient";
import type {
  AnalyticsAdapter,
  AnalyticsEvent,
  EventError,
  EventResult,
  Properties,
} from "#src/types";

// ---------------------------------------------------------------------------
// Helpers shared by the trackEvent describe block
// ---------------------------------------------------------------------------

function makeZodError() {
  const result = z.object({ name: z.string() }).safeParse({});
  return (result as z.SafeParseError<unknown>).error;
}

function makeValidBuilder<T extends { eventType: string }>(event: T) {
  return vi.fn(
    (_data: unknown): EventResult<T> => ({
      event,
      errors: null,
    }),
  );
}

function makeInvalidBuilder<T extends { eventType: string }>(event: T) {
  const errors: EventError = {
    eventType: event.eventType,
    zodError: makeZodError(),
  };
  return vi.fn((_data: unknown): EventResult<T> => ({ event, errors }));
}

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
      optInTracking: vi.fn(),
      optOutTracking: vi.fn(),
      overloadAddSuperProperties: vi.fn(),
      overloadRemoveSuperProperties: vi.fn(),
      overloadResetSuperProperties: vi.fn(),
      overloadSetDebugMode: vi.fn(),
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

  it("forwards optInTracking and optOutTracking to adapter", () => {
    const optInOptions = {
      enable_persistence: true,
      track_event_name: "opt-in-tracking",
    } as const;

    client.optInTracking(optInOptions);

    expect(mockAdapter.optInTracking).toHaveBeenCalledWith(optInOptions);

    const optOutOptions = {
      clear_persistence: true,
      persistence_type: "localStorage",
    } as const;

    client.optOutTracking(optOutOptions);

    expect(mockAdapter.optOutTracking).toHaveBeenCalledWith(optOutOptions);
  });

  it("forwards overload methods to adapter", () => {
    const properties = { foo: "bar", role: "admin" };

    client.overloadAddSuperProperties(properties);

    expect(mockAdapter.overloadAddSuperProperties).toHaveBeenCalledWith(
      properties,
    );

    client.overloadRemoveSuperProperties(["foo"]);

    expect(mockAdapter.overloadRemoveSuperProperties).toHaveBeenCalledWith([
      "foo",
    ]);

    client.overloadResetSuperProperties();

    expect(mockAdapter.overloadResetSuperProperties).toHaveBeenCalled();

    client.overloadSetDebugMode(true);

    expect(mockAdapter.overloadSetDebugMode).toHaveBeenCalledWith(true);
  });

  it("handles undefined overload methods gracefully", () => {
    delete mockAdapter.overloadAddSuperProperties;

    expect(() =>
      client.overloadAddSuperProperties({ foo: "bar" }),
    ).not.toThrow();
  });

  it("does not log tracked events when opt-out of tracking", () => {
    client.setInternalDebugMode(true);

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    client.track({ eventType: "test_event" });
    expect(logSpy).toHaveBeenCalled();

    client.optOutTracking();

    logSpy.mockClear();

    client.track({ eventType: "test_event" });
    expect(logSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
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

  it("modifies isTracking state even when adapter opt methods are undefined", () => {
    delete mockAdapter.optInTracking;
    delete mockAdapter.optOutTracking;

    expect(client.getIsTracking()).toBe(true);

    client.optOutTracking();
    expect(client.getIsTracking()).toBe(false);

    client.optInTracking();
    expect(client.getIsTracking()).toBe(true);
  });

  it("modifies isTracking state when adapter opt methods are available", () => {
    expect(client.getIsTracking()).toBe(true);

    const optOutOptions = {
      clear_persistence: true,
      persistence_type: "localStorage",
    } as const;
    client.optOutTracking(optOutOptions);
    expect(client.getIsTracking()).toBe(false);
    expect(mockAdapter.optOutTracking).toHaveBeenCalledWith(optOutOptions);

    client.optInTracking();
    expect(client.getIsTracking()).toBe(true);
    expect(mockAdapter.optInTracking).toHaveBeenCalledWith(undefined);
  });

  describe("trackEvent", () => {
    const validEvent = { eventType: "button_clicked", kind: "primary" };
    const invalidEvent = { eventType: "button_clicked", kind: "primary" };

    let onValidationError: ReturnType<typeof vi.fn>;
    let clientWithReporter: AnalyticsClient;

    beforeEach(() => {
      onValidationError = vi.fn();
      clientWithReporter = new AnalyticsClient({
        adapter: mockAdapter,
        onValidationError,
      });
    });

    it("tracks the event when there are no validation errors", () => {
      const builder = makeValidBuilder(validEvent);

      client.trackEvent(builder({ kind: "primary" }));

      expect(mockAdapter.track).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: "button_clicked" }),
      );
    });

    it("forwards the raw input data to the event builder", () => {
      const builder = makeValidBuilder(validEvent);
      const data = { kind: "primary" };

      client.trackEvent(builder(data));

      expect(builder).toHaveBeenCalledWith(data);
    });

    it("does not call onValidationError when there are no errors", () => {
      const builder = makeValidBuilder(validEvent);

      clientWithReporter.trackEvent(builder({}));

      expect(onValidationError).not.toHaveBeenCalled();
    });

    it("ignores dropInvalidEvents flag when validation succeeds", () => {
      const builder = makeValidBuilder(validEvent);

      client.trackEvent(builder({ kind: "primary" }), true);

      expect(mockAdapter.track).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: "button_clicked" }),
      );
    });

    it("tracks the best-effort event when errors are present and dropInvalidEvents is false (default)", () => {
      const builder = makeInvalidBuilder(invalidEvent);

      client.trackEvent(builder({}));

      expect(mockAdapter.track).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: "button_clicked" }),
      );
    });

    it("calls onValidationError with the errors when validation fails", () => {
      const builder = makeInvalidBuilder(invalidEvent);
      clientWithReporter.trackEvent(builder({}));

      expect(onValidationError).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: "button_clicked",
          zodError: expect.any(Object),
        }),
      );
    });

    it("does not track when errors are present and dropInvalidEvents is true", () => {
      const builder = makeInvalidBuilder(invalidEvent);

      client.trackEvent(builder({}), true);

      expect(mockAdapter.track).not.toHaveBeenCalled();
    });

    it("still calls onValidationError when dropInvalidEvents is true", () => {
      const builder = makeInvalidBuilder(invalidEvent);

      clientWithReporter.trackEvent(builder({}), true);

      expect(onValidationError).toHaveBeenCalledOnce();
    });

    it("does not throw when errors are present and no onValidationError is provided", () => {
      const builder = makeInvalidBuilder(invalidEvent);

      expect(() => client.trackEvent(builder({}))).not.toThrow();
    });

    it("merges super properties into the tracked safe event", () => {
      client.addSuperProperties({ app: "testApp" });
      const builder = makeValidBuilder(validEvent);

      client.trackEvent(builder({}));

      expect(mockAdapter.track).toHaveBeenCalledWith(
        expect.objectContaining({
          app: "testApp",
          eventType: "button_clicked",
        }),
      );
    });
  });
});
