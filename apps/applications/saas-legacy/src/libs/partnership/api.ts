import {
  buildUrlParams,
  deleteAuth,
  getAuth,
  patchAuth,
  postAuth,
} from '#src/http';

import Config from '#src/config';
import {
  PartnershipVenue,
  PartnershipVenueFilters,
  PartnershipVenuePayload,
} from '#src/libs/partnership/types';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export const getPartnershipVenues = (params: PartnershipVenueFilters) => {
  return getAuth<PartnershipVenue[]>(
    `${API_V1_URI}/partnership/partnership_venue/${buildUrlParams(params)}`,
  );
};

export const createPartnershipVenue = (data: PartnershipVenuePayload) => {
  return postAuth<PartnershipVenue>(
    `${API_V1_URI}/partnership/partnership_venue/create_venue/`,
    data,
  );
};

export const deletePartnershipVenue = (venueId: string) => {
  return deleteAuth<PartnershipVenue>(
    `${API_V1_URI}/partnership/partnership_venue/${venueId}/`,
  );
};

export const updatePartnershipVenue = (
  venueId: string,
  data: PartnershipVenuePayload,
) => {
  return patchAuth<PartnershipVenue>(
    `${API_V1_URI}/partnership/partnership_venue/${venueId}/`,
    data,
  );
};
