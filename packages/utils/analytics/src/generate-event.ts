import { type ZodObject, z } from "zod";

import type { EventResult, Properties } from "./types";

/**
 * Utils for generating analytics events with Zod validation.
 * Uses `safeParse` under the hood and returns `{ event, errors }`.
 *
 * On success: `errors` is `null`, `event` is the fully validated output.
 * On failure: `errors` contains the ZodError, `event` is a best-effort
 * object built from schema defaults + raw input.
 *
 * The fallback event is intentionally designed to be as useful as possible while
 * still being safe to track. It includes all raw input (even invalid) and
 * fills in any missing properties with schema defaults where possible. This way,
 * even when validation fails, we can still track something that may be helpful
 * for debugging and error monitoring.
 */

export function generateEvent<
  T extends ZodObject<{
    eventType: z.ZodDefault<z.ZodString>;
    validationFailed?: z.ZodBoolean;
  }>,
>(schema: T) {
  return (params: z.input<T>): EventResult<z.output<T>> => {
    const result = schema.safeParse(params);

    if (result.success) {
      return { event: result.data as z.output<T>, errors: null };
    }

    const eventType = schema.shape.eventType._def.defaultValue() as string;
    const normalizedParams =
      params !== null && typeof params === "object"
        ? (params as Record<string, unknown>)
        : {};

    const { eventType: rawEventType, ...rawParams } = normalizedParams;

    // Best-effort event: merges schema defaults (e.g. eventType) with the raw
    // input so we can still track something useful even when validation fails.
    // Raw params are spread last to preserve any valid data the caller provided.
    const fallbackEvent: Partial<z.output<T>> & Properties = {
      ...Object.fromEntries(
        Object.entries(schema.shape).reduce<[string, unknown][]>(
          (acc, [key, field]) => {
            if (key !== "eventType" && field instanceof z.ZodDefault) {
              acc.push([key, field._def.defaultValue()]);
            }
            return acc;
          },
          [],
        ),
      ),
      ...rawParams,
      eventType: typeof rawEventType === "string" ? rawEventType : eventType,
      validationFailed: true,
    };

    return {
      event: fallbackEvent,
      errors: { eventType, zodError: result.error },
    };
  };
}
