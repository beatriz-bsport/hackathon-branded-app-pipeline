// @flow

import { withTranslation, TFunction } from 'react-i18next';

import { goBack, push } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose, withState } from 'recompose';
import Grid from '@material-ui/core/Grid';

import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  fetchAllOffers as fetchAllOffersActions,
  createOffers as createOffersActions,
} from '../../libs/offer/actions';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  createOrUpdate as createOrUpdatePaymentPack,
} from '../../libs/payment-packs/actions';
import { mapFormData } from '../form.utils';
import { upsert } from '../../libs/meta-activity/actions';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
  getMetaActivityCategories,
} from '../../libs/meta-activity/selectors';
import { getAllPaymentPackCategory } from '../../libs/payment-packs/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import themeSelectors from '../../libs/theme/selectors';

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

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';
import PaymentPackForm from '../../libs/payment-packs/components/PaymentPackForm/PaymentPackForm.component';
import OfferForm from '../../libs/offer/OfferForm.component';

import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import { Establishment } from '../../libs/establishment/types';
import { fetchRoomBlueprints } from '../../libs/spot-scheduling/actions';
import { getAvailableRoomBlueprints } from '../../libs/spot-scheduling/selector';
import { RoomBlueprint } from '../../libs/spot-scheduling/types';
import { CoachPaymentRuleByKindSelector } from '../../libs/coach-payment-rules/selectors';
import { fetchAllCoachPaymentRules } from '../../libs/coach-payment-rules/actions';
import type { CoachPaymentRule } from '../../libs/coach-payment-rules/types';
import type { PaymentPackCategory } from '../../libs/payment-packs/types';
import { getAllTagsWithTagGroup } from '../../libs/tag/selectors';
import type { Tag, TagGroup } from '../../libs/tag/types';

type StepType = {
  id: number,
  label: string,
};

const STEP_ACTIVITY: StepType = { id: 0, label: 'workshop_form' };
const STEP_PASS: StepType = { id: 1, label: 'pass_form' };
const STEP_OFFER: StepType = { id: 2, label: 'offer_form' };
const STEPS: Array<StepType> = [STEP_ACTIVITY, STEP_PASS, STEP_OFFER];

type Props = {
  loading: ?boolean,
  goToPreviousPage: () => void,
  classes: Object,

  associatedCoaches: *[],
  establishments: Array<Establishment>,
  SCTs: *[],

  onSubmitPass: () => void,
  onSubmitWorkshopActivity: () => void,
  metaActivitiesAndWorkshops: Array<MetaActivity>,
  step: StepType,
  setStep: (StepType) => void,
  upsertedWorkshop: ?MetaActivity,

  offerHadError: ?Error,
  createOffers: () => void,
  offerIsProcessing: boolean,
  goToWorkshop: (id: number) => void,
  fetchEstablishments: () => void,
  fetchAssociatedCoachesList: () => void,

  t: TFunction,
  companyTheme: CompanyTheme,
  fetchRoomBlueprints: () => void,
  roomBlueprints: Array<RoomBlueprint>,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  paymentPackCategories: Array<PaymentPackCategory>,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
  showPartnership: boolean,

  activeCustomLevels: Level[],
  allCustomLevels: Level[],
  createOffers: (data: Offer, options: OptionCallback) => void,
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void,
  updateLevel: (id: number, data: Level, options: OptionCallback) => void,
  createLevel: (data: Level, options?: OptionCallback<Level>) => void,
  deleteLevel: (id: number, options?: OptionCallback) => void,
  companyId: number,
};
const MetaActivityMap = {
  cover_main: 'cover_main',
  alt_cover_main: 'alt_cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  first_booking_minutes_until: 'first_booking_minutes_until',
  is_workshop: 'is_workshop',
  SCT: 'SCT',
  color: 'color',
  is_broadcast: 'is_broadcast',
  auto_discard_active: 'auto_discard_active',
  auto_discard_hours_before_start: 'auto_discard_hours_before_start',
  auto_discard_min_bookings_nb: 'auto_discard_min_bookings_nb',
};

