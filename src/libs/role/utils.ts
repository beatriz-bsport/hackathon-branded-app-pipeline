import { TFunction } from 'i18next';
import { Permission, Role } from './types';

export const getRoleName = (role: Role, t: TFunction) => {
  if (role.editable) {
    return role.name;
  }
  return t(`role:roleDescription.${role.id}.name`);
};

export const getRoleDescription = (role: Role, t: TFunction) => {
  if (role.editable) {
    return role.description;
  }

  return t(`roleDescription.${role.id}.description`);
};

export const checkRequiredPermissions = (
  requiredPermissions: string,
  permissions: Permission,
) => {
  const permissionsStrArray = requiredPermissions.split(',');

  let hasPermissions = true;

  for (let i = 0; i < permissionsStrArray.length; i += 1) {
    const keysArray = permissionsStrArray[i].split('.');

    let obj = permissions;

    for (let j = 0; j < keysArray.length; j += 1) {
      const key = keysArray[j];
      // @ts-ignore;
      if (obj[key] === undefined) {
        return false;
      }
      // @ts-ignore;
      obj = obj[key];
    }

    // @ts-ignore
    hasPermissions = hasPermissions && obj;
  }

  return hasPermissions;
};
