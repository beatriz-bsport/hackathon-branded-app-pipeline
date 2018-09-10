// @flow
import React, { Component } from 'react';

import { Grid, CircularProgress } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { OfferForm } from '../components';
import api from '../api';
import { offer as offerActions } from '../actions';
import type { Coach, MetaActivity, Establishment } from '../api/types';

type Props = {
  match: Object,
  loading: boolean,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  fetchAllOffers: () => void,
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
    const { metaActivities, loading } = this.props;
    if (loading) {
      return <CircularProgress />;
    }

    if (created) {
      this.props.fetchAllOffers();
      return <Redirect to={`/activity/${this.metaActivityId}`} />;
    }

    const metaActivity = metaActivities.filter(
      (m) => m.id === this.metaActivityId,
    )[0];
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <OfferForm
            onSubmit={this.createOffers}
            metaActivity={metaActivity}
            coaches={this.props.coaches}
            establishments={this.props.establishments}
            processing={processing}
            error={error}
          />
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
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OfferFormPage),
);
