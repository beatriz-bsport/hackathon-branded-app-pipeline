/**
 * This file provides utility functions for managing and retrieving data
 * related to filters and establishments on the check-in tablet application.
 * It utilizes local storage for storing filter configurations and a minimal list
 * of establishments to ensure data persistence across page refreshes.
 */

import uniq from 'lodash/uniq';
import pick from 'lodash/pick';

import type { TFunction } from 'i18next';
import {
  LOCAL_STORAGE_KEY_FILTERS_CHECK_IN_TABLET,
  LOCAL_STORAGE_KEY_MINIMAL_ESTABLISHMENT_LIST,
} from '#libs/check-in/constants';

import type { OfferFilter } from '#libs/offer/types';
import type { Establishment } from '#libs/establishment/types';
import type { MemberWithBooking } from '#libs/member/types';
import type { SpotInformation } from '#libs/spot-scheduling/types';

// -------------------------FILTER CONFIGURATION-------------------------

/**
 * Updates the local storage with the provided filters for the check-in tablet.
 * @param {OfferFilter} newFilters - New filter configuration to be stored.
 */
export const updateLocalStorageFilters = (newFilters: OfferFilter) =>
  localStorage.setItem(
    LOCAL_STORAGE_KEY_FILTERS_CHECK_IN_TABLET,
    JSON.stringify(newFilters),
  );

/**
 * Retrieves the filter configuration stored in the local storage.
 * @returns {OfferFilter} - Filter configuration.
 */
const getLocalStorageFilters = (): OfferFilter =>
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FILTERS_CHECK_IN_TABLET));

/**
 * Retrieves the establishments filter from the stored filter configuration in local storage.
 * @returns {number[]} - Array of establishment IDs.
 */
const getLocalStorageFiltersEstablishments = (): number[] =>
  getLocalStorageFilters()?.establishments ?? [];

/**
 * Merges the establishments from the stored filters and the provided filter state.
 * @param {number[]} filterEstablishmentsState - The establishments from the current filter state.
 * @returns {number[]} - The updated list of establishments.
 */
const getFiltersEstablishments = (
  filterEstablishmentsState: number[],
): number[] =>
  uniq([
    ...getLocalStorageFiltersEstablishments(),
    ...filterEstablishmentsState,
  ]);

/**
 * Retrieves the check-in filters by merging the current filter state with
 * the stored filter configuration in local storage.
 * @param {OfferFilter} filterState - The current filter state.
 * @returns {OfferFilter} - The updated filter configuration.
 */
export const getOfferFilters = (filterState: OfferFilter): OfferFilter => ({
  ...filterState,
  establishments: getFiltersEstablishments(filterState?.establishments ?? []),
});

// --------------------------ESTABLISHMENT LIST--------------------------

/**
 * Represents a minimal subset of establishment data used to store data in
 * the local storage to ensure data persistence across page refreshes.
 */
type EstablishmentMinimal = Pick<Establishment, 'id' | 'title' | 'location'>;

/**
 * Updates the local storage with a minimal list of establishments by extracting
 * necessary information from the provided list of establishments.
 * @param {Establishment[]} establishments - The full list of establishments.
 */
export const updateLocalStorageEstablishementList = (
  establishments: Establishment[],
) => {
  if (establishments?.length > 0)
    localStorage.setItem(
      LOCAL_STORAGE_KEY_MINIMAL_ESTABLISHMENT_LIST,
      JSON.stringify(
        establishments.map<EstablishmentMinimal>((establishment) =>
          pick(establishment, ['id', 'title', 'location']),
        ),
      ),
    );
};

/**
 * Retrieves the minimal list of establishments from the local storage.
 * @returns {EstablishmentMinimal[]} - Stored minimal establishment list.
 */
export const getLocalStorageEstablishementList = (): EstablishmentMinimal[] =>
  JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_MINIMAL_ESTABLISHMENT_LIST),
  ) ?? [];

/**
 * Checks the validity of the stored minimal establishment list by ensuring that
 * each establishment includes the necessary properties: 'id', 'title', and 'location'.
 * These properties are essential for rendering establishments in the EstablishmentSelector.
= * @returns {boolean} - True if the stored establishment list is valid, otherwise false.
 */
export const isLocalStorageEstablishementListValid = (): boolean => {
  const localStorageEstablishmentList = getLocalStorageEstablishementList();
  return (
    localStorageEstablishmentList?.length > 0 &&
    localStorageEstablishmentList?.reduce((acc, establishment) => {
      return (
        acc &&
        !!establishment?.id &&
        !!establishment?.title &&
        !!establishment?.location
      );
    }, true)
  );
};

/**

Retrieves the display text for a spot if it exists in the member object.
@param {MemberWithBooking} member - The member object.
@param {TFunction} t - The translation function.
@returns {string} The spot display text if it exists, otherwise translated text for a spot unassigned.
*/
export const getSpotDisplayText = (
  member: MemberWithBooking,
  t: TFunction,
): string => {
  const spotId = member?.booking?.spot_id;
  const spotInformation = member?.booking?.spot_information;

  if (!spotId || !spotInformation) {
    return t('confirmPage.spotUnassigned');
  }

  return `${(spotInformation as SpotInformation).name || 'Spot'} ${
    (spotInformation as SpotInformation).prefix || ''
  }${spotId}`;
};
