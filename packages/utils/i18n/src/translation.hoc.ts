import { withTranslation } from "react-i18next";
import type { InitConfig } from "./constants";
import { getNamespacePrefixer } from "./utils";

type WithTranslationNs = Parameters<typeof withTranslation>[0];
type WithTranslationOptions = Parameters<
  typeof withTranslation<WithTranslationNs>
>[1];
type WithTranslationReturnType = ReturnType<
  typeof withTranslation<WithTranslationNs>
>;

/**
 * Return an override version of withTranslation, for which provided namespaces
 * are prefixed with the config.applicationName input
 */
export function getWithTranslation({ applicationName }: InitConfig) {
  const namespacePrefixer = getNamespacePrefixer({ applicationName });

  function withTranslationOverride(
    namespaces?: WithTranslationNs,
    options?: WithTranslationOptions,
  ): WithTranslationReturnType {
    let overrideNs: WithTranslationNs = undefined;
    if (typeof namespaces === "string") {
      overrideNs = namespacePrefixer(namespaces);
    }
    if (Array.isArray(namespaces)) {
      overrideNs = namespaces.map(namespacePrefixer);
    }
    return withTranslation(overrideNs, options);
  }

  return withTranslationOverride;
}
