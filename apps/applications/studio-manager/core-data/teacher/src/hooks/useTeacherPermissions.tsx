import { useObjectLevelPermission } from "#src/utils/permissions";

export const useTeacherPermissions = () => {
  const hasDeletePermission = useObjectLevelPermission(
    "management.coach.allowed_actions.delete",
  );
  const hasCreatePermission = useObjectLevelPermission(
    "management.coach.allowed_actions.create",
  );
  const hasEditPermission = useObjectLevelPermission(
    "management.coach.allowed_actions.edit",
  );

  return {
    create: hasCreatePermission,
    delete: hasDeletePermission,
    edit: hasEditPermission,
  };
};
