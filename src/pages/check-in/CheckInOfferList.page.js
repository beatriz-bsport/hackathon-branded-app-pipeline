// @flow
//
import React from 'react';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';

import { fetchOffersByDay as fetchOffersByDayAction } from '../../libs/offer/actions';
import {
  getOffersByDay,
  withCoach,
  withEstablishment,
} from '../../libs/offer/selectors';

import { getAllEstablishments } from '../../libs/establishment/selectors';
import {
  fetchEstablishments,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import type { Establishment } from '../../libs/establishment/types';

import CheckInOfferList from '../../libs/check-in/components/CheckInOfferList.component';

type Props = {
  offers: Array<Offer>,
  establishments: Array<Establishment>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  fetchEstablishments: () => void,
  onOfferSelected: (*) => void,
  offersLoading: boolean,
  classes: Object,
};

export class CheckInOfferListPage extends React.Component<Props> {
  componentWillMount() {
    this.refreshData();
  }

  refreshData = () => {
    this.props.fetchEstablishments();
    const date = moment();
    this.props.fetchOffersByDay({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    });
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <CheckInOfferList
          offers={this.props.offers}
          offersLoading={this.props.offersLoading}
          establishments={this.props.establishments}
          refreshData={this.refreshData}
          onOfferSelected={this.props.onOfferSelected}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      offers: withCoach(withEstablishment(getOffersByDay))(state),
      offersLoading: state.offer.byDay.loading,
      establishments: getAllEstablishments(state),
    }),
    {
      fetchEstablishments,
      fetchOffersByDay: fetchOffersByDayAction,
      onOfferSelected: (offerId: number) =>
        routerPush(`/check-in/offer/${offerId}`),
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
)(CheckInOfferListPage);
