// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import { getWorkshops } from '../../libs/meta-activity/selectors';
import { getEventsByMetaActivity } from '../../libs/offer/selectors';
import { fetchMetaActivityOffers } from '../../actions/offer.actions';
import {
  deleteWorkshop,
  fetchAll as fetchAllWorkshops,
} from '../../libs/meta-activity/actions/workshop-activity.actions';
import { checkCanDeleteMetaActivity as canDeleteWorkshopAPI } from '../../libs/meta-activity/api/common';

type Props = {
  id: number,
  workshopActivity: MetaActivityType,
  loading: boolean,
  fetchAllWorkshops: () => void,
  fetchMetaActivityOffers: (id: number) => void,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  offersLoading: boolean,
  events: Array<Event>,
  fetchAllWorkshops: () => void,
  offers: Array<Offer>,

  goToList: () => void,
  deleteWorkshop: (
    id: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  onEdit: (id: number) => void,
  createActivityOffers: (id: number) => void,
  goToOffer: (offer: Offer) => void,
  classes: Object,
};

type State = {
  editable: boolean,
  data: *,
  sportCategories: Array<number>,
  dateSelected: Object,
  deleteOpen: boolean,
};

export class WorkshopActivity extends Component<Props, State> {
  state = { deleteOpen: false };

  componentDidMount() {
    this.props.fetchAllWorkshops();
    if (this.props.id) {
      this.props.fetchMetaActivityOffers(this.props.id);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchAllWorkshops();
      this.props.fetchMetaActivityOffers(this.props.id);
    }
  }

  openCreateOfferForm = () => {
    this.props.createActivityOffers(this.props.id);
  };

  render() {
    if (!this.props.workshopActivity) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityDetail
          metaActivity={this.props.workshopActivity}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers}
          offersLoading={this.props.offersLoading}
          goToOffer={this.props.goToOffer}
          createActivityOffers={this.openCreateOfferForm}
        />
        <BottomActionButtons
          onEdit={() => this.props.onEdit(this.props.id)}
          onDelete={() => this.setState({ deleteOpen: true })}
        />
        <WorkshopDeleteDialog
          workshopId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
          canDeleteWorkshopChecker={canDeleteWorkshopAPI}
          deleteWorkshop={() => {
            this.props.deleteWorkshop(this.props.id, {
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
  withNamespaces(),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      id,
      loading: state.metaActivity.loading,
      workshopActivities: getWorkshops(state),
      stats: state.stats.activities,
      workshopActivity: getWorkshops(state).find((ma) => ma.id === id),
      events: getEventsByMetaActivity(state),
      offers: state.offer.offers,
      offersLoading: state.offer.byDay.loading,
    }),
    {
      fetchAllWorkshops,
      fetchOffersByDay: offerActions.fetchOffersByDay,
      fetchMetaActivityOffers,
      deleteWorkshop,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/workshop-activity'),
      onEdit: (id) => routerPush(`/workshop-activity/${id}/edit`),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
    },
  ),
  withDrawer(({ id, workshopActivities }) => {
    if (id) {
      const workshopActivity = (workshopActivities || []).filter(
        (m) => m.id === id,
      );
      if ((workshopActivity || []).length === 1) {
        return workshopActivity[0].name;
      }
    }
    return '';
  }),
)(WorkshopActivity);
