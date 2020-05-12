// @flow

import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import Planning from './Planning.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { Moment } from '../../i18n';

import { fetchOffersByDay as fetchOffersByDayAction } from '../../libs/offer/actions';
import {
  getManagerOffersFiltered,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../../libs/offer/selectors';
import { fetchMetaActivityBulk } from '../../libs/meta-activity/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';

const formatDate = (date) => {
  const formatedDate = Moment(date);
  return formatedDate.isValid() ? formatedDate : Moment();
};

export default function PlanningRouter() {
  const momentDate = Moment();
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
      <Redirect
        from="/"
        to={`/calendar/${momentDate.year()}/${momentDate.month() +
          1}/${momentDate.date()}`}
      />
    </Switch>
  );
}

const PlanningWithDateAndOffer = compose(
  routerParamsToProps({
    offerId: 'offerId:number',
    date: 'day:number',
    month: 'month:number',
    year: 'year:number',
  }),
  connect(
    (state) => ({
      offers: withMetaActivity(
        withEstablishment(withCoach(getManagerOffersFiltered)),
      )(state),
    }),

    {
      fetchOffersByDay: fetchOffersByDayAction,
      fetchMetaActivityBulk,
      pushRouter: push,
      replaceRouter: replace,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    },
  ),
  withHandlers({
    loadOfferData: ({ day, month, year, pushRouter }) => (offer) =>
      pushRouter(`/calendar/${year}/${month}/${day}/${offer.id}`),
    fetchOffersByDay: ({
      fetchCoachBulk,
      fetchEstablishmentBulk,
      fetchOffersByDay,
      fetchMetaActivityBulk,
    }) => (...params) => {
      fetchOffersByDay(...params, {
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
    console.log(selectedOffer);
    return {
      date: date.format('YYYY-MM-DD'),
      selectedOffer,
    };
  }),
)(Planning);
