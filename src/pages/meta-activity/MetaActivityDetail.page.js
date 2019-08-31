// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';

import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import {
  deleteMetaActivity,
  fetchMetaActivityDetails,
} from '../../libs/meta-activity/actions/meta-activity.actions';
import { getMetaActivities } from '../../libs/meta-activity/selectors';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

type Props = {
  id: number,
  metaActivity: MetaActivityType,
  metaActivityImages: Array<Object>,
  fetchMetaActivityDetails: (number) => void,
  loading: boolean,

  events: Array<Event>,
  offers: Array<Offer>,
  fetchOffersByDay: (year: number, month: number, day: number) => void,

  createActivityOffers: (id: number) => void,
  goToOffer: (Offer) => void,
  goToList: () => void,
  onEdit: (id: number) => void,
  deleteMetaActivity: (id: number) => void,
};

type State = {
  deleteOpen: boolean,
};

export class MetaActivity extends Component<Props, State> {
  state = { deleteOpen: false };

  componentDidMount() {
    this.props.fetchMetaActivityDetails(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchMetaActivityDetails(this.props.id);
    }
  }

  render() {
    if (this.props.loading || !this.props.metaActivity) {
      return <LinearProgress />;
    }
    return (
      <div>
        <MetaActivityDetail
          coverImages={this.props.metaActivityImages}
          metaActivity={this.props.metaActivity}
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

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state) => ({
      loading: state.metaActivity.loading,
      metaActivity: state.metaActivity.metaActivity,
      metaActivities: getMetaActivities(state),
      metaActivityImages:
        (state.metaActivity.metaActivity &&
          state.metaActivity.metaActivity.images) ||
        [],
      events: state.offer.calendar,
      offers: state.offer.offers,
    }),
    {
      fetchMetaActivityDetails,
      fetchOffersByDay: offerActions.fetchOffersByDay,
      push: routerPush,
      deleteMetaActivity,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/activity'),
      onEdit: (id) => routerPush(`/activity/${id}/edit`),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
    },
  ),
  withDrawer(({ id, metaActivities }) => {
    const metaActivity = (metaActivities || []).filter(
      (m) => m.id === parseInt(id, 10),
    );
    if ((metaActivity || []).length === 1) {
      return metaActivity[0].name;
    }
    return '';
  }),
)(MetaActivity);
