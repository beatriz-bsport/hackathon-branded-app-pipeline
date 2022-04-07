// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
// eslint-disable-next-line bsport/no-redux-in-component
import { goBack as goBackAction } from 'connected-react-router';
import { Redirect } from 'react-router-dom';

import type { RootState } from 'src/reducers';

import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import routerParamsToProps from '../hocs/router-params-to-props.hoc';
import withTitle from '../hocs/with-title.hoc';

import { fetchAllOffers as fetchAllOffersAction } from '../libs/offer/actions';
import { createOffers as createOffersAPI } from '../libs/meta-activity/api/meta-activity';

import { fetchAllActivities } from '#libs/meta-activity/actions';

import { fetchRoomBlueprints } from '../libs/spot-scheduling/actions';
import { getAvailableRoomBlueprints } from '../libs/spot-scheduling/selector';

import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import { getActiveCoaches } from '../libs/associated-coach/selectors';
import { getAvailableEstablishmentList } from '../libs/establishment/selectors';

import { fetchEstablishments } from '../libs/establishment/actions';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../libs/meta-activity/selectors';

import { fetchAllCoachPaymentRules } from '../libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../libs/coach-payment-rules/selectors';

import { getallTagsWithTagGroup } from '#libs/tag/selectors';

import OfferForm from '../libs/offer/OfferForm.component';

type OwnProps = {
  goBack: () => void;
};

type ParamsProps = {
  id: number;
};
type Props = ParamsProps &
  OwnProps &
  ConnectedProps<typeof connector> &
  WithTranslation &
  WithStyles<typeof styles>;

type State = {
  processing: boolean;
  created: boolean;
  error: boolean;
};

export class OfferFormPage extends Component<Props, State> {
  state = {
    processing: false,
    created: false,
    error: false,
  };

  componentWillMount() {
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAllActivities({ customer_enabled: true });
  }

  createOffers = async (data: Object) => {
    this.setState({ error: false, processing: true });
    try {
      const response = await createOffersAPI(this.props.id, data);
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
    const { metaActivities, loading, goBack, allTagsWithTagGroup, classes } =
      this.props;
    if (loading) {
      return <CircularProgress />;
    }

    if (created) {
      this.props.fetchAllOffers();
      return <Redirect to="/calendar" />;
    }

    const metaActivity = metaActivities.filter(
      (m) => m.id === this.props.id,
    )[0];

    return (
      <Grid container className={classes.container}>
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
              editableCoachPaymentRule
              showPartnership={this.props.showPartnership}
              tagList={allTagsWithTagGroup}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = () =>
  createStyles({
    container: {
      paddingBottom: '30vh',
    },
  });

const connector = connect(
  (state: RootState) => ({
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
    showPartnership: state.theme.theme.has_partnership,
    allTagsWithTagGroup: getallTagsWithTagGroup(state),
  }),
  {
    fetchEstablishments,
    fetchAssociatedCoachesList,
    fetchAllOffers: fetchAllOffersAction,
    goBack: goBackAction,
    fetchRoomBlueprints,
    fetchAllCoachPaymentRules,
    fetchAllActivities,
  },
);
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  withStyles(styles),
  connector,
  withTitle(({ t }: { t: TFunction }) => t('titles:offerFormPage')),
)(OfferFormPage);
