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
import { offer as offerActions } from '../../actions';
import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions/meta-activity.actions';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import { getMetaActivities } from '../../libs/meta-activity/selectors';

type Props = {
  id: number,
  t: TFunction,
  classes: Object,
  metaActivity: MetaActivityType,
  loading: boolean,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  push: (path: string) => void,
  events: Array<Event>,
  fetchMetaActivityDetails: (number) => void,
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
      <div>
        <MetaActivityDetail
          coverImages={this.props.metaActivityImages}
          metaActivity={this.props.metaActivity}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers}
          goToOffer={this.goToOffer}
          createActivityOffers={this.createActivityOffers}
        />
        <Button
          variant="extendedFab"
          color="primary"
          onClick={() => this.props.push(`/activity/${this.props.id}/edit`)}
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
