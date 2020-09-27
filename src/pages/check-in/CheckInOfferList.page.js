// @flow
//
import React from 'react';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';

import {
  fetchOffersByDay as fetchOffersByDayAction,
  setFilters as setFiltersAction,
  toogleFilter as toogleFilterAction,
  offersFilterActions,
} from '../../libs/offer/actions';
import {
  getManagerOffersFiltered,
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
  selectedOffers: Array<Offer>,
  establishments: Array<Establishment>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  fetchEstablishments: () => void,
  onOfferSelected: (*) => void,
  offersLoading: boolean,
  classes: Object,
  offerFilters: OfferFilter,
  setFilters: (OfferFilter) => null,
  setOpen: () => null,
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
          offerFilters={this.props.offerFilters}
          setOpen={this.props.setOpen}
          setFilters={this.props.setFilters}
          selectedOffers={this.props.selectedOffers}
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
      offersLoading: state.offer.byDay.loading,
      establishments: withCoach(withEstablishment(getAllEstablishments))(state),
      offerFilters: state.offer.managerFilter.filters,
      offers: withCoach(withEstablishment(getManagerOffersFiltered))(state),
    }),
    {
      fetchEstablishments,
      fetchOffersByDay: fetchOffersByDayAction,
      onOfferSelected: (offerId: number) =>
        routerPush(`/check-in/offer/${offerId}`),
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      setFilters: setFiltersAction,
      setOpen: offersFilterActions.setOpen,
      toogleFilter: toogleFilterAction,
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
