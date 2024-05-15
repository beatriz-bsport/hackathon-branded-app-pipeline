import React from 'react';
import { DateTime } from 'luxon';
import omit from 'lodash/omit';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
// @ts-expect-error
import { omit_list } from '../../../pages/planning/Planning.page';

import { OfferFilter, Offer } from '#libs/offer/types';
import { OptionCallback } from '../../../state/types';

type OfferHandlerHookProps = {
  contextSelected: ChatThreadKinds;
  offerFilters: OfferFilter;
  fetchOffersByDayActionDisptach: (
    params: {
      year: number;
      month: number;
      day: number;
    },
    options: OptionCallback<Offer[]>,
  ) => void;
  fetchAllOffers: (
    params: { min_date: string; max_date: string } & OfferFilter,
  ) => void;
  fetchMetaActivityBulk: (ids: number[]) => void;
  fetchCoachBulk: (ids: number[]) => void;
  fetchEstablishmentBulk: (ids: number[]) => void;
};

export const useOfferHandler = ({
  contextSelected,
  offerFilters,
  fetchAllOffers,
  fetchOffersByDayActionDisptach,
  fetchMetaActivityBulk,
  fetchCoachBulk,
  fetchEstablishmentBulk,
}: OfferHandlerHookProps) => {
  const [date, setDate] = React.useState(DateTime.now().toISODate());

  const fetchRelevantOffers = React.useCallback(() => {
    fetchAllOffers({
      min_date: DateTime.fromISO(date)
        .startOf('month')
        .startOf('week', { useLocaleWeeks: true })
        .toISODate(),
      max_date: DateTime.fromISO(date)
        .endOf('month')
        .endOf('week', { useLocaleWeeks: true })
        .toISODate(),
      ...omit(offerFilters || {}, omit_list(offerFilters, true)),
    });
  }, [fetchAllOffers, offerFilters, date]);

  const fetchOffersByDay = React.useCallback(() => {
    const momentDate = DateTime.fromISO(date);
    fetchOffersByDayActionDisptach(
      {
        year: momentDate.year,
        month: momentDate.month,
        day: momentDate.day,
        ...omit(offerFilters || {}, omit_list(offerFilters, false)),
      },
      {
        onSuccess: (offers) => {
          fetchMetaActivityBulk(offers.map((offer) => offer.meta_activity));
          fetchCoachBulk([
            ...offers.map((offer) => offer.coach),
            ...offers.map((offer) => offer.coach_override),
          ]);
          fetchEstablishmentBulk([
            ...offers.map((offer) => offer.establishment),
          ]);
        },
      },
    );
  }, [
    fetchCoachBulk,
    fetchEstablishmentBulk,
    fetchMetaActivityBulk,
    fetchOffersByDayActionDisptach,
    date,
    offerFilters,
  ]);

  React.useEffect(() => {
    if (contextSelected === ChatThreadKinds.Offer) {
      fetchRelevantOffers();
      fetchOffersByDay();
    }
  }, [contextSelected, fetchRelevantOffers, fetchOffersByDay]);

  const [offerSelected, setOfferSelected] = React.useState<number>(null);
  const handleOfferSelected = React.useCallback(
    (offer: Offer) => setOfferSelected(offer.id),
    [setOfferSelected],
  );
  return [date, setDate, offerSelected, handleOfferSelected];
};
