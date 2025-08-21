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

  it("uses default eventType", () => {
    const result = buttonClickedEvent({ kind: "primary" });
    expect(result).toEqual({
      eventType: "button_clicked",
      kind: "primary",
    });
  });

  it("keeps provided eventType if explicitly given", () => {
    const result = buttonClickedEvent({
      // @ts-expect-error Dev is not authorized to provide eventType normally
      eventType: "custom_event",
      kind: "secondary",
    });
    expect(result).toEqual({
      eventType: "custom_event",
      kind: "secondary",
    });
  });

  it("throws if required field is missing", () => {
    // @ts-expect-error Should raise a lint issue
    expect(() => buttonClickedEvent({})).toThrow();
  });
});
