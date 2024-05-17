// @ts-nocheck
import { TFunction } from 'i18next';
import memoize from 'memoize-one';

import cloneDeep from 'lodash/cloneDeep';
import mergeWith from 'lodash/mergeWith';
import get from 'lodash/get';

import { URLS_PERMISSIONS, UUID_REGEX } from './constants';
import type {
  RolePermission,
  ProtectedUrls,
  Role,
  SelectFieldItem,
  FranchiseRole,
  FranchiseRolePermission,
  ObjectLevelPermissions,
} from './types';
import type { Coach } from '#libs/associated-coach/types';
import type { Company, UpsellSumup } from '#libs/company/types';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';
import Config from '#src/config';

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
      // @ts-expect-error;
      if (obj?.[key] === undefined) {
        return false;
      }
      // @ts-expect-error;
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
  (
    ids: number[],
    objectList: (Coach | Company | Establishment | EstablishmentGroupAPI)[],
  ): SelectFieldItem[] => {
    return objectList
      .filter((object) => ids.includes(object.id))
      .map((object) => ({
        value: object.id,
        label: object.name || object.title,
      }));
  },
);

type HasAccessToUrlProps = {
  url: string;
  userPermissions: RolePermission;
  objectLevelPermissions: ObjectLevelPermissions;
};

export const hasAccessToUrl = ({
  url,
  userPermissions,
  objectLevelPermissions,
}: HasAccessToUrlProps): boolean => {
  // Will revoke access to member profiles (URLs starting with "/member/{only numbers}") if not granted by the objectLevelPermissions.
  if (
    url &&
    new RegExp(/^\/member\/[0-9]+.*/).test(parseRestrictedPath(url)) &&
    !objectLevelPermissions?.member?.allowed_actions?.accessProfile
  ) {
    return false;
  }

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

/**
 * Generates an array of objects containing unique address options from a list of establishments.
 *
 * @param {Establishment[]} establishments - The list of establishments to extract address options from.
 * @returns {SelectFieldItem[]} - An array of objects with 'value' and 'label' properties representing unique address options.
 */
export const getAddressOptionsFromEstablishmentList = (
  establishments: Establishment[],
): SelectFieldItem[] => {
  const uniqueAddresses: string[] = [];

  return establishments
    ? [...establishments].reduce((result, establishment) => {
        const address = establishment.location.address;

        // Check if the 'address' is not already in 'uniqueAddresses'
        if (!uniqueAddresses.includes(address)) {
          uniqueAddresses.push(address);

          result.push({
            value: establishment.id,
            label: address,
          });
        }

        return result;
      }, [])
    : [];
};

/**
 * `getEstablishmentOptionsFromSelectedSites` is a function that gets the establishment options from the selected sites.
 *
 * **IMPORTANT**: In this function, 'Site' terminology is used to refer to 'Establishment Group' when the multi-location upsell feature is enabled,
 * and 'Address' when the feature is not enabled.
 *
 * @function
 * @param {boolean} params.hasMultiLocationUpsell - A flag indicating whether the multi-location upsell feature is enabled.
 * @param {SelectFieldItem} params.selectedSite - The selected site.
 * @param {EstablishmentGroupAPI[]} params.establishmentGroupList - The list of establishment groups.
 * @param {Establishment[]} params.establishmentList - The list of establishments.
 * @returns {SelectFieldItem[]} An array of select field items representing the establishments.
 *
 * This function filters the establishments based on the selected site and the multi-location upsell feature. If the feature
 * is enabled, it filters the establishments that are included in the selected establishment group. If the feature is not
 * enabled, it filters the establishments that have the same address as the selected site. It then maps the filtered
 * establishments to select field items.
 */
export const getEstablishmentOptionsFromSelectedSites = ({
  hasMultiLocationUpsell,
  selectedSite,
  establishmentGroupList,
  establishmentList,
}: {
  hasMultiLocationUpsell: boolean;
  selectedSite: SelectFieldItem;
  establishmentGroupList: EstablishmentGroupAPI[];
  establishmentList: Establishment[];
}): SelectFieldItem[] => {
  if (hasMultiLocationUpsell) {
    // Filter establishment included in selectedSite (selected establihsment groups in this case)
    return selectedSite && establishmentList
      ? [...establishmentList]
          .filter((establishment) => {
            return establishmentGroupList
              ?.find((group) => group.id === selectedSite.value)
              ?.establishment?.some(
                (establishmentId) => establishment.id === establishmentId,
              );
          })
          .map((establishment) => ({
            value: establishment.id,
            label: establishment.title,
          }))
      : [];
  }
  // Filter establishment included in selectedSites (selected addesses in this case)
  return selectedSite && establishmentList
    ? [...establishmentList]
        .filter((establishment) => {
          return establishment.location.address === selectedSite.label;
        })
        .map((establishment) => ({
          value: establishment.id,
          label: establishment.title,
        }))
    : [];
};

/**
 * Returns a boolean whether the user has subscribed to the upsell with the given identifier.
 * @param {number} identifier - The identifier of the upsell to check.
 * @param {UpsellSumup[]} subscribedUpsells - The list of subscribed upsells (from state).
 * @param {boolean} forceOnAllEnvs - A flag to force the check on all environments, and not
 * only production (by default).
 */
export const hasUpsellIdentifier = (
  identifier: number,
  subscribedUpsells: UpsellSumup[],
  forceOnAllEnvs: boolean = false,
): boolean => {
  if (forceOnAllEnvs)
    return subscribedUpsells
      .map((upsell) => upsell.upsell_identifier)
      .includes(identifier);
  return (
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    subscribedUpsells
      .map((upsell) => upsell.upsell_identifier)
      .includes(identifier)
  );
};
