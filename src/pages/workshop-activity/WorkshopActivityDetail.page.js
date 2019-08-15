// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { offer as offerActions } from '../../actions';
import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions/meta-activity.actions';
import type {
  Offer,
  MetaActivity as MetaActivityType,
  Stat,
} from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';

type Props = {
  id: number,
  workshopActivity: MetaActivityType,
  loading: boolean,
  classes: Object,
  t: TFunction,
  // eslint-disable-next-line
  stats: Stat,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  push: (path: string) => void,
  events: Array<Event>,
  fetchMetaActivityDetails: (number) => void,
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
      <div>
        <MetaActivityDetail
          metaActivity={this.props.workshopActivity}
          stats={this.props.stats}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers}
          goToOffer={(o) => this.props.push(`/offer/${o.id}`)}
          createActivityOffers={this.createActivityOffers}
        />
        <Button
          variant="extendedFab"
          color="primary"
          onClick={() =>
            this.props.push(`/workshop-activity/${this.props.id}/edit`)
          }
          className={this.props.classes.editButton}
        >
          <EditIcon className={this.props.classes.leftIcon} />
          {this.props.t('common.edit')}
        </Button>
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
