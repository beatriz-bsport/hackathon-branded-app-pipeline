import { useMemo } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { checkFeaturePermission } from "#src/utils/permissions";

import { PROTECTED_FEATURES_URLS } from "./features";

/**
 * For each feature identifier that is related to an URL,
 * Map to this identifier whether the user has access to the feature
 */
export const useFeaturesPermissions = () => {
  const companyFeatures = dataAccessLayer.useCompanyFeatures();

  return useMemo(() => {
    const featureIdentifiers = Object.keys(PROTECTED_FEATURES_URLS).map((key) =>
      parseInt(key),
    );

    const results = new Map<number, boolean>();

    (featureIdentifiers ?? []).forEach((identifier) => {
      const hasFeaturePermission = checkFeaturePermission({
        features: companyFeatures,
        identifier,
        enableInEnvMode: [],
      });
      results.set(identifier, hasFeaturePermission);
    });

    return results;
  }, [companyFeatures]);
};
