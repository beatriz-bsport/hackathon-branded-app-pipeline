// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import { offer as offerActions } from '../../actions';
import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions/meta-activity.actions';
import type {
  Activity,
  Offer,
  MetaActivity as MetaActivityType,
} from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';

type Props = {
  id: number,
  metaActivity: MetaActivityType,
  loading: boolean,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  push: (path: string) => void,
  events: Array<Event>,
  fetchMetaActivityDetails: (number) => void,
  timetableLoading: boolean,
  activities: Array<Activity>,
  offers: Array<Offer>,
  metaActivityImages: Array<Object>,
};

export class MetaActivity extends Component<Props> {
  componentDidMount() {
    this.props.fetchMetaActivityDetails(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchMetaActivityDetails(this.props.id);
    }
  }

  goToOffer = (o: Offer) => {
    this.props.push(`/offer/${o.id}`);
  };

  createActivityOffers = (metaActivityId: number) => {
    this.props.push(`/add-offers/${metaActivityId}`);
  };

  render() {
    if (this.props.loading || !this.props.metaActivity) {
      return <LinearProgress />;
    }
    return (
      <MetaActivityDetail
        coverImages={this.props.metaActivityImages}
        metaActivity={this.props.metaActivity}
        fetchOffersByDay={this.props.fetchOffersByDay}
        events={this.props.events}
        timetableLoading={this.props.timetableLoading}
        activities={this.props.activities}
        offers={this.props.offers}
        goToOffer={this.goToOffer}
        createActivityOffers={this.createActivityOffers}
      />
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state) => ({
      loading: state.metaActivity.loading,
      metaActivity: state.metaActivity.metaActivity,
      metaActivities: state.metaActivity.all,
      metaActivityImages:
        (state.metaActivity.metaActivity &&
          state.metaActivity.metaActivity.images) ||
        [],
      events: state.offer.calendar,
      offers: state.offer.offers,
      timetableLoading: state.activity.loading,
      activities: state.activity.all,
    }),
    {
      fetchMetaActivityDetails,
      fetchOffersByDay: offerActions.fetchOffersByDay,
      push: routerPush,
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
