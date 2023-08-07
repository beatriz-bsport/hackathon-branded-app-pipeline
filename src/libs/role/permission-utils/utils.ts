import get from 'lodash/get';
import { ObjectLevelPermissions } from '#libs/role/types';

export const hasObjectLevelPermission: (
  userPermissions: ObjectLevelPermissions,
  requiredPermission: string,
) => boolean = (userPermissions, requiredPermission) => {
  const requiredPermissionKeyPathAsArray = requiredPermission.split('.');
  const hasPermission = get(
    userPermissions,
    requiredPermissionKeyPathAsArray,
    true,
  );
  return hasPermission;
};
