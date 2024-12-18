import get from 'lodash/get';
import every from 'lodash/every';
import values from 'lodash/values';
import last from 'lodash/last';
import { ObjectLevelPermissions } from '#src/libs/role/types';

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

/**
 * Handle the associated permission whenever `offer.meta_activity` is a workshop or not
 * @param isOfferMetaActivityWorkshop boolean passed from `offer.meta_activity.is_workshop`
 * @param hasActivityPermission boolean for a activity related permission
 * @param hasWorkshopPermission boolean for a workshop related permission
 * @returns {boolean}
 * @example
 * <ObjectLevelPermissionProvider
 *   requiredPermission={[
 *     'reservation.activity.allowed_actions.attendance',
 *     'reservation.workshop.allowed_actions.attendance',
 *   ]}
 * >
 *   {([hasActivityAttendancePermission, hasWorkshopAttendancePermission]) =>
 *     <button
 *       onClick={
 *         getActivityWorkshopPermission(
 *           props.offer.meta_activity.is_workshop,
 *           hasActivityAttendancePermission,
 *           hasWorkshopAttendancePermission,
 *         ) && props.onToggleAttendance
 *       }
 *     />
 *   }
 * </ObjectLevelPermissionProvider>
 */
export const getActivityWorkshopPermission = (
  isOfferMetaActivityWorkshop: boolean,
  hasActivityPermission: boolean,
  hasWorkshopPermission: boolean,
) => {
  const isWorkshopAndHasPermission =
    isOfferMetaActivityWorkshop && hasWorkshopPermission;
  const isActivityAndHasPermission =
    !isOfferMetaActivityWorkshop && hasActivityPermission;

  return isWorkshopAndHasPermission || isActivityAndHasPermission;
};
