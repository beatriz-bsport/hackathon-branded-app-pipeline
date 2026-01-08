import useAsyncFn from '#src/hooks/useAsyncFn';
import {
  activatePartnershipVenue,
  createPartnershipVenue,
  deletePartnershipVenue,
  getPartnershipVenues,
  updatePartnershipVenue,
} from './api';

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

export const useDeletePartnershipVenue = () => {
  const doDeletePartnershipVenue = async (venueId: string) => {
    await deletePartnershipVenue(venueId);
  };

  return useAsyncFn(doDeletePartnershipVenue, []);
};

export const useUpdatePartnershipVenue = (partnershipId: number) => {
  const doUpdatePartnershipVenue = async (
    venueId: string,
    data: { establishmentIds: number[] },
  ) => {
    const partnershipVenueResponse = await updatePartnershipVenue(venueId, {
      partnership: partnershipId,
      establishment_group: data.establishmentIds,
    });

    return partnershipVenueResponse.data;
  };

  return useAsyncFn(doUpdatePartnershipVenue, [partnershipId]);
};

export const useActivatePartnershipVenue = () => {
  const doActivatePartnershipVenue = async (venueId: string) => {
    await activatePartnershipVenue(venueId);
  };

  return useAsyncFn(doActivatePartnershipVenue, []);
};
