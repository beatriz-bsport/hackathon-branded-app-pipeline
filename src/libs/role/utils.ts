import { TFunction } from 'i18next';
import cloneDeep from 'lodash/cloneDeep';
import mergeWith from 'lodash/mergeWith';
import { Permission, Role } from './types';

export const getRoleName = (role: Role, t: TFunction) => {
  if (role?.editable) {
    return role.name;
  }
  return t(`role:roleDescription.${role?.id}.name`);
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

  const checkNestedPermission = (value: Object | boolean): boolean => {
    if (typeof value === 'boolean') return value;

    return (
      value &&
      Object.keys(value).some((key) => checkNestedPermission(value[key]))
    );
  };

  let haveRight = true;
  for (let i = 0; i < permissionsStrArray.length; i += 1) {
    let obj = permissions;
    const keysArray = permissionsStrArray[i].split('.');

    for (let j = 0; j < keysArray.length; j += 1) {
      const key = keysArray[j];
      // @ts-ignore;
      if (obj?.[key] === undefined) {
        return false;
      }
      // @ts-ignore;
      obj = obj[key];
      haveRight = haveRight && checkNestedPermission(obj);
    }
  }

  return haveRight;
};

export const parseRestrictedPath = (p: any) => {
  return p
    .replace('https://backoffice.bsport.io')
    .replace('https://backoffice.staging.bsport.io');
};

const isStictObject = (item: any) =>
  item && typeof item === 'object' && !Array.isArray(item);

export const setAllValuesInObject = (object: Object, value: any): Object => {
  if (!isStictObject(object)) return {};
  return Object.keys(object).reduce((acc, key: keyof Object) => {
    const objectValue = object[key];

    if (isStictObject(objectValue)) {
      acc[key] = setAllValuesInObject(objectValue, value);
      return acc;
    }

    // ignoring array
    if (Array.isArray(objectValue)) {
      acc[key] = objectValue;
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
};

export const deepMerge = (
  srcObject: Object,
  completionObject: Object,
): Object => {
  return mergeWith(cloneDeep(srcObject), completionObject, (a, b) => {
    if (typeof a === 'boolean' && typeof b === 'object') {
      return setAllValuesInObject(b, a);
    }
    if (typeof a === 'object' && typeof b === 'object') {
      return deepMerge(a, b);
    }
    return a;
  });
};
