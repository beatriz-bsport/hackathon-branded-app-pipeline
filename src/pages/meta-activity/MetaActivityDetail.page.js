// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import {
  deleteMetaActivity,
  fetchAllActivities as fetchAllMetactivities,
} from '../../libs/meta-activity/actions/meta-activity.actions';
import { getMetaActivities } from '../../libs/meta-activity/selectors';
import { getEventsByMetaActivity } from '../../libs/offer/selectors';
import { fetchMetaActivityOffers } from '../../actions/offer.actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

type Props = {
  id: number,
  metaActivity: MetaActivityType,
  metaActivityImages: Array<Object>,
  fetchAllMetactivities: () => void,

  loading: boolean,
  offersLoading: boolean,

  events: Array<Event>,
  offers: Array<Offer>,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  fetchMetaActivityOffers: (id: number) => void,

  createActivityOffers: (id: number) => void,
  goToOffer: (Offer) => void,
  goToList: () => void,
  onEdit: (id: number) => void,
  deleteMetaActivity: (id: number) => void,

  classes: Object,
};

type State = {
  deleteOpen: boolean,
};

export class MetaActivity extends Component<Props, State> {
  state = { deleteOpen: false };

  componentDidMount() {
    this.props.fetchAllMetactivities();
    if (this.props.id) {
      this.props.fetchMetaActivityOffers(this.props.id);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchAllMetactivities();
      this.props.fetchMetaActivityOffers(this.props.id);
    }
  }

  openCreateOfferForm = () => {
    this.props.createActivityOffers(this.props.id);
  };

  render() {
    if (!this.props.metaActivity) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityDetail
          coverImages={this.props.metaActivityImages}
          metaActivity={this.props.metaActivity}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers}
          goToOffer={this.props.goToOffer}
          offersLoading={this.props.offersLoading}
          openCreateOfferForm={this.openCreateOfferForm}
        />
        <BottomActionButtons
          onEdit={() => this.props.onEdit(this.props.id)}
          onDelete={() => this.setState({ deleteOpen: true })}
        />
        <MetaActivityDeleteDialog
          metaActivityId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={() => {
            this.props.deleteMetaActivity(this.props.id, {
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
    paddingBottom: theme.spacing.unit * 12,
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      loading: state.metaActivity.loading,
      metaActivities: getMetaActivities(state),
      metaActivity: getMetaActivities(state).find((ma) => ma.id === id),
      events: getEventsByMetaActivity(state),
      offers: state.offer.offers,
      offersLoading: state.offer.byDay.loading,
    }),
    {
      fetchAllMetactivities,
      fetchOffersByDay: offerActions.fetchOffersByDay,
      fetchMetaActivityOffers,
      push: routerPush,
      deleteMetaActivity,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/activity'),
      onEdit: (id) => routerPush(`/activity/${id}/edit`),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
    },
  ),
  withTitle(({ metaActivity }) => (metaActivity ? metaActivity.name : '')),
)(MetaActivity);
