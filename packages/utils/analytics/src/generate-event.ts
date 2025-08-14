import { type ZodObject, z } from "zod";

export function generateEvent<
  T extends ZodObject<{ eventType: z.ZodDefault<z.ZodString> }>,
>(schema: T) {
  return (params: Omit<z.infer<T>, "eventType">): z.infer<T> =>
    schema.parse(params);
}
