import {
  useTranslation,
  type UseTranslationOptions,
  type FallbackNs,
} from "react-i18next";
import type { TFunction } from "i18next";
import type { InitConfig } from "./constants";
import { getNamespacePrefixer } from "./utils";

type UseTranslationNs = Parameters<typeof useTranslation>[0];

/**
 * Return an override version of useTranslation, for which provided namespaces
 * are prefixed with the config.applicationName input
 */
export function getUseTranslation({ applicationName }: InitConfig) {
  const namespacePrefixer = getNamespacePrefixer({ applicationName });

  function useTranslationOverride(
    namespaces?: UseTranslationNs,
    options?: UseTranslationOptions<FallbackNs<UseTranslationNs>>,
  ) {
    let overrideNamespaces: UseTranslationNs = undefined;
    if (typeof namespaces === "string") {
      overrideNamespaces = namespacePrefixer(namespaces);
    }
    if (Array.isArray(namespaces)) {
      overrideNamespaces = namespaces.map(namespacePrefixer);
    }

    // When multiple namespaces are provided, the t function must provide
    // Options to specify which namespace to use, that has to be override as well
    const getOverrideTOptions = (
      _options?: Parameters<TFunction<string, string>>[1],
    ) => {
      if (!_options) return {};

      if (typeof _options === "string") return _options;

      if ("ns" in _options && _options.ns) {
        const _ns = _options.ns;
        const overrideNs = Array.isArray(_ns)
          ? _ns.map(namespacePrefixer)
          : namespacePrefixer(_ns as string);
        return {
          ..._options,
          ns: overrideNs,
        };
      }

      return _options;
    };
    const params = useTranslation(overrideNamespaces, options);
    const { t: originalT } = params;
    // @ts-expect-error typing mess
    const overrideT: TFunction<string, string> = (i18nKey, options) => {
      // @ts-expect-error typing mess
      return originalT(i18nKey, getOverrideTOptions(options));
    };
    return {
      ...params,
      t: overrideT,
    };
  }

  return useTranslationOverride;
}
