import {
  type DeepKeys,
  type WithSignature,
  checkHasPermission,
} from "@bsport/permissions";
import {
  type CompanyRolePermissions,
  type ObjectLevelPermissions,
  dataAccessLayer,
} from "@bsport/sm-backbone";

type NavigationPermissions = Omit<CompanyRolePermissions, "restrictedPaths">;

export const useNavigationPermission = (
  path: DeepKeys<NavigationPermissions>,
) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<NavigationPermissions>>({
    permissions: userRole?.permissions as WithSignature<NavigationPermissions>,
    path,
  });
};

export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
    permissions: userRole?.object_level_permissions,
    path,
  });
};

export const useClassesNavPermissions = () => {
  const canSeeWorkshops = useNavigationPermission(
    "navigationMenu.myClub.workshops",
  );
  const canSeeActivities = useNavigationPermission(
    "navigationMenu.myClub.activities",
  );
  return { canSeeWorkshops, canSeeActivities };
};

export const useClassesCreatePermissions = () => {
  const canCreateWorkshop = useObjectLevelPermission(
    "management.workshop.allowed_actions.create",
  );
  const canCreateActivity = useObjectLevelPermission(
    "management.activity.allowed_actions.create",
  );
  return {
    canCreateWorkshop,
    canCreateActivity,
    canCreateAny: canCreateWorkshop || canCreateActivity,
  };
};

export const useClassRowPermissions = (isWorkshop: boolean) => {
  const wEdit = useObjectLevelPermission(
    "management.workshop.allowed_actions.edit",
  );
  const wDelete = useObjectLevelPermission(
    "management.workshop.allowed_actions.delete",
  );
  const wSession = useObjectLevelPermission(
    "session.workshop.allowed_actions.create",
  );
  const aEdit = useObjectLevelPermission(
    "management.activity.allowed_actions.edit",
  );
  const aDelete = useObjectLevelPermission(
    "management.activity.allowed_actions.delete",
  );
  const aSession = useObjectLevelPermission(
    "session.activity.allowed_actions.create",
  );

  return isWorkshop
    ? { canEdit: wEdit, canDelete: wDelete, canCreateSession: wSession }
    : { canEdit: aEdit, canDelete: aDelete, canCreateSession: aSession };
};
