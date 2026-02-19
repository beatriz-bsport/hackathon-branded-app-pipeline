import React, { Component } from 'react';

import { compose } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

import { goBack as goBackAction, push } from 'connected-react-router';

import type { RootState } from 'src/reducers';

import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { fetchActivitiesCompany } from '#src/libs/meta-activity/actions';
import OfferCreateForm from '#src/libs/offer/OfferCreateForm.component';
import { fetchZoomApp } from '#src/libs/zoom-app/actions';
import zoomAppSelectors from '#src/libs/zoom-app/selectors';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#src/libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#src/libs/level/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { OfferCreate } from '#src/libs/offer/types';
import routerParamsToProps from '../hocs/router-params-to-props.hoc';
import withTitle from '../hocs/with-title.hoc';

import {
  fetchAllOffers as fetchAllOffersAction,
  createOffers as createOffersActions,
} from '../libs/offer/actions';

import { fetchRoomBlueprints } from '../libs/spot-scheduling/actions';
import { getAvailableRoomBlueprints } from '../libs/spot-scheduling/selector';

import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import { getActiveCoaches } from '../libs/associated-coach/selectors';
import { getAvailableEstablishmentList } from '../libs/establishment/selectors';

import { fetchEstablishments } from '../libs/establishment/actions';
import { fetchAllCoachPaymentRules } from '../libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../libs/coach-payment-rules/selectors';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../libs/meta-activity/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import { REVAMPED_CALENDAR_URL } from '#src/revamp';

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
    this.props.fetchActivitiesCompany(this.props.theme.company, {
      customer_enabled: true,
    });
    this.handleFetchLevel();
    this.props.fetchZoomApp(this.props.companyId);
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  navigateToCalendar = () => {
    if (this.props.revampedBackofficeEnabled) {
      // No better way to navigate to the revamp for now
      window.location.assign(REVAMPED_CALENDAR_URL);
    } else {
      this.props.push('/calendar');
    }
  };

  createOffers = async (data: OfferCreate) => {
    this.props.createOffers(
      {
        ...data,
        meta_activity: this.props.id,
      },
      {
        onSuccess: () => {
          this.props.fetchAllOffers();
          this.navigateToCalendar();
        },
      },
    );
  };

  render() {
    const { metaActivities, loading, goBack, allTagsWithTagGroup, classes } =
      this.props;

    const metaActivity = metaActivities.filter(
      (m) => m.id === this.props.id,
    )[0];

    return (
      <Grid container className={classes.container}>
        <Grid item lg={7} xs={12}>
          <Paper>
            <OfferCreateForm
              editableCoachPaymentRule
              activeCustomLevels={this.props.activeCustomLevels}
              allCustomLevels={this.props.allCustomLevels}
              allowGuestMaster={
                this.props.theme.allow_guest &&
                this.props.theme.allow_guest_activatable
              }
              availableEstablishments={this.props.availableEstablishments}
              coaches={this.props.coaches}
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
              createLevel={this.props.createLevel}
              deleteLevel={this.props.deleteLevel}
              error={this.props.error}
              fetchLevelList={this.handleFetchLevel}
              is_whereby_integration_enabled={
                this.props.theme &&
                this.props.theme.is_whereby_integration_enabled &&
                this.props.theme.is_whereby_integration_allowed
              }
              isLoading={loading || !metaActivity}
              metaActivity={metaActivity}
              onBannerGoBack={goBack}
              onCancel={goBack}
              onSubmit={this.createOffers}
              processing={this.props.processing}
              roomBlueprints={this.props.roomBlueprints}
              showPartnership={this.props.showPartnership}
              // @ts-expect-error
              tagList={allTagsWithTagGroup}
              timezone={this.props.timezone}
              updateLevel={this.props.updateLevel}
              zoomAppDetail={this.props.zoomAppDetail}
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
    revampedBackofficeEnabled:
      getTheme(state)?.revamped_backoffice_enabled &&
      state.auth?.has_enabled_revamped_backoffice,
    processing: state.offer.create.loading,
    error: state.offer.create.error,
    metaActivities: [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
    ],
    coaches: getActiveCoaches(state),
    theme: state.theme.theme,
    availableEstablishments: getAvailableEstablishmentList(state),
    loading: state.metaActivity.loading,
    timezone: state.theme.theme.timezone_name,
    roomBlueprints: getAvailableRoomBlueprints(state),
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    showPartnership: state.theme.theme.has_partnership,
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    activeCustomLevels: getActiveCustomLevels(state),
    allCustomLevels: getAllCustomLevels(state),
    companyId: state.theme.theme.company,
    zoomAppDetail: zoomAppSelectors.getZoomApp(state),
  }),
  {
    fetchEstablishments,
    fetchAssociatedCoachesList,
    fetchAllOffers: fetchAllOffersAction,
    goBack: goBackAction,
    fetchRoomBlueprints,
    fetchAllCoachPaymentRules,
    fetchActivitiesCompany,
    createOffers: createOffersActions,
    fetchLevelList: fetchLevelListAction,
    updateLevel: updateLevelAction,
    createLevel: createLevelAction,
    deleteLevel: deleteLevelAction,
    push,
    fetchZoomApp,
  },
);

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  withStyles(styles),
  connector,
  withTitle(({ t }: { t: TFunction }) => t('titles:offerFormPage')),
)(OfferFormPage);
