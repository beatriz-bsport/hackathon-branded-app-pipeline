import useAsyncFn from '#src/hooks/useAsyncFn';
import { createPartnershipVenue, getPartnershipVenues } from './api';

export const useGetPartnershipVenues = (partnershipId: number) => {
  const doFetchPartnershipVenues = async () => {
    const partnershipVenueResponse = await getPartnershipVenues({
      partnership: partnershipId,
    });

    return partnershipVenueResponse.data;
  };

  return useAsyncFn(doFetchPartnershipVenues, [partnershipId]);
};

export const useCreatePartnershipVenue = (partnershipId: number) => {
  const doCreatePartnershipVenues = async (data: {
    establishmentIds: number[];
  }) => {
    const partnershipVenueResponse = await createPartnershipVenue({
      establishment_group: data.establishmentIds,
      partnership: partnershipId,
    });

    return partnershipVenueResponse.data;
  };

  return useAsyncFn(doCreatePartnershipVenues, [partnershipId]);
};
