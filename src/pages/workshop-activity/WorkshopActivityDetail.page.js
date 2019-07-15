// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions/meta-activity.actions';
import type {
  Activity,
  Offer,
  MetaActivity as MetaActivityType,
  Stat,
} from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';

type Props = {
  workshopActivity: MetaActivityType,
  loading: boolean,
  // eslint-disable-next-line
  stats: Stat,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  push: (path: string) => void,
  events: Array<Event>,
  fetchMetaActivityDetails: (number) => void,
  timetableLoading: boolean,
  activities: Array<Activity>,
  offers: Array<Offer>,
  match: Object,
};

type State = {
  editable: boolean,
  data: *,
  sportCategories: Array<number>,
  dateSelected: Object,
};

export class WorkshopActivity extends Component<Props, State> {
  metaActivityId: number;

  componentDidMount() {
    this.metaActivityId = parseInt(this.props.match.params.id, 10);
    this.props.fetchMetaActivityDetails(this.metaActivityId);
  }

  createActivityOffers = (metaActivityId: number) => {
    this.props.push(`/add-offers/${metaActivityId}`);
  };

  render() {
    if (this.props.loading || !this.props.workshopActivity) {
      return <LinearProgress />;
    }
    return (
      <MetaActivityDetail
        metaActivity={this.props.workshopActivity}
        stats={this.props.stats}
        fetchOffersByDay={this.props.fetchOffersByDay}
        events={this.props.events}
        timetableLoading={this.props.timetableLoading}
        activities={this.props.activities}
        offers={this.props.offers}
        goToOffer={(o) => this.props.push(`/offer/${o.id}`)}
        createActivityOffers={this.createActivityOffers}
      />
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      id,
      loading: state.metaActivity.loading,
      workshopActivity: state.metaActivity.metaActivity,
      workshopActivities: state.workshopActivity.all,
      stats: state.stats.activities,
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
