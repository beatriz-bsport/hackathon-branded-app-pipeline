import { buildUrlParams, getAuth } from '#src/http';

import Config from '#src/config';
import {
  PartnershipVenue,
  PartnershipVenueFilters,
} from '#src/libs/partnership/types';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export const getPartnershipVenues = (params: PartnershipVenueFilters) => {
  return getAuth<PartnershipVenue[]>(
    `${API_V1_URI}/partnership/partnership_venue/${buildUrlParams(params)}`,
  );
};
