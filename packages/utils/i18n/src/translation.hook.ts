import {
  useTranslation,
  type UseTranslationOptions,
  type FallbackNs,
} from "react-i18next";

import type { InitConfig, TFunction } from "./constants";
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
    const getOverrideTOptions = (_options?: { ns?: string }) => {
      return _options?.ns
        ? {
            ns: namespacePrefixer(_options?.ns),
          }
        : {};
    };
    const params = useTranslation(overrideNamespaces, options);
    const { t: originalT } = params;
    const overrideT: TFunction = (i18nKey, options) =>
      originalT(i18nKey, getOverrideTOptions(options));
    return {
      ...params,
      t: overrideT,
    };
  }

  return useTranslationOverride;
}
