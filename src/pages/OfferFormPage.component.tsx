// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
// eslint-disable-next-line bsport/no-redux-in-component
import { goBack as goBackAction, push } from 'connected-react-router';

import type { RootState } from 'src/reducers';

import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import routerParamsToProps from '../hocs/router-params-to-props.hoc';
import withTitle from '../hocs/with-title.hoc';

import {
  fetchAllOffers as fetchAllOffersAction,
  createOffers as createOffersActions,
} from '../libs/offer/actions';

import { fetchAllActivities } from '#libs/meta-activity/actions';

import { fetchRoomBlueprints } from '../libs/spot-scheduling/actions';
import { getAvailableRoomBlueprints } from '../libs/spot-scheduling/selector';

import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import { getActiveCoaches } from '../libs/associated-coach/selectors';
import { getAvailableEstablishmentList } from '../libs/establishment/selectors';

import { fetchEstablishments } from '../libs/establishment/actions';
import { fetchAllCoachPaymentRules } from '../libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../libs/coach-payment-rules/selectors';
import OfferForm from '../libs/offer/OfferForm.component';

import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../libs/meta-activity/selectors';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#libs/level/selectors';

import { getAllTagsWithTagGroup } from '#libs/tag/selectors';

import { Offer } from '#libs/offer/types';

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

export class OfferFormPage extends Component<Props, {}> {
  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAllActivities({ customer_enabled: true });
    this.handleFetchLevel();
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  createOffers = async (data: Offer) => {
    this.props.createOffers(
      {
        ...data,
        meta_activity: this.props.id,
      },
      {
        onSuccess: () => {
          this.props.fetchAllOffers();
          this.props.push('/calendar');
        },
      },
    );
  };

  render() {
    const { metaActivities, loading, goBack, allTagsWithTagGroup, classes } =
      this.props;
    if (loading) {
      return <CircularProgress />;
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
              processing={this.props.processing}
              error={this.props.error}
              onCancel={goBack}
              timezone={this.props.timezone}
              roomBlueprints={this.props.roomBlueprints}
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
              editableCoachPaymentRule
              showPartnership={this.props.showPartnership}
              tagList={allTagsWithTagGroup}
              fetchLevelList={this.handleFetchLevel}
              activeCustomLevels={this.props.activeCustomLevels}
              allCustomLevels={this.props.allCustomLevels}
              updateLevel={this.props.updateLevel}
              createLevel={this.props.createLevel}
              deleteLevel={this.props.deleteLevel}
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
    processing: state.offer.create.loading,
    error: state.offer.create.error,
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
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    activeCustomLevels: getActiveCustomLevels(state),
    allCustomLevels: getAllCustomLevels(state),
    companyId: state.theme.theme.company,
  }),
  {
    fetchEstablishments,
    fetchAssociatedCoachesList,
    fetchAllOffers: fetchAllOffersAction,
    goBack: goBackAction,
    fetchRoomBlueprints,
    fetchAllCoachPaymentRules,
    fetchAllActivities,
    createOffers: createOffersActions,
    fetchLevelList: fetchLevelListAction,
    updateLevel: updateLevelAction,
    createLevel: createLevelAction,
    deleteLevel: deleteLevelAction,
    push,
  },
);
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  withStyles(styles),
  connector,
  withTitle(({ t }: { t: TFunction }) => t('titles:offerFormPage')),
)(OfferFormPage);
