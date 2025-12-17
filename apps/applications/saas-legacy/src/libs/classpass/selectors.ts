import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import {
  getAllAssociatedEstablishment,
  getAllEstablishmentsDict,
} from '#src/libs/establishment/selectors';

export const getPartnershipByIdentifier = (
  state: RootState,
  identifier: string,
) => state.partnership.byId[identifier];

export const getPartnershipEstablishmentMergeList = (state: RootState) =>
  state.partnership.partnershipEstablishmentMerge.items;

export const hasPartnershipByIdentifier = (
  state: RootState,
  identifier: string,
) => !!getPartnershipByIdentifier(state, identifier);

export const getMergedEstablishmentsWithAssociation = createSelector(
  [
    getPartnershipEstablishmentMergeList,
    getAllAssociatedEstablishment,
    getAllEstablishmentsDict,
  ],
  (
    partnershipEstablishmentMergeList,
    associatedEstablishments,
    establishmentsById,
  ) => {
    if (
      !partnershipEstablishmentMergeList ||
      !establishmentsById ||
      !associatedEstablishments
    )
      return [];
    return partnershipEstablishmentMergeList.map(
      (partnershipEstablishmentMerge) => ({
        venueId: partnershipEstablishmentMerge.reference_establishment,
        referenceEstablishment: Object.values(establishmentsById).find(
          (establishment) =>
            establishment.associatedestablishment_set[0] ===
            partnershipEstablishmentMerge.reference_establishment,
        )?.title,
        associatedEstablishments: associatedEstablishments
          .filter(
            (associatedEstablishment) =>
              associatedEstablishment.partnership_merged_as ===
              partnershipEstablishmentMerge.id,
          )
          .map(
            (associatedEstablishment) =>
              establishmentsById[associatedEstablishment.establishment]?.title,
          ),
      }),
    );
  },
);
