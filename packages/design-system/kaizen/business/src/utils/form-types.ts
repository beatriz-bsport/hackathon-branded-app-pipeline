import type { FieldPath, FieldValues } from "@bsport/form";

// Enforce the selected name to be within the FieldValues and to resolve to a boolean field
export type BooleanFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: T[K] extends boolean ? K : never;
}[FieldPath<T>];

// Enforce the selected name to be within the FieldValues and to resolve to a field of number array
export type NumberListFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: T[K] extends number[] ? K : never;
}[FieldPath<T>];
