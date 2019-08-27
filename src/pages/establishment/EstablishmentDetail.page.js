// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push } from 'react-router-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import type { Establishment, Offer } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { offer as offerActions } from '../../actions';
import { fetchEstablishmentDetail } from '../../libs/establishment/actions';
import EstablishmentDetail from '../../libs/establishment/components/EstablishmentDetail.component';

type Props = {
  id: number,
  timetableLoading: boolean,
  offers: Array<Offer>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  establishment: Establishment,
  startUpdateEstablishment: (*) => void,
  fetchEstablishment: (id: number) => void,
  loading: boolean,
};

export class EstablishmentDetails extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchEstablishment(this.props.id);
  }

  render() {
    if (this.props.loading || !this.props.establishment) {
      return <LinearProgress />;
    }
    return (
      <EstablishmentDetail
        timetableLoading={this.props.timetableLoading}
        offers={this.props.offers}
        fetchOffersByDay={this.props.fetchOffersByDay}
        goToOffer={this.props.goToOffer}
        establishment={this.props.establishment}
        goToEditForm={() => this.props.startUpdateEstablishment(this.props.id)}
      />
    );
  }
}

export default compose(
  withNamespaces(),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state) => ({
      establishment: state.establishment.detail.data,
      loading: state.establishment.detail.loading,
      offers: state.offer.offers,
    }),
    {
      fetchEstablishment: fetchEstablishmentDetail,
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
