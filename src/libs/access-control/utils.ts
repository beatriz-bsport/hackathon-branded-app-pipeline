import { UPSELL_IDENTIFIER_ACCESS_MONITORING } from '#libs/platform-billing/upsell-identifiers';

import { hasUpsell } from '#libs/platform-billing/utils';

import type { RolePermission } from '#libs/role/types';
import type { UpsellSumup } from '#libs/company/types';

/**
 * Checks if a staff member can perform access monitoring based on their permissions and selected establishments.
 * @param featureList - The list of upsell features.
 * @param permissions - The role permissions of the staff member.
 * @param establishmentsSelectedInRole - The establishments selected in the staff member's role.
 * @returns A boolean indicating whether the staff member can perform access monitoring.
 */
export const staffMemberCanPerformAccessMonitoring = (
  featureList: Array<UpsellSumup>,
  permissions: RolePermission,
  establishmentsSelectedInRole: number[],
) => {
  return (
    hasUpsell({ upsell: featureList }, UPSELL_IDENTIFIER_ACCESS_MONITORING) &&
    permissions?.navigationMenu?.accessMonitoring?.perform &&
    !!establishmentsSelectedInRole?.length
  );
};
