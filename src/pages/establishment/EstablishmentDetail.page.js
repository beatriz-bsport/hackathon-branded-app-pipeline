// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push } from 'react-router-redux';
import type { Establishment, Activity, Offer } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import {
  establishment as establishmentActions,
  offer as offerActions,
} from '../../actions';

import EstablishmentDetail from '../../libs/establishment/EstablishmentDetail.component';

type Props = {
  timetableLoading: boolean,
  activities: Array<Activity>,
  offers: Array<Offer>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  establishment: Establishment,
};

export function EstablishmentDetails(props: Props) {
  return (
    <EstablishmentDetail
      timetableLoading={props.timetableLoading}
      activities={props.activities}
      offers={props.offers}
      fetchOffersByDay={props.fetchOffersByDay}
      goToOffer={props.goToOffer}
      establishment={props.establishment}
    />
  );
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    establishment: (state.establishment.all || []).find((e) => e.id === id),
    offers: state.offer.offers,
    activities: state.activity.all,
  };
}

export default compose(
  withNamespaces(),
  connect(
    mapStateToProps,
    {
      startUpdateEstablishment: establishmentActions.startUpdate,
      fetchOffersByDay: offerActions.fetchOffersByDay,
      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
    },
  ),
  withDrawer(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(EstablishmentDetails);
