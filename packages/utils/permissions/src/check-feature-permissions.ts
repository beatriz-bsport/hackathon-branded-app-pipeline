import { type Environment, getEnvironment } from "./get-environment";

type Features = Array<{
  readable_identifier: string;
  upsell_identifier: number;
  is_free_trial: boolean;
  trial_remaining_days: number | null;
}>;

/**
 *
 * @param features List of features enabled for a company.
 * @param identifier Identifier of a feature (upsell identifier) to check permission.
 * @param enableInEnvMode Array of environment where to force activate the feature (testing purpose).
 *
 * @description Create a hook to inject the feature list data
 * ```tsx
 * import { type Environment, checkFeaturePermission } from "@bsport/permissions";
 * import { dataAccessLayer } from "@bsport/sm-backbone";
 *
 * export const useFeaturePermission = (
 *   identifier: number,
 *   enableInEnvMode?: Array<Environment>,
 * ) => {
 *   const features = dataAccessLayer.useCompanyFeatures();
 *   return checkFeaturePermission({ features, identifier, enableInEnvMode });
 * };
 * ```
 */
export function checkFeaturePermission({
  features,
  identifier,
  enableInEnvMode,
}: {
  features?: Features;
  identifier?: number;
  enableInEnvMode?: Array<Environment>;
}): boolean {
  const envCheck = getEnvironment();
  if (enableInEnvMode?.length && enableInEnvMode.some((env) => envCheck[env])) {
    return true;
  }

  if (!features || identifier === undefined || identifier === null)
    return false;

  if (!Array.isArray(features) || features.length === 0) return false;

  const featuresIdentifiers = features.map(
    (upsellSumup) => upsellSumup.upsell_identifier,
  );
  return featuresIdentifiers.includes(identifier);
}
