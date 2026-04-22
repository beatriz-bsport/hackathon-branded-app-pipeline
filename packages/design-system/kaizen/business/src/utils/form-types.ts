import type { FieldPath, FieldValues } from "@bsport/form";

// Helper type to get the type of a nested path
type NestedValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Enforce the selected name to be within the FieldValues and to resolve to a boolean field
export type BooleanFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: NestedValue<T, K> extends boolean ? K : never;
}[FieldPath<T>];

// Enforce the selected name to be within the FieldValues and to resolve to a field of number array
export type NumberListFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: NestedValue<T, K> extends number[] | null ? K : never;
}[FieldPath<T>];

// Enforce the selected name to be within the FieldValues and to resolve to a number field
export type NumberFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: NestedValue<T, K> extends number | null ? K : never;
}[FieldPath<T>];

// Enforce the selected name to be within the FieldValues and to resolve to the provided type
export type CustomFieldPath<T extends FieldValues, Custom> = {
  [K in FieldPath<T>]: NestedValue<T, K> extends Custom ? K : never;
}[FieldPath<T>];

// Enforce the selected name to be within the FieldValues and to resolve to a media (File | string | null | undefined) field
export type MediaFieldPath<T extends FieldValues> = CustomFieldPath<
  T,
  File | string | null | undefined
>;
