// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import { LinearProgress } from '@material-ui/core';
import {
  metaActivity as metaActivityActions,
  offer as offerActions,
} from '../../actions';
import type {
  Activity,
  Offer,
  MetaActivity as MetaActivityType,
  Stat,
} from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import MetaActivityDetail from '../../libs/meta-activity/MetaActivityDetail.component';

type Props = {
  metaActivity: MetaActivityType,
  loading: boolean,
  stats: Stat,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  push: (path: string) => void,
  events: Array<Event>,
  fetchMetaActivityDetails: (number) => void,
  timetableLoading: boolean,
  activities: Array<Activity>,
  offers: Array<Offer>,
  match: Object,
  metaActivityImages: Array<Object>,
};

export class MetaActivity extends Component<Props> {
  metaActivityId: number;

  componentDidMount() {
    this.metaActivityId = parseInt(this.props.match.params.id, 10);
    this.props.fetchMetaActivityDetails(this.metaActivityId);
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
        stats={this.props.stats}
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

function mapStateToProps(state) {
  return {
    loading: state.metaActivity.loading,
    metaActivity: state.metaActivity.metaActivity,
    metaActivities: state.metaActivity.all,
    metaActivityImages:
      (state.metaActivity.metaActivity &&
        state.metaActivity.metaActivity.images) ||
      [],
    stats: state.stats.activities,
    events: state.offer.calendar,
    offers: state.offer.offers,
    timetableLoading: state.activity.loading,
    activities: state.activity.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMetaActivityDetails(id) {
      dispatch(metaActivityActions.fetchMetaActivityDetails(id));
    },
    fetchOffersByDay({ year, month, day }) {
      dispatch(offerActions.fetchOffersByDay({ year, month, day }));
    },
    push(path) {
      dispatch(routerPush(path));
    },
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withDrawer(({ match, metaActivities }) => {
    if (match && match.params && match.params.id) {
      const metaActivity = (metaActivities || []).filter(
        (m) => m.id === parseInt(match.params.id, 10),
      );
      if ((metaActivity || []).length === 1) {
        return metaActivity[0].name;
      }
    }
    return '';
  }),
)(MetaActivity);
