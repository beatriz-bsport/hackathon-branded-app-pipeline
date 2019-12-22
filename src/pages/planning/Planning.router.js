// @flow

import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import Planning from './Planning.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { Moment } from '../../i18n';

import { offer as offerActions } from '../../actions';
import {
  getManagerOffersFiltered,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../../libs/offer/selectors';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';

const formatDate = (date) => {
  const formatedDate = Moment(date, 'DD-MM-YYYY');
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
  connect(
    (state) => ({
      offers: withMetaActivity(
        withEstablishment(withCoach(getManagerOffersFiltered)),
      )(state),
    }),

    {
      fetchOffersByDay: offerActions.fetchOffersByDay,
      pushRouter: push,
      replaceRouter: replace,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    },
  ),
  withProps(({ fetchCoachBulk, fetchEstablishmentBulk, fetchOffersByDay }) => ({
    fetchOffersByDay: (...params) =>
      fetchOffersByDay(...params, {
        onSuccess: (offers) => {
          fetchCoachBulk([
            ...offers.map((o) => o.coach),
            ...offers.map((o) => o.coach_override),
          ]);
          fetchEstablishmentBulk([
            ...offers.map((o) => o.establishment),
            ...offers.map((o) => o.establishment_override),
          ]);
        },
      }),
  })),
  routerParamsToProps({
    offerId: 'offerId:number',
    date: 'day:number',
    month: 'month:number',
    year: 'year:number',
  }),
  withProps(({ offers, day, month, year, offerId }) => {
    const date = formatDate(`${day}-${month}-${year}`);
    const selectedOffer = offerId
      ? offers.find((offer) => offer.id === offerId)
      : null;
    return {
      date: date.format('YYYY-MM-DD'),
      selectedOffer,
    };
  }),
  withProps(({ day, month, year, pushRouter }) => ({
    loadOfferData: (offer) => {
      pushRouter(`/calendar/${year}/${month}/${day}/${offer.id}`);
    },
  })),
)(Planning);
