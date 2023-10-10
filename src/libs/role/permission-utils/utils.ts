import get from 'lodash/get';
import every from 'lodash/every';
import values from 'lodash/values';
import last from 'lodash/last';
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

  /**
   *  Returns true if all sub-permissions within allowed actions are enabled
   *  note that if allowed_actions is passed as last key hasPermission will be an object
   *  @example
   *  When requiredPermission equals "reservation.activity.allowed_actions"
   *  hasPermission here will be equal to { create: <boolean>, delete: <boolean>, editSpot: <boolean>, ... }
   */
  if (
    last(requiredPermissionKeyPathAsArray) === 'allowed_actions' &&
    !Array.isArray(hasPermission)
  ) {
    return every(values(hasPermission), (permission) => !!permission);
  }

  return hasPermission;
};
