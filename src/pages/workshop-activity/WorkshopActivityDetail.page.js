// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import type {
  Offer,
  MetaActivity as MetaActivityType,
  Stat,
} from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions/meta-activity.actions';
import { deleteWorkshop } from '../../libs/meta-activity/actions/workshop-activity.actions';
import { checkCanDeleteMetaActivity as canDeleteWorkshopAPI } from '../../libs/meta-activity/api/common';

type Props = {
  id: number,
  workshopActivity: MetaActivityType,
  loading: boolean,
  stats: Stat,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  events: Array<Event>,
  fetchMetaActivityDetails: (number) => void,
  offers: Array<Offer>,

  goToList: () => void,
  deleteWorkshop: (
    id: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  onEdit: (id: number) => void,
  createActivityOffers: (id: number) => void,
  goToOffer: (offer: Offer) => void,
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
    this.props.fetchMetaActivityDetails(this.props.id);
  }

  render() {
    if (this.props.loading || !this.props.workshopActivity) {
      return <LinearProgress />;
    }
    return (
      <div>
        <MetaActivityDetail
          metaActivity={this.props.workshopActivity}
          stats={this.props.stats}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers}
          goToOffer={this.props.goToOffer}
          createActivityOffers={() =>
            this.props.createActivityOffers(this.props.id)
          }
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
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  editButton: {
    position: 'fixed',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
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
      workshopActivity: state.metaActivity.metaActivity,
      workshopActivities: state.workshopActivity.all,
      stats: state.stats.activities,
      events: state.offer.calendar,
      offers: state.offer.offers,
    }),
    {
      fetchMetaActivityDetails,
      fetchOffersByDay: offerActions.fetchOffersByDay,
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
