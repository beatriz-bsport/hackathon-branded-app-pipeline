import { type ZodObject, z } from "zod";

import { SafeEventResult } from "#src/types";

/**
 * Like `generateEvent` but never throws.
 * Uses `safeParse` under the hood and returns `{ event, errors }`.
 *
 * On success: `errors` is `null`, `event` is the fully validated output.
 * On failure: `errors` contains the ZodError, `event` is a best-effort
 * object built from schema defaults + raw input.
 *
 * @example
 * ```ts
 * const sessionListViewedEvent = generateSafeEvent(sessionListViewedEventSchema);
 *
 * const { event, errors } = sessionListViewedEvent({
 *   calendar_view: "daily",
 *   displayed_columns: ["time", "teacher"],
 *   cancelled_sessions_displayed: true,
 *   filters: [],
 * });
 *
 * if (errors) {
 *   // errors.eventType  → "session_list_viewed"
 *   // errors.zodError   → ZodError with validation issue details
 *   captureException(errors.zodError, { tags: { eventType: errors.eventType } });
 * }
 *
 * analyticsClient.track(event);
 * ```
 */
export function generateSafeEvent<
  T extends ZodObject<{ eventType: z.ZodDefault<z.ZodString> }>,
>(schema: T) {
  return (params: z.input<T>): SafeEventResult<z.output<T>> => {
    const result = schema.safeParse(params);

    if (result.success) {
      return { event: result.data as z.output<T>, errors: null };
    }

    const eventType = schema.shape.eventType._def.defaultValue() as string;

    // Best-effort event: merges schema defaults (e.g. eventType) with the raw
    // input so we can still track something useful even when validation fails.
    // Raw params are spread last to preserve any valid data the caller provided.
    const fallbackEvent = {
      eventType,
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
      ...params,
    } as z.output<T>;

    return {
      event: fallbackEvent,
      errors: { eventType, zodError: result.error },
    };
  };
}
