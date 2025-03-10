import { LOCALES } from "./constants";

export type Locale = (typeof LOCALES)[number];

export type InMemoryTranslationsLoader = (
  locale: Locale,
  namespace: string,
) => Promise<Record<string, object>>;

export type InitConfig = {
  applicationName: string;
  applicationUrl?: string;
  inMemoryTranslationsLoader?: InMemoryTranslationsLoader;
  debug?: boolean;
};

// Extracts deep keys from a nested object
export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${K}` | `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
  : never;

// Retrieves the value of a deep key
export type GetDictValue<
  T extends string,
  O,
> = T extends `${infer A}.${infer B}`
  ? A extends keyof O
    ? GetDictValue<B, O[A]>
    : never
  : T extends keyof O
    ? O[T]
    : never;

/**
 * Currently this TFunction type, that extends i18next TFunction, can not be used to type our TFunction because
 * - we miss $TFunctionBrand in our t function declaration in useTranslation (this results in tsc errors)
 * - Keys can be autocomplete but bad keys don't raise tsc errors
 *
 * Let's keep it in case at some point we need to use this typing to reduce the tsc computation.
 *
import { TFunction as OriginalTFunction, TOptions } from "i18next";
export interface TFunction<
  AppResources,
  Ns extends keyof AppResources = keyof AppResources,
> extends OriginalTFunction {
  <
    P extends DeepKeys<AppResources[Ns]>,
    Ret extends GetDictValue<P, AppResources[Ns]> = GetDictValue<
      P,
      AppResources[Ns]
    >,
  >(
    key: P,
    options?: TOptions & { defaultValue?: string },
  ): Ret;
}
 */
