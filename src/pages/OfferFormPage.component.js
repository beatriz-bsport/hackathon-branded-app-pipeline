// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { goBack as goBackAction } from 'react-router-redux';

import { offer as offerActions } from '../actions';
import type { Coach, MetaActivity, Establishment } from '../api/types';
import withDrawer from '../hocs/with-drawer.hoc';

import OfferForm from '../libs/offer/OfferForm.component';
import { associatedCoachSelector } from '../libs/associated-coach/selectors';
import { createOffers as createOffersAPI } from '../libs/meta-activity/api/meta-activity';
import { getAllEstablishments } from '../libs/establishment/selectors';
import { fetchEstablishments } from '../libs/establishment/actions';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../libs/meta-activity/selectors';

type Props = {
  match: Object,
  loading: boolean,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  fetchAllOffers: () => void,
  fetchEstablishments: () => void,
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
    this.props.fetchEstablishments();
  }

  createOffers = async (data: Object) => {
    this.setState({ error: false, processing: true });
    try {
      const response = await createOffersAPI(this.metaActivityId, data);
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

export default withNamespaces()(
  connect(
    (state) => ({
      metaActivities: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ],
      coaches: associatedCoachSelector.getActive(state),
      establishments: getAllEstablishments(state),
      loading: state.metaActivity.loading,
    }),
    {
      fetchEstablishments,
      fetchAllOffers: offerActions.fetchAllOffers,
      goBack: goBackAction,
    },
  )(
    withDrawer(({ t }: { t: TFunction }) => t('appbar.title.offerFormPage'))(
      OfferFormPage,
    ),
  ),
);
