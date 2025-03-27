import type { TOptions } from "i18next";
import {
  type FallbackNs,
  type UseTranslationOptions,
  useTranslation,
} from "react-i18next";

import type { DeepKeys, GetDictValue, InitConfig } from "./types";
import { getNamespacePrefixer } from "./utils";

/**
 * Return an override version of useTranslation, for which provided namespaces
 * are prefixed with the config.applicationName input.
 * To have typescript intellisense, provide generic type of your resources to the getter.
 *
 * @description
 * In your i18n app folder, after running translation:update script, you'll find
 * the `locales/en/translations.json` build file : it contains your app translations
 * structure. Use it to define your AppResources type.
 * ```tsx
 * import type translations from "#src/i18n/locales/en/translations.json";
 *
 * export const useTranslation = getUseTranslation<typeof translations>({
 *   applicationName: i18nNamespacePrefix,
 * });
 * ```
 */
export function getUseTranslation<AppResources>({
  applicationName,
}: InitConfig) {
  const namespacePrefixer = getNamespacePrefixer<keyof AppResources>({
    applicationName,
  });

  function useTranslationOverride<Namespaces extends keyof AppResources>(
    namespaces?: Namespaces | Namespaces[],
    options?: UseTranslationOptions<FallbackNs<Namespaces>>,
  ) {
    // Prefix namespaces
    const overrideNamespaces = namespaces
      ? Array.isArray(namespaces)
        ? namespaces.map(namespacePrefixer)
        : namespacePrefixer(namespaces)
      : undefined;

    // Transform options to also prefix namespaces
    const getOverrideTOptions = (_options?: TOptions) => {
      if (!_options) return {};
      if (typeof _options === "string") return _options;

      if ("ns" in _options && _options.ns) {
        const _ns = _options.ns;
        return {
          ..._options,
          ns: Array.isArray(_ns)
            ? _ns.map(namespacePrefixer)
            : namespacePrefixer(_ns as keyof AppResources),
        };
      }

      return _options;
    };

    // Hook into i18next
    const params = useTranslation<
      // @ts-expect-error TS can not infer that Namespaces (keyof AppResources) extends string
      Namespaces | Namespaces[],
      FallbackNs<Namespaces>
    >(overrideNamespaces, options);

    // useTranslation exports
    // - an array [t: TFunction<Ns, KPrefix>, i18n: i18n, ready: boolean]
    // - and a dictionary, containing i18n, t, and ready
    const { t: originalT, i18n, ready } = params;

    // Strongly-typed `t`
    const overrideT = <P extends DeepKeys<AppResources[Namespaces]>>(
      i18nKey: P,
      options?: TOptions,
    ) => {
      return originalT(i18nKey, getOverrideTOptions(options)) as GetDictValue<
        P,
        AppResources[Extract<Namespaces, string>]
      >;
    };

    return {
      t: overrideT,
      i18n: i18n,
      ready: ready,
    };
  }

  return useTranslationOverride;
}

type UseTranslation<AppResources> = ReturnType<
  typeof getUseTranslation<AppResources>
>;

export type TFunctionGeneric<AppResources> = ReturnType<
  UseTranslation<AppResources>
>["t"];
