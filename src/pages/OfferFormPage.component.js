// @flow
import React, { Component } from 'react';

import { Paper, Grid, CircularProgress } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { goBack as goBackAction } from 'react-router-redux';

import { OfferForm } from '../components';
import api from '../api';
import { activity as activityActions, offer as offerActions } from '../actions';
import type { Coach, MetaActivity, Establishment } from '../api/types';
import withDrawer from '../hocs/with-drawer.hoc';

type Props = {
  match: Object,
  loading: boolean,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  fetchAllOffers: () => void,
  fetchAllActivities: () => void,
  goBack: () => void,
};

type State = {
  processing: boolean,
  created: boolean,
  error: boolean,
};

export class OfferFormPage extends Component<Props, State> {
  metaActivityId: number;

  state = {
    processing: false,
    created: false,
    error: false,
  };

  componentWillMount() {
    this.metaActivityId = parseInt(this.props.match.params.id, 10);
  }

  createOffers = async (data: Object) => {
    this.setState({ error: false, processing: true });
    try {
      const response = await api.metaActivity.createOffers(
        this.metaActivityId,
        data,
      );
      if (response.status === 200) {
        this.setState({ processing: false, created: true });
        this.props.fetchAllOffers();
        return;
      }
      this.throwError();
    } catch (err) {
      this.throwError();
    }
  };

  throwError = () => {
    this.setState({ error: true, processing: false });
  };

  render() {
    const { processing, created, error } = this.state;
    const { metaActivities, loading, goBack } = this.props;
    if (loading) {
      return <CircularProgress />;
    }

    if (created) {
      this.props.fetchAllOffers();
      this.props.fetchAllActivities();
      return <Redirect to={`/activity/${this.metaActivityId}`} />;
    }

    const metaActivity = metaActivities.filter(
      (m) => m.id === this.metaActivityId,
    )[0];
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Paper>
            <OfferForm
              onSubmit={this.createOffers}
              metaActivity={metaActivity}
              coaches={this.props.coaches}
              establishments={this.props.establishments}
              processing={processing}
              error={error}
              onCancel={goBack}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    metaActivities: state.metaActivity.all,
    coaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    loading: state.metaActivity.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
    fetchAllActivities() {
      dispatch(activityActions.fetchActivities());
    },
    goBack() {
      dispatch(goBackAction());
    },
  };
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(
    withDrawer(({ t }: { t: TFunction }) => t('appbar.title.offerFormPage'))(
      OfferFormPage,
    ),
  ),
);
