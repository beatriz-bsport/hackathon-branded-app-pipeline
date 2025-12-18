import useAsyncFn from '#src/hooks/useAsyncFn';
import { getPartnershipVenues } from './api';

export const useGetPartnershipVenues = (partnershipId: number) => {
  const doFetchPartnershipVenues = async () => {
    const partnershipVenueResponse = await getPartnershipVenues({
      partnership: partnershipId,
    });

    return partnershipVenueResponse.data;
  };

  return useAsyncFn(doFetchPartnershipVenues, [partnershipId]);
};
