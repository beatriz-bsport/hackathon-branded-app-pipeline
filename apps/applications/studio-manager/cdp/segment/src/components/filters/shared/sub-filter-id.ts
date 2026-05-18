/**
 * Generic utility to extract a union of values from a const object.
 */
export type ValueOf<T extends Record<string, unknown>> = T[keyof T];
