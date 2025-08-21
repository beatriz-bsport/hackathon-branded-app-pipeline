import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { MixpanelAdapter } from "#src/MixpanelAdapter";

import { server } from "./msw-setup";

const BASE_CONFIG = { token: "test-token", env: "dev" } as const;

beforeAll(() => server.listen());

describe("MixpanelAdapter", () => {
  let adapter: MixpanelAdapter;
  let instanceName: string;

  beforeEach(() => {
    const uniqueName = `test_instance_${crypto.randomUUID()}`;
    instanceName = uniqueName;
    adapter = new MixpanelAdapter(uniqueName);

    vi.clearAllMocks();
  });

  it("throws if no token is provided", () => {
    expect(() => adapter.configure({ env: "dev", token: "" })).toThrow();
  });

  it("initializes mixpanel with provided token", () => {
    const spy = vi.spyOn(adapter.instance, "init");

    adapter.configure(BASE_CONFIG);

    expect(spy).toHaveBeenCalledWith(
      "test-token",
      expect.any(Object),
      instanceName,
    );
  });

  it("tracks an event after init", () => {
    adapter.configure(BASE_CONFIG);
    const spy = vi.spyOn(adapter.instance, "track");

    adapter.track({ eventType: "Test Event", foo: "bar" });

    expect(spy).toHaveBeenCalledWith("Test Event", { foo: "bar" });
  });

  it("identifies a user and sets traits", () => {
    adapter.configure(BASE_CONFIG);
    const idSpy = vi.spyOn(adapter.instance, "identify");
    const traitsSpy = vi.spyOn(adapter.instance.people, "set");

    adapter.identify({ userId: "123", traits: { foo: "bar" } });

    expect(idSpy).toHaveBeenCalledWith("123");
    expect(traitsSpy).toHaveBeenCalledWith({ foo: "bar" });
  });

  it("does not track if not initialized", () => {
    const spy = vi.spyOn(adapter.instance, "track");

    adapter.track({ eventType: "No Init" });

    expect(spy).not.toHaveBeenCalled();
  });
});
