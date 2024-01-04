import Fuse from 'fuse.js';

import type { Establishment } from '#libs/establishment/types';
import type { Coach } from '#libs/associated-coach/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import { Offer } from '#libs/offer/types';

export const doTextSearch = (
  searchText: string,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  offers: Array<Offer>,
) => {
  let estIds = null;
  let actIds = null;
  let coachIds = null;
  let offerIds = null;
  if (searchText) {
    const fuseEstablishments = new Fuse(establishments, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['title'],
    });
    const resultEstablishments = fuseEstablishments.search(searchText);
    estIds = resultEstablishments.map((est) => est.id);

    const fuseMetaActivities = new Fuse(metaActivities, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['name'],
    });
    const resultMetaActivities = fuseMetaActivities.search(searchText);
    actIds = resultMetaActivities.map((act) => act.id);

    const fuseCoaches = new Fuse(coaches, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['name'],
    });
    const resultCoaches = fuseCoaches.search(searchText);
    coachIds = resultCoaches.map((coach) => coach.id);

    const fuseOffers = new Fuse(offers, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['name_override'],
    });
    const resultOffers = fuseOffers.search(searchText);
    offerIds = resultOffers.map((offer) => offer.id);
  }
  return [coachIds, estIds, actIds, offerIds];
};