const StepperForm = withTranslation(['metaActivity'])(
  (props: { t: TFunction, activeStep: { id: number, label: string } }) => (
    <Stepper activeStep={props.activeStep.id} alternativeLabel>
      {STEPS.map((step) => (
        <Step key={step.id}>
          <StepLabel>{props.t(`forms.create.steps.${step.label}`)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  ),
);

export class WorkshopActivityFormPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.handleFetchLevel();
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  renderActivityStep = () => (
    <MetaActivityForm
      variant="workshop"
      is_broadcast_enabled
      establishments={this.props.establishments}
      SCTs={this.props.SCTs}
      onCancel={this.props.goToPreviousPage}
      onSubmit={this.props.onSubmitWorkshopActivity}
      metaActivityNames={[]}
      initial={{ images: [] }}
    />
  );

  renderPassStep = () => {
    const availableCategoriesId = this.props.metaActivitiesAndWorkshops.map(
      (a) => a.SCT,
    );
    return (
      <div className={this.props.classes.paymentPackContainer}>
        <PaymentPackForm
          onSubmit={this.props.onSubmitPass}
          categoryList={this.props.SCTs.filter(
            (c) => availableCategoriesId.indexOf(c.id) !== -1,
          )}
          metaActivityList={this.props.metaActivitiesAndWorkshops}
          tagList={this.props.allTagsWithTagGroup}
          establishmentList={this.props.establishments}
          loading={this.props.loading}
          closeForm={() => this.props.setStep(STEP_OFFER)}
          onCancelText={this.props.t('common.skip')}
          paymentPackCategories={this.props.paymentPackCategories}
          provincialTax={this.props.companyTheme?.provincial_tax_value}
        />
      </div>
    );
  };

  renderOfferStep = () => (
    <OfferForm
      metaActivity={this.props.upsertedWorkshop}
      coaches={this.props.associatedCoaches}
      establishments={this.props.establishments}
      timezone={this.props.companyTheme.timezone_name}
      error={this.props.offerHadError}
      onSubmit={this.props.createOffers}
      processing={this.props.offerIsProcessing}
      onCancel={() => this.props.goToWorkshop(this.props.upsertedWorkshop.id)}
      roomBlueprints={this.props.roomBlueprints}
      coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
      editableCoachPaymentRule
      showPartnership={this.props.showPartnership}
      tagList={this.props.allTagsWithTagGroup}
      activeCustomLevels={this.props.activeCustomLevels}
      allCustomLevels={this.props.allCustomLevels}
      fetchLevelList={this.handleFetchLevel}
      updateLevel={this.props.updateLevel}
      createLevel={this.props.createLevel}
      deleteLevel={this.props.deleteLevel}
    />
  );

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    let content = null;
    switch (this.props.step.id) {
      case STEP_ACTIVITY.id:
        content = this.renderActivityStep();
        break;
      case STEP_PASS.id:
        content = this.renderPassStep();
        break;
      case STEP_OFFER.id:
        content = this.renderOfferStep();
        break;
      default:
        break;
    }
    return (
      <Grid
        className={this.props.classes.container}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item md={12} lg={9}>
          <Paper>
            <StepperForm activeStep={this.props.step} />
            {content}
            <StepperForm activeStep={this.props.step} />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: '20vh',
  },
  paymentPackContainer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
});

export default compose(
  withTranslation([]),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withState('step', 'setStep', STEP_ACTIVITY),
  connect(
    (state) => ({
      offerIsProcessing: state.offer.create.loading,
      offerHadError: state.offer.create.error,
      associatedCoaches: getActiveCoaches(state),
      establishments: getAllEstablishments(state),
      SCTs: state.category.SCTs,
      companyTheme: themeSelectors.getTheme(state),
      loading: state.metaActivity.loading,
      metaActivityNames: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ].map((ma) => ma.name),
      metaActivitiesAndWorkshops: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ],
      upsertedWorkshop: state.metaActivity.upsert.data,
      roomBlueprints: getAvailableRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      paymentPackCategories: getAllPaymentPackCategory(state),
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      showPartnership: state.theme.theme.has_partnership,
      metaActivityCategories: getMetaActivityCategories(state),
      activeCustomLevels: getActiveCustomLevels(state),
      allCustomLevels: getAllCustomLevels(state),
      companyId: state.theme.theme.company,
    }),
    {
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      goToWorkshop: (id: number) => push(`/workshop-activity/${id}`),
      fetchPaymentPacks: () =>
        fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
      createPass: createOrUpdatePaymentPack,
      fetchAllOffers: fetchAllOffersActions,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchRoomBlueprints,
      fetchAllCoachPaymentRules,
      createOffers: createOffersActions,
      fetchLevelList: fetchLevelListAction,
      updateLevel: updateLevelAction,
      createLevel: createLevelAction,
      deleteLevel: deleteLevelAction,
    },
  ),
  //
  withProps(({ upsertWorkshopActivity, setStep }) => ({
    onSubmitWorkshopActivity: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);

      formData.append('is_workshop', true);
      upsertWorkshopActivity(formData, {
        ...options,
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          setStep(STEP_PASS);
          window.scrollTo(0, 0);
        },
      });
    },
  })),
  withProps(({ createPass, fetchPaymentPacks, setStep }) => ({
    onSubmitPass: (data, options = {}) => {
      createPass(data, {
        ...options,
        onSuccess: () => {
          fetchPaymentPacks();
          if (options.onSuccess) options.onSuccess();
          setStep(STEP_OFFER);
          window.scrollTo(0, 0);
        },
      });
    },
  })),

  withProps(
    ({ upsertedWorkshop, fetchAllOffers, goToWorkshop, createOffers }) => ({
      createOffers: async (data: *) => {
        createOffers(
          {
            ...data,
            meta_activity: upsertedWorkshop.id,
          },
          {
            onSuccess: () => {
              fetchAllOffers();
              goToWorkshop(upsertedWorkshop.id);
            },
          },
        );
      },
    }),
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:workshopActivity.workshopActivityCreate'),
  ),
)(WorkshopActivityFormPage);
