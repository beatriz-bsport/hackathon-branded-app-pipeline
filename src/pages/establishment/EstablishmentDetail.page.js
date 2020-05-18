// @flow

import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import type { Establishment, Offer } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import {
  fetchOffersByDay as fetchOffersByDayAction,
  fetchEstablishmentEvents as fetchEstablishmentEventsAction,
} from '../../libs/offer/actions';
import EstablishmentDetail from '../../libs/establishment/components/EstablishmentDetail.component';
import EstablishmentDeleteDialog from '../../libs/establishment/components/EstablishmentDeleteDialog.component';
import {
  fetchEstablishmentBulk,
  deleteEstablishment,
} from '../../libs/establishment/actions';
import {
  withEstablishment,
  withCoach,
  getOffersByDay,
  getEventsByEstablishment,
} from '../../libs/offer/selectors';

import { getEstablishment } from '../../libs/establishment/selectors';
import { checkCanDeleteEstablishment as canDeleteEstablishmentAPI } from '../../libs/establishment/api';

type Props = {
  id: number,
  timetableLoading: boolean,
  offers: Array<Offer>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  establishment: Establishment,
  startUpdateEstablishment: (*) => void,
  loading: boolean,
  goToList: () => void,
  deleteEstablishment: (id: number) => void,
  fetchEstablishmentBulk: ([number]) => void,
  events: Array<Event>,
  classes: Object,
};

type State = {
  deleteOpen: boolean,
};

export class EstablishmentDetails extends React.Component<Props, State> {
  state = {
    deleteOpen: false,
  };

  componentDidMount() {
    this.props.fetchEstablishmentBulk([this.props.id]);
  }

  render() {
    if (this.props.loading || !this.props.establishment) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        <EstablishmentDetail
          timetableLoading={this.props.timetableLoading}
          offers={this.props.offers.filter(
            (o) => o.establishment && o.establishment.id === this.props.id,
          )}
          fetchOffersByDay={this.props.fetchOffersByDay}
          goToOffer={this.props.goToOffer}
          establishment={this.props.establishment}
          events={this.props.events}
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

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(12),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      establishment: getEstablishment(state, id),
      loading: state.establishment.detail.loading,
      offers: withEstablishment(withCoach(getOffersByDay))(state),
      events: getEventsByEstablishment(state),
    }),
    {
      fetchEstablishmentBulk,
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      fetchOffersByDay: fetchOffersByDayAction,
      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
      goToList: () => push('/establishment'),
      deleteEstablishment,
      fetchEstablishmentEvents: fetchEstablishmentEventsAction,
    },
  ),
  withProps(({ fetchOffersByDay, fetchEstablishmentEvents, id }) => ({
    fetchOffersByDay: (momentDate) => {
      fetchEstablishmentEvents(id, {
        min_date: momentDate
          .clone()
          .startOf('month')
          .format('YYYY-MM-DD'),
        max_date: momentDate
          .clone()
          .endOf('month')
          .format('YYYY-MM-DD'),
      });
      fetchOffersByDay({
        year: momentDate.year(),
        month: momentDate.month() + 1,
        day: momentDate.date(),
      });
    },
  })),
  withTitle(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(EstablishmentDetails);
