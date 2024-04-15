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
 * A staff member can only be assigned to one location at a time.
 * On the contrary, it can be assigned to multiple establishments at once.
 *
 * This hook checks if the staff member is assigned to multiple establishments and if they share the same location.
 *
 * If there is a mistake in the staff configuration, the location blocker will be displayed.
 *
 * Finally, the hook returns the location of the staff member,
 * in order to display it in the member visit (with empty state) page
 *
 * @param {Record<string, Establishment>} establishmentsData - The establishments data of the company
 * @param {number[]} establishmentsSelectedInRole - The establishments linked to the staff role
 * @param {EstablishmentGroupAPI[]} establishmentGroups - The establishment groups of the company
 * @param {boolean} enableMultilocalization - The company has multi-location upsell or not
 *
 * @returns
 * - showLocationBlocker: boolean
 * - establishmentsInRole: Establishment[]
 * - staffLocationAddress: string | null
 * - staffLocationEstablishmentGroup: EstablishmentGroupAPI | null
 */
export const useCheckStaffLocation = ({
  establishmentsData,
  establishmentsSelectedInRole,
  establishmentGroups,
  enableMultilocalization,
}: {
  establishmentsData: Record<string, Establishment>;
  establishmentsSelectedInRole: number[];
  establishmentGroups: EstablishmentGroupAPI[];
  enableMultilocalization: boolean;
}) => {
  const [showLocationBlocker, setShowLocationBlocker] = useState(false);

  const establishmentsInRole = useMemo(
    () =>
      establishmentsSelectedInRole.map(
        (establishmentId) => establishmentsData[establishmentId],
      ),
    [establishmentsData, establishmentsSelectedInRole],
  );

  const addresses = useMemo(
    () =>
      establishmentsInRole.map(
        (establishment) => establishment?.location.address,
      ),
    [establishmentsInRole],
  );

  const allAddressesAreDefinedAndEqual = useMemo(
    () =>
      uniq(addresses).length === 1 &&
      addresses.length === establishmentsSelectedInRole.length &&
      !!addresses[0],
    [addresses, establishmentsSelectedInRole],
  );

  const uniqueSharedAddress = useMemo(
    () => (allAddressesAreDefinedAndEqual ? addresses[0] : null),
    [addresses, allAddressesAreDefinedAndEqual],
  );

  const establishmentGroupsContainingAllEstablishmentsInRole = useMemo(
    () =>
      establishmentGroups?.filter((establishmentGroup) =>
        establishmentsSelectedInRole.every((establishmentId) =>
          establishmentGroup.establishment.includes(establishmentId),
        ),
      ),
    [establishmentGroups, establishmentsSelectedInRole],
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
    if (!establishmentsSelectedInRole?.length) {
      setShowLocationBlocker(true);
    } else if (!Object.keys(establishmentsData).length) {
      setShowLocationBlocker(false);
    } else if (!enableMultilocalization && !allAddressesAreDefinedAndEqual) {
      setShowLocationBlocker(true);
    } else if (
      enableMultilocalization &&
      !allEstablishmentsShareOneUniqueLocation
    ) {
      setShowLocationBlocker(true);
    } else {
      setShowLocationBlocker(false);
    }
  }, [
    establishmentsSelectedInRole,
    enableMultilocalization,
    allAddressesAreDefinedAndEqual,
    allEstablishmentsShareOneUniqueLocation,
    establishmentsData,
  ]);

  return Immutable({
    showLocationBlocker,
    establishmentsInRole,
    staffLocationAddress: uniqueSharedAddress,
    staffLocationEstablishmentGroup: uniqueSharedEstablishmentGroup,
  });
};
