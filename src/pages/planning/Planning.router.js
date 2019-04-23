// @flow

import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import Planning from './Planning.component';
import { Moment } from '../../i18n';

import {
  offer as offerActions,
  booking as bookingActions,
} from '../../actions';

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

function mapStateToProps(state) {
  return {
    offers: state.offer.offers,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchOffersByDay({ year, month, day }) {
      dispatch(offerActions.fetchOffersByDay({ year, month, day }));
    },
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
    pushRouter(path) {
      dispatch(push(path));
    },
    replaceRouter(path) {
      dispatch(replace(path));
    },
  };
}

const PlanningWithDateAndOffer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ match, offers }) => {
    const date = formatDate(
      `${match.params.date}-${match.params.month}-${match.params.year}`,
    );
    const selectedOffer = match.params.offerId
      ? offers.find((offer) => offer.id === parseInt(match.params.offerId, 10))
      : null;
    return {
      date,
      selectedOffer,
    };
  }),
  withProps(({ replaceRouter, fetchOffersByDay }) => ({
    loadDayData: (dateClicked) => {
      fetchOffersByDay({
        year: dateClicked.year(),
        month: dateClicked.month() + 1,
        day: dateClicked.date(),
      });
      replaceRouter(
        `/calendar/${dateClicked.year()}/${dateClicked.month() +
          1}/${dateClicked.date()}`,
      );
    },
  })),
  withProps(
    ({ date, selectedOffer, fetchBookings, replaceRouter, pushRouter }) => ({
      loadOfferData: (offer) => {
        fetchBookings(offer.id);
        if (selectedOffer) {
          replaceRouter(
            `/calendar/${date.year()}/${date.month() + 1}/${date.date()}/${
              offer.id
            }`,
          );
        } else {
          pushRouter(
            `/calendar/${date.year()}/${date.month() + 1}/${date.date()}/${
              offer.id
            }`,
          );
        }
      },
    }),
  ),
)(Planning);
