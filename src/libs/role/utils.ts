// @ts-nocheck
import { TFunction } from 'i18next';
import memoize from 'memoize-one';

import cloneDeep from 'lodash/cloneDeep';
import mergeWith from 'lodash/mergeWith';
import get from 'lodash/get';

import { URLS_PERMISSIONS, UUID_REGEX } from './constants';
import {
  RolePermission,
  ProtectedUrls,
  Role,
  SelectFieldItem,
  FranchiseRole,
  FranchiseRolePermission,
} from './types';
import { Coach } from '#libs/associated-coach/types';
import { Company } from '#libs/company/types';

export const getRoleName = (role: Role | FranchiseRole, t: TFunction) => {
  if (role?.editable) {
    return role.name;
  }
  if (role?.identifier !== undefined && role.identifier !== null) {
    return t(`role:roleDescription.${role.identifier}.name`);
  }
  return t(`role:roleDescription.${role?.id}.name`);
};

export const getRoleDescription = (
  role: Role | FranchiseRole,
  t: TFunction,
) => {
  if (role.editable) {
    return role.description;
  }

  return t(`roleDescription.${role.id}.description`);
};

export const checkRequiredPermissions = (
  requiredPermissions: string,
  permissions: RolePermission | FranchiseRolePermission,
) => {
  const permissionsStrArray = requiredPermissions.split(',');

  const checkNestedPermission = (value: Object | boolean): boolean => {
    if (typeof value === 'boolean') return value;

    return (
      value &&
      Object.keys(value).some((key) => checkNestedPermission(value?.[key]))
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

export const checkRequiredPermissionsForPath = memoize(
  (url: ProtectedUrls, permissions: RolePermission) => {
    const urlWithoutTrailingSlash: ProtectedUrls =
      url?.replace(/\/$/, '') ?? '';

    const requiredPermissions = URLS_PERMISSIONS[urlWithoutTrailingSlash] ?? [];

    // restricted path are first priority and follow only a "is path included" rule
    if (permissions.restrictedPaths?.length > 0) {
      return permissions.restrictedPaths.some((path) =>
        path.includes(urlWithoutTrailingSlash),
      );
    }

    // if no permissions is provided authorized the access
    if (requiredPermissions?.length === 0) {
      return true;
    }

    // If one permission is valid authorized access
    return requiredPermissions.some((requiredPermission) => {
      const accessRight = get(permissions, requiredPermission, undefined);

      if (typeof accessRight === 'boolean') return accessRight;

      // some old right are not fully migrated in this case we check that the parent have at least one
      // right in this config
      const parentAccessRight = get(
        permissions,
        requiredPermission.split('.').slice(-1).join('.'),
        undefined,
      );
      return (
        parentAccessRight &&
        Object.keys(parentAccessRight).some(
          (key) =>
            typeof parentAccessRight?.[key] === 'boolean' &&
            parentAccessRight[key],
        )
      );
    });
  },
);

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

export const getOptionsFromIds = memoize(
  (ids: number[], objectList: (Coach | Company)[]): SelectFieldItem[] => {
    return objectList
      .filter((object: Coach | Company) => ids.includes(object.id))
      .map((coach: Coach | Company) => ({
        value: coach.id,
        label: coach.name,
      }));
  },
);

type HasAccessToUrlProps = {
  url: string;
  userPermissions: RolePermission;
};

export const hasAccessToUrl = ({
  url,
  userPermissions,
}: HasAccessToUrlProps): boolean => {
  const permissionKey = matchUrlToRelevantPermissionKey(url);
  return !!getNestedKeyInObject(userPermissions, permissionKey);
};

// TODO : https://gitlab.com/bsport/bsport-saas/-/issues/1383
export const matchUrlToRelevantPermissionKey = (url: string) => {
  if (url) {
    const cleanedUrl = parseRestrictedPath(url);
    // Will match any string with the form : /replacement/management with potentially a last '/'
    if (new RegExp(/^\/replacement\/management\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'myClub', 'replacement'];
    }

    // Will match any string with the form : /payment-pack with potentially a last '/'
    if (new RegExp(/^\/payment-pack\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'products', 'paymentPack'];
    }

    // Will match any string with the form : /member/{only numbers}/private-booking/{only numbers} with potentially a last '/'
    if (
      new RegExp(/^\/member\/[0-9]+\/private-booking\/[0-9]+\/?$/).test(
        cleanedUrl,
      )
    ) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/private-consumer-pass/{only numbers} with potentially a last '/'
    if (
      new RegExp(/^\/member\/[0-9]+\/private-consumer-pass\/[0-9]+\/?$/).test(
        cleanedUrl,
      )
    ) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/bookings/{only numbers} with potentially a last '/'
    if (
      new RegExp(/^\/member\/[0-9]+\/bookings\/[0-9]+\/?$/).test(cleanedUrl)
    ) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/pass/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/member\/[0-9]+\/pass\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/giftcard/{only numbers} with potentially a last '/'
    if (
      new RegExp(/^\/member\/[0-9]+\/giftcard\/[0-9]+\/?$/).test(cleanedUrl)
    ) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/vod/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/member\/[0-9]+\/vod\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/basket/{an uuid} with potentially a last '/'
    if (
      new RegExp(`^/member/[0-9]+/basket/${UUID_REGEX}/?$`).test(cleanedUrl)
    ) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /member/{only numbers}/info with potentially a last '/'
    if (new RegExp(/^\/member\/[0-9]+\/info\/?$/).test(cleanedUrl)) {
      return ['member', 'retrieve'];
    }

    // Will match any string with the form : /expense/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/expense\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'payments', 'expenses'];
    }

    // Will match any string with the form : /subscription/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/subscription\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'products', 'contracts'];
    }

    // Will match any string with the form : /giftcard/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/giftcard\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'products', 'giftcards'];
    }

    // Will match any string with the form : /shop/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/shop\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'products', 'shop'];
    }

    // Will match any string with the form : /coupon/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/coupon\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'products', 'promotions'];
    }

    // Will match any string with the form : /coupon/{only numbers} with potentially a last '/'
    if (new RegExp(/^\/vod\/video\/[0-9]+\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'digitalOffer', 'videos'];
    }

    // Will match any string with the form : /activity/{only numbers}/general with potentially a last '/'
    if (new RegExp(/^\/activity\/[0-9]+\/general\/?$/).test(cleanedUrl)) {
      return ['navigationMenu', 'myClub', 'activities'];
    }

    // Will match any string with the form : /workshop-activity/{only numbers}/general with potentially a last '/'
    if (
      new RegExp(/^\/workshop-activity\/[0-9]+\/general\/?$/).test(cleanedUrl)
    ) {
      return ['navigationMenu', 'myClub', 'workshops'];
    }

    // Will match any string with the form : /calendar/{4 numbers}/{2 numbers}/{2 numbers}/{only numbers} with potentially a last '/'
    if (
      new RegExp(/^\/calendar\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[0-9]+\/?$/).test(
        cleanedUrl,
      )
    ) {
      return ['navigationMenu', 'calendar'];
    }

    // Will match any string with the form : /invoice/{an uuid} with potentially a last '/'
    if (new RegExp(`^/invoice/${UUID_REGEX}/?$`).test(cleanedUrl)) {
      return ['navigationMenu', 'payments', 'billings'];
    }

    // Will match any string with the form : /private-service/service/{only numbers}/general with potentially a last '/'
    if (
      new RegExp(/^\/private-service\/service\/[0-9]+\/general\/?$/).test(
        cleanedUrl,
      )
    ) {
      return ['navigationMenu', 'myClub', 'appointments'];
    }

    // Will match any string with the form : /calendar/{4 numbers}/{2 numbers}/{2 numbers} with potentially a last '/'
    if (
      new RegExp(/^\/calendar\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/?$/).test(
        cleanedUrl,
      ) ||
      new RegExp(/^\/offer\/[0-9]+\/?$/).test(cleanedUrl)
    ) {
      return ['navigationMenu', 'calendar'];
    }
  }
  return [];
};

export const getNestedKeyInObject = (object: Object, keys: string[]) => {
  if (checkNestedKeyInObject(object, keys)) {
    return keys.reduce(
      (currentNestedObject, key) =>
        currentNestedObject &&
        currentNestedObject[key] !== null &&
        currentNestedObject[key] !== undefined
          ? currentNestedObject[key]
          : null,
      object,
    );
  }
  return undefined;
};
export const checkNestedKeyInObject = (
  object: Object,
  keys: string[],
): boolean => {
  if (!object) {
    return false;
  }
  const [currentKey, ...restKey] = keys;

  if (
    restKey.length === 0 &&
    Object.prototype.hasOwnProperty.call(object, currentKey)
  )
    return true;
  return checkNestedKeyInObject(object[currentKey], restKey);
};
