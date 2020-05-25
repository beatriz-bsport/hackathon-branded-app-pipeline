// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { goBack as goBackAction } from 'connected-react-router';

import { fetchAllOffers as fetchAllOffersAction } from '../libs/offer/actions';
import type { Coach, MetaActivity, Establishment } from '../api/types';
import withTitle from '../hocs/with-title.hoc';

import OfferForm from '../libs/offer/OfferForm.component';
import { getActiveCoaches } from '../libs/associated-coach/selectors';
import { createOffers as createOffersAPI } from '../libs/meta-activity/api/meta-activity';
import { getAllEstablishments } from '../libs/establishment/selectors';
import { fetchEstablishments } from '../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../libs/meta-activity/selectors';

type Props = {
  match: Object,
  loading: boolean,
  coaches: Array<Coach>,
  theme: ?CompanyTheme,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  fetchAllOffers: () => void,
  fetchEstablishments: () => void,
  fetchAssociatedCoachesList: () => void,
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
    this.props.fetchAssociatedCoachesList();
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
      return <Redirect to="/calendar" />;
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
              is_whereby_integration_enabled={
                this.props.theme &&
                this.props.theme.is_whereby_integration_enabled &&
                this.props.theme.is_whereby_integration_allowed
              }
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

export default withTranslation()(
  connect(
    (state) => ({
      metaActivities: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ],
      coaches: getActiveCoaches(state),
      theme: state.theme.theme,
      establishments: getAllEstablishments(state),
      loading: state.metaActivity.loading,
    }),
    {
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchAllOffers: fetchAllOffersAction,
      goBack: goBackAction,
    },
  )(
    withTitle(({ t }: { t: TFunction }) => t('titles:offerFormPage'))(
      OfferFormPage,
    ),
  ),
);
