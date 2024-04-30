import { useEffect, useMemo, useState } from 'react';
import uniq from 'lodash/uniq';
import Immutable from 'seamless-immutable';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';

/**
 * (By location, we mean the address of the establishments, if the company does not have multi-location upsell,
 * and the establishment group if it does)
 *
 * A staff user can only be assigned to one location at a time.
 * On the contrary, it can be assigned to multiple establishments at once.
 *
 * This hook checks that the establishments assigned to the staff user share the same location.
 * It can also be used to check and parse the location data of a member visit. (see examples)
 *
 * If and only if the staff has no assigned establishment, the location blocker will be displayed.
 *
 * Finally, the hook returns the location of the staff user, in order to display it.
 *
 * @param {Record<string, Establishment>} establishmentsData - The establishments data of the company
 * @param {number[]} establishmentsToCheck - The establishments we want to check
 * @param {EstablishmentGroupAPI[]} establishmentGroups - The establishment groups of the company
 *
 * @example
 * // To check the staff location and display the location blocker if needed
 * const {
 *  showLocationBlocker,
 *  staffLocationAddress,
 *  staffLocationEstablishmentGroup,
 *  establishmentObjects: establishmentsInRole,
 * } = useCheckAccessControlLocationSetup({
 *  establishmentsData,
 *  establishmentsToCheck: establishmentsSelectedInRole,
 *  establishmentGroups,
 *  enableMultilocalization: theme.enable_multi_localization,
 * });
 *
 * @example
 * // To check the location of a member visit and display it
 * const {
 *  staffLocationAddress,
 *  staffLocationEstablishmentGroup,
 *  establishmentObjects,
 * } = useCheckAccessControlLocationSetup({
 *  establishmentsData,
 *  establishmentsToCheck: memberVisit.establishments,
 *  establishmentGroups,
 *  enableMultilocalization: theme.enable_multi_localization,
 * });
 *
 * @returns
 * - showLocationBlocker: boolean
 * - establishmentObjects: Establishment[]
 * - staffLocationAddress: string | null
 * - staffLocationEstablishmentGroup: EstablishmentGroupAPI | null
 */
export const useCheckAccessControlLocationSetup = ({
  establishmentsData,
  establishmentsToCheck,
  establishmentGroups,
}: {
  establishmentsData: Record<string, Establishment>;
  establishmentsToCheck: number[];
  establishmentGroups: EstablishmentGroupAPI[];
}) => {
  const [showLocationBlocker, setShowLocationBlocker] = useState(false);

  const establishmentObjects = useMemo(
    () =>
      establishmentsToCheck
        .map((establishmentId) => establishmentsData?.[establishmentId])
        .filter((establishment) => !!establishment),
    [establishmentsData, establishmentsToCheck],
  );

  const addresses = useMemo(
    () =>
      establishmentObjects.map(
        (establishment) => establishment?.location.address,
      ),
    [establishmentObjects],
  );

  const allAddressesAreDefinedAndEqual = useMemo(
    () =>
      uniq(addresses).length === 1 &&
      addresses.length === establishmentsToCheck.length &&
      !!addresses[0],
    [addresses, establishmentsToCheck],
  );

  const uniqueSharedAddress = useMemo(
    () => (allAddressesAreDefinedAndEqual ? addresses[0] : null),
    [addresses, allAddressesAreDefinedAndEqual],
  );

  const establishmentGroupsContainingAllEstablishmentsInRole = useMemo(
    () =>
      establishmentGroups?.filter((establishmentGroup) =>
        establishmentsToCheck.every((establishmentId) =>
          establishmentGroup.establishment.includes(establishmentId),
        ),
      ),
    [establishmentGroups, establishmentsToCheck],
  );

  const allEstablishmentsShareOneUniqueLocation = useMemo(
    () => establishmentGroupsContainingAllEstablishmentsInRole?.length === 1,
    [establishmentGroupsContainingAllEstablishmentsInRole],
  );

  const uniqueSharedEstablishmentGroup = useMemo(
    () =>
      allEstablishmentsShareOneUniqueLocation
        ? establishmentGroupsContainingAllEstablishmentsInRole[0]
        : null,
    [
      allEstablishmentsShareOneUniqueLocation,
      establishmentGroupsContainingAllEstablishmentsInRole,
    ],
  );

  useEffect(() => {
    setShowLocationBlocker(!establishmentsToCheck?.length);
  }, [establishmentsToCheck, setShowLocationBlocker]);

  return Immutable({
    showLocationBlocker,
    establishmentObjects,
    staffLocationAddress: uniqueSharedAddress,
    staffLocationEstablishmentGroup: uniqueSharedEstablishmentGroup,
  });
};
