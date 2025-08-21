import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AnalyticsClient } from "#src/AnalyticsClient";
import { debugLog } from "#src/debugLog";
import { AnalyticsMessageBus } from "#src/message-bus";

describe("AnalyticsClient debug mode sync via BroadcastChannel", () => {
  let client: AnalyticsClient;
  let eventSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    eventSpy = vi.spyOn(debugLog, "track").mockImplementation(() => {});
    client = new AnalyticsClient({ internalDebug: false });
    client.configure({ env: "dev" });
  });

  afterEach(() => {
    eventSpy.mockRestore();
  });

  it("logs only when debug mode is enabled through switchAnalyticsDebug", async () => {
    // Should not log initially
    client.track({ eventType: "event_before_debug" });
    expect(eventSpy).not.toHaveBeenCalled();

    // Enable debug mode via BroadcastChannel
    AnalyticsMessageBus.send(true);

    // Give the BroadcastChannel listener a tick
    await new Promise((r) => setTimeout(r, 0));

    client.track({ eventType: "event_after_debug" });
    expect(eventSpy).toHaveBeenCalledWith({ eventType: "event_after_debug" });

    eventSpy.mockClear();

    // Disable debug mode
    AnalyticsMessageBus.send(false);
    await new Promise((r) => setTimeout(r, 0));

    client.track({ eventType: "event_after_disable" });
    expect(eventSpy).not.toHaveBeenCalled();
  });
});
