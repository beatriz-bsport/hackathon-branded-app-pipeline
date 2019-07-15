// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push } from 'react-router-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import type { Establishment, Offer } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import { offer as offerActions } from '../../actions';

import EstablishmentDetail from '../../libs/establishment/components/EstablishmentDetail.component';

type Props = {
  id: number,
  timetableLoading: boolean,
  offers: Array<Offer>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  establishment: Establishment,
  startUpdateEstablishment: (*) => void,
};

export const EstablishmentDetails = (props: Props) => (
  <EstablishmentDetail
    timetableLoading={props.timetableLoading}
    offers={props.offers}
    fetchOffersByDay={props.fetchOffersByDay}
    goToOffer={props.goToOffer}
    establishment={props.establishment}
    goToEditForm={() => props.startUpdateEstablishment(props.id)}
  />
);

export default compose(
  withNamespaces(),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      establishment: (state.establishment.all || []).find((e) => e.id === id),
      offers: state.offer.offers,
    }),
    {
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      fetchOffersByDay: offerActions.fetchOffersByDay,
      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
    },
  ),
  withDrawer(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(EstablishmentDetails);
