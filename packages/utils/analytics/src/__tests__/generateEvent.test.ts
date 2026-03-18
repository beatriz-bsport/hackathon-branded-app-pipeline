import { describe, expect, it } from "vitest";
import { z } from "zod";

import { generateEvent } from "#src/generate-event";

describe("generateEvent", () => {
  const buttonClickedEventSchema = z
    .object({
      eventType: z.string().default("button_clicked"),
      kind: z
        .string()
        .describe("Kind of action performed when clicking on the button"),
    })
    .describe("When the user clicks on a button");

  const buttonClickedEvent = generateEvent(buttonClickedEventSchema);

  describe("on success", () => {
    it("returns errors as null", () => {
      const { errors } = buttonClickedEvent({ kind: "primary" });
      expect(errors).toBeNull();
    });

    it("returns the validated event", () => {
      const { event } = buttonClickedEvent({ kind: "primary" });
      expect(event).toEqual({
        eventType: "button_clicked",
        kind: "primary",
      });
    });

    it("uses default eventType", () => {
      const { event } = buttonClickedEvent({ kind: "primary" });
      expect(event.eventType).toBe("button_clicked");
    });

    it("keeps provided eventType if explicitly given", () => {
      const { event } = buttonClickedEvent({
        eventType: "custom_event",
        kind: "secondary",
      });
      expect(event.eventType).toBe("custom_event");
    });
  });

  describe("on failure", () => {
    it("does not throw when required field is missing", () => {
      // @ts-expect-error intentionally invalid input
      expect(() => buttonClickedEvent({})).not.toThrow();
    });

    it("returns a ZodError in errors.zodError", () => {
      // @ts-expect-error intentionally invalid input
      const { errors } = buttonClickedEvent({});
      expect(errors).not.toBeNull();
      expect(errors?.zodError).toBeDefined();
      expect(errors?.zodError.issues.length).toBeGreaterThan(0);
    });

    it("returns the schema eventType default in errors.eventType", () => {
      // @ts-expect-error intentionally invalid input
      const { errors } = buttonClickedEvent({});
      expect(errors?.eventType).toBe("button_clicked");
    });

    it("returns a best-effort event containing the schema default eventType", () => {
      // @ts-expect-error intentionally invalid input
      const { event } = buttonClickedEvent({});
      expect(event.eventType).toBe("button_clicked");
    });

    it("returns a best-effort event merging valid fields from raw input", () => {
      const { event } = buttonClickedEvent({
        // @ts-expect-error intentionally wrong type for kind to trigger failure
        kind: 42,
      });
      expect(event).toMatchObject({ eventType: "button_clicked", kind: 42 });
    });
  });

  describe("best-effort fallback with multiple defaults", () => {
    const richSchema = z.object({
      eventType: z.string().default("rich_event"),
      category: z.string().default("uncategorized"),
      label: z.string(),
    });

    const richEvent = generateEvent(richSchema);

    it("includes all schema defaults in the fallback event", () => {
      // @ts-expect-error intentionally missing required field
      const { event, errors } = richEvent({});
      expect(errors).not.toBeNull();
      expect(event.eventType).toBe("rich_event");
      expect(event.category).toBe("uncategorized");
      expect(event).toHaveProperty("validationFailed", true);
    });

    it("spreads valid caller-provided values over defaults in the fallback", () => {
      // @ts-expect-error intentionally missing required field
      const { event } = richEvent({ category: "promo" });
      expect(event.category).toBe("promo");
    });
  });
});
