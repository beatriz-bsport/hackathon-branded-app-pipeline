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
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import { offer as offerActions } from '../../actions';
import EstablishmentDetail from '../../libs/establishment/components/EstablishmentDetail.component';
import EstablishmentDeleteDialog from '../../libs/establishment/components/EstablishmentDeleteDialog.component';
import {
  fetchEstablishmentDetail,
  deleteEstablishment,
} from '../../libs/establishment/actions';
import { checkCanDeleteEstablishment as canDeleteEstablishmentAPI } from '../../libs/establishment/api';

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
  goToList: () => void,
  deleteEstablishment: (id: number) => void,
};

type State = {
  deleteOpen: boolean,
};

export class EstablishmentDetails extends React.Component<Props, State> {
  state = {
    deleteOpen: false,
  };

  componentWillMount() {
    this.props.fetchEstablishment(this.props.id);
  }

  render() {
    if (this.props.loading || !this.props.establishment) {
      return <LinearProgress />;
    }
    return (
      <div>
        <EstablishmentDetail
          timetableLoading={this.props.timetableLoading}
          offers={this.props.offers}
          fetchOffersByDay={this.props.fetchOffersByDay}
          goToOffer={this.props.goToOffer}
          establishment={this.props.establishment}
        />
        <BottomActionButtons
          onEdit={() => this.props.startUpdateEstablishment(this.props.id)}
          onDelete={() => this.setState({ deleteOpen: true })}
        />
        <EstablishmentDeleteDialog
          establishmentId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
          canDeleteEstablishmentChecker={canDeleteEstablishmentAPI}
          deleteEstablishment={() => {
            this.props.deleteEstablishment(this.props.id, {
              onSuccess: this.props.goToList,
            });
          }}
        />
      </div>
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
      goToList: () => push('/establishment'),
      deleteEstablishment,
    },
  ),
  withDrawer(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(EstablishmentDetails);
