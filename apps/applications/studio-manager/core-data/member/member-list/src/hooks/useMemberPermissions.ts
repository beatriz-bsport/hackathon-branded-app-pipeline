import { dataAccessLayer } from "@bsport/sm-backbone";

import { useObjectLevelPermission } from "#src/utils/permissions";

export type MemberPermissions = {
  archive: boolean;
  create: boolean;
  importLeads: boolean;
  restore: boolean;
  search: boolean;
  seeBalance: boolean;
  seeProfile: boolean;
  seePersonalData: boolean;
};

export const useMemberPermissions = (): MemberPermissions => {
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const hasImportLeadsEnabled = !!companyTheme?.zoho_member_import_enabled;

  const hasArchivePermission = useObjectLevelPermission(
    "member.allowed_actions.delete",
  );
  const hasCreatePermission = useObjectLevelPermission(
    "member.allowed_actions.create",
  );
  const hasRestorePermission = useObjectLevelPermission(
    "member.allowed_actions.editInfo",
  );
  const hasSearchPermission = useObjectLevelPermission(
    "member.allowed_actions.search",
  );
  const hasSeeBalancePermission = useObjectLevelPermission(
    "member.allowed_actions.readBalance",
  );
  const hasSeeProfileDetailsPermission = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );
  const hasSeePersonalDataPermission = useObjectLevelPermission(
    "member.allowed_actions.readInfo",
  );

  return {
    archive: hasArchivePermission,
    create: hasCreatePermission,
    importLeads: hasImportLeadsEnabled,
    restore: hasRestorePermission,
    search: hasSearchPermission,
    seeBalance: hasSeeBalancePermission,
    seeProfile: hasSeeProfileDetailsPermission,
    seePersonalData: hasSeePersonalDataPermission,
  };
};
