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
import { getAvailableEstablishmentList } from '../libs/establishment/selectors';
import { fetchEstablishments } from '../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../libs/meta-activity/selectors';
import { fetchRoomBlueprints } from '../libs/spot-scheduling/actions';
import { getAvailableRoomBlueprints } from '../libs/spot-scheduling/selector';
import { RoomBlueprint } from '../libs/spot-scheduling/types';
import { fetchAllCoachPaymentRules } from '../libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../libs/coach-payment-rules/selectors';
import type { CoachPaymentRule } from '../libs/coach-payment-rules/types';

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
  timezone: string,
  roomBlueprints: RoomBlueprint[],
  fetchRoomBlueprints: () => void,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
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
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
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
              timezone={this.props.timezone}
              roomBlueprints={this.props.roomBlueprints}
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
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
      establishments: getAvailableEstablishmentList(state),
      loading: state.metaActivity.loading,
      timezone: state.theme.theme.timezone_name,
      roomBlueprints: getAvailableRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    }),
    {
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchAllOffers: fetchAllOffersAction,
      goBack: goBackAction,
      fetchRoomBlueprints,
      fetchAllCoachPaymentRules,
    },
  )(
    withTitle(({ t }: { t: TFunction }) => t('titles:offerFormPage'))(
      OfferFormPage,
    ),
  ),
);
