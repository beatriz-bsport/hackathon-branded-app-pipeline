import { type ZodObject, z } from "zod";

export function generateEvent<
  T extends ZodObject<{ eventType: z.ZodDefault<z.ZodString> }>,
>(schema: T) {
  return (params: z.input<T>): z.output<T> => {
    return schema.parse(params);
  };
}
