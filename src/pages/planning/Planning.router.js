// @flow

import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import Planning from './Planning.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { Moment } from '../../i18n';

import {
  fetchOffersByDay as fetchOffersByDayAction,
  listOffersWithPendingReplacementRequestIds as listOffersWithPendingReplacementRequestIdsAction,
} from '../../libs/offer/actions';
import {
  getManagerOffersFiltered,
  withMetaActivity,
  withCoach,
  withEstablishment,
  withGender,
  withTags,
  getOfferHasPendingReplacementRequest,
} from '../../libs/offer/selectors';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchGroupsOfferList as fetchGroupsOfferListAction } from '#libs/group-offer/actions';

import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { withCustomLevel } from '#libs/level/selectors';
import { withGroup } from '#libs/group-offer/selectors';

import { TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS } from '#libs/platform-tutorial/constant';
import { platformTutorialActivated } from '#libs/platform-tutorial/utils';

const formatDate = (date) => {
  const formatedDate = Moment(date);
  return formatedDate.isValid() ? formatedDate : Moment();
};

export function PlanningRouter({ location }: { location: Location }) {
  const momentDate = Moment();

  const getfallBack = () => {
    const base = `/calendar/${momentDate.year()}/${
      momentDate.month() + 1
    }/${momentDate.date()}`;
    if (!platformTutorialActivated()) {
      return base;
    }

    if (
      location.search.includes(`?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`)
    ) {
      return `${base}/?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`;
    }

    return base;
  };
  return (
    <Switch>
      <Route
        path="/calendar/:year/:month/:date/:offerId"
        component={PlanningWithDateAndOffer}
      />
      <Route
        path="/calendar/:year/:month/:date"
        component={PlanningWithDateAndOffer}
      />
      <Redirect from="/" to={getfallBack()} />
    </Switch>
  );
}

export default compose(withRouter)(PlanningRouter);
const PlanningWithDateAndOffer = compose(
  routerParamsToProps({
    offerId: 'offerId:number',
    date: 'day:number',
    month: 'month:number',
    year: 'year:number',
  }),
  connect(
    (state) => ({
      offers: withTags(
        withMetaActivity(
          withCustomLevel(
            withEstablishment(
              withGroup(withCoach(withGender(getManagerOffersFiltered))),
            ),
          ),
        ),
      )(state),
      getHasPendingReplacementRequest:
        getOfferHasPendingReplacementRequest(state),
    }),

    {
      fetchOffersByDayActionDisptach: fetchOffersByDayAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      pushRouter: push,
      replaceRouter: replace,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchGroupsOfferList: fetchGroupsOfferListAction,
      listOffersWithPendingReplacementRequestIds:
        listOffersWithPendingReplacementRequestIdsAction,
    },
  ),
  withHandlers({
    loadOfferData:
      ({ day, month, year, pushRouter }) =>
      (offer) =>
        pushRouter(`/calendar/${year}/${month}/${day}/${offer.id}`),
    fetchOffersByDay:
      ({
        fetchCoachBulk,
        fetchEstablishmentBulk,
        fetchOffersByDayActionDisptach,
        fetchMetaActivityBulk,
        fetchGroupsOfferList,
        listOffersWithPendingReplacementRequestIds,
      }) =>
      (params) => {
        fetchOffersByDayActionDisptach(params, {
          onSuccess: (offers) => {
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity));
            fetchCoachBulk([
              ...offers.map((o) => o.coach),
              ...offers.map((o) => o.coach_override),
            ]);
            fetchEstablishmentBulk([
              ...offers.map((o) => o.establishment),
              ...offers.map((o) => o.establishment_override),
            ]);
            listOffersWithPendingReplacementRequestIds(
              offers.map((o) => o.id),
              true,
            );
            const groups = Array.from(new Set(offers?.map((o) => o.group)));
            fetchGroupsOfferList({
              id__in: groups,
              page: 1,
              page_size: groups.length,
            });
          },
        });
      },
  }),
  withProps(({ offers, day, month, year, offerId }) => {
    const date = formatDate(
      `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`,
    );
    const selectedOffer = offerId
      ? offers.find((offer) => offer.id === offerId)
      : null;

    const hybridOfferLinkedToSelectedOffer =
      offerId && selectedOffer
        ? offers.find(
            (offer) =>
              offer && offer.linked_hybrid_offer_id === selectedOffer.id,
          )
        : null;
    return {
      date: date.format('YYYY-MM-DD'),
      selectedOffer,
      hybridOfferLinkedToSelectedOffer,
    };
  }),
)(Planning);
