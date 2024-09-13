import { RootState } from '../../reducers';

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
