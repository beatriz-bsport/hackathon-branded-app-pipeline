// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { withProps, compose, withState, withHandlers } from 'recompose';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { mapFormData } from '../../../pages/form.utils';
import withTitle from '../../../hocs/with-title.hoc';
import MetaActivityForm from './MetaActivityForm.component';
import OfferForm from '../../offer/OfferForm.component';
import CompatiblePaymentPacks from './MetaActivityCompatiblePacks.component';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

import { Establishment } from '../../establishment/types';
import { PaymentPack } from '../../payment-packs/types';
import { RoomBlueprint } from '../../spot-scheduling/types';
import { CoachPaymentRule } from '../../coach-payment-rules/types';

type StepType = {
  id: number,
  label: string,
};

const STEP_ACTIVITY: StepType = { id: 0, label: 'activity_form' };

const STEP_OFFER: StepType = { id: 1, label: 'offer_form' };

const STEP_PASS: StepType = { id: 2, label: 'pass_list' };

const STEPS: Array<StepType> = [STEP_ACTIVITY, STEP_OFFER, STEP_PASS];

type Props = {
  loading: ?boolean,
  compatiblePacksLoading: boolean,
  compatiblePaymentPacks: Array<PaymentPack>,
  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  SCTs: *[],

  onSubmitMetaActivity: () => void,
  coaches: Array<Coach>,
  fetchAssociatedCoachesList: () => void,
  fetchAllActivities: () => void,
  setStep: (step: StepType) => void,
  step: StepType,
  upsertedMetaActivity: ?MetaActivity,
  fetchPaymentPacks: (metaActvityId?: number) => void,
  offerHadError: ?Error,
  createMetaOffers: () => void,
  offerIsProcessing: boolean,
  goToMetaActivity: (id: number) => void,
  t: TFunction,
  goToPaymentPackCreate: () => void,
  onClose: () => void,
  companyTheme: CompanyTheme,
  fetchRoomBlueprints: () => void,
  roomBlueprints: Array<RoomBlueprint>,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  metaActivities: any,
  allTagsWithTagGroup: any,
  paymentPackCategories: any,
  createPaymentPack: (data: any, options: any) => void,
  categoryList: any,
  showPartnership: boolean,

  activeCustomLevels: Level[],
  allCustomLevels: Level[],
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void,
  updateLevel: (id: number, data: Level, options: OptionCallback) => void,
  createLevel: (data: Level, options?: OptionCallback<Level>) => void,
  deleteLevel: (id: number, options?: OptionCallback) => void,
  companyId: number,
  onSubmitWorkshopActivity: () => void,
  isWorkshop: boolean,
  createWorkshopOffers: () => void,
  upsertedWorkshop: ?MetaActivity,
  associatedCoaches: Array<Coach>,
  metaActivitiesAndWorkshops: any,
};

export const MetaActivityMap = {
  cover_main: 'cover_main',
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
  category: 'category',
  alt_cover_main: 'alt_cover_main',
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

export class MetaActivityCreateDrawer extends Component<Props> {
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

  renderMetaActivityStep = () => (
    <MetaActivityForm
      variant={this.props.isWorkshop ? 'workshop' : null}
      SCTs={this.props.SCTs}
      onSubmit={
        this.props.isWorkshop
          ? this.props.onSubmitWorkshopActivity
          : this.props.onSubmitMetaActivity
      }
      onCancel={this.props.onClose}
      is_broadcast_enabled
    />
  );

  renderOfferStep = () => (
    <OfferForm
      onSubmit={
        this.props.isWorkshop
          ? this.props.createWorkshopOffers
          : this.props.createMetaOffers
      }
      metaActivity={
        this.props.isWorkshop
          ? this.props.upsertedWorkshop
          : this.props.upsertedMetaActivity
      }
      coaches={
        this.props.isWorkshop
          ? this.props.associatedCoaches
          : this.props.coaches
      }
      establishments={this.props.establishments}
      roomBlueprints={this.props.roomBlueprints}
      error={this.props.offerHadError}
      processing={this.props.offerIsProcessing}
      onCancelText={this.props.t('common.skip')}
      onCancel={() => this.props.setStep(STEP_PASS)}
      timezone={this.props.companyTheme.timezone_name}
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

  renderPaymentPackStep = () => {
    return (
      <CompatiblePaymentPacks
        loading={this.props.compatiblePacksLoading}
        paymentPacks={this.props.compatiblePaymentPacks}
        metaActivity={
          this.props.isWorkshop
            ? this.props.upsertedWorkshop
            : this.props.upsertedMetaActivity
        }
        fetchPaymentPacksAsConsumer={this.props.fetchPaymentPacks}
        goToMetaActivity={this.props.goToMetaActivity}
        goToPaymentPackCreate={this.props.goToPaymentPackCreate}
        categoryList={
          this.props.isWorkshop
            ? this.props.SCTs.filter(
                (c) =>
                  this.props.metaActivitiesAndWorkshops
                    .map((a) => a.SCT)
                    .indexOf(c.id) !== -1,
              )
            : [...this.props.categoryList].filter(
                (category) =>
                  this.props.metaActivities
                    .map((a) => a.SCT)
                    .indexOf(category.id) !== -1,
              )
        }
        allEstablishmentList={this.props.establishments}
        metaActivityList={
          this.props.isWorkshop
            ? this.props.metaActivitiesAndWorkshops
            : this.props.metaActivities
        }
        tagList={this.props.allTagsWithTagGroup}
        paymentPackCategories={this.props.paymentPackCategories}
        onSubmit={this.props.createPaymentPack}
      />
    );
  };

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    return (
      <GenericResponsiveDrawer
        open
        onClose={() => {
          this.props.fetchAllActivities();
          this.props.onClose();
        }}
        title={
          this.props.isWorkshop
            ? this.props.t('titles:workshopActivity.workshopActivityFormPage')
            : this.props.t('titles:metaActivity.metaActivityFormPage')
        }
      >
        <StepperForm activeStep={this.props.step} />
        {this.props.step.id === STEP_ACTIVITY.id &&
          this.renderMetaActivityStep()}
        {this.props.step.id === STEP_OFFER.id && this.renderOfferStep()}
        {this.props.step.id === STEP_PASS.id && this.renderPaymentPackStep()}
        {this.props.step === STEP_PASS ? null : (
          <StepperForm activeStep={this.props.step} />
        )}
      </GenericResponsiveDrawer>
    );
  }
}
export default compose(
  withTranslation([]),
  withState('step', 'setStep', STEP_ACTIVITY),
  withProps(({ upsertMetaActivity, setStep, fetchAllActivities }) => ({
    onSubmitMetaActivity: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);

      formData.append('is_workshop', false);

      upsertMetaActivity(formData, {
        ...options,
        onSuccess: () => {
          fetchAllActivities();
          if (options.onSuccess) options.onSuccess();
          setStep(STEP_OFFER);
          window.scrollTo(0, 0);
        },
      });
    },
  })),
  withProps(({ upsertWorkshopActivity, setStep, fetchAllActivities }) => ({
    onSubmitWorkshopActivity: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);

      formData.append('is_workshop', true);
      upsertWorkshopActivity(formData, {
        ...options,
        onSuccess: () => {
          fetchAllActivities();
          if (options.onSuccess) options.onSuccess();
          setStep(STEP_OFFER);
          window.scrollTo(0, 0);
        },
      });
    },
  })),
  withProps(
    ({ upsertedMetaActivity, fetchAllOffers, setStep, createOffers }) => ({
      createMetaOffers: async (data: *) => {
        createOffers(
          {
            ...data,
            meta_activity: upsertedMetaActivity.id,
          },
          {
            onSuccess: () => {
              fetchAllOffers();
              setStep(STEP_PASS);
              window.scrollTo(0, 0);
            },
            onError: (err) => {
              console.error(err);
            },
          },
        );
      },
    }),
  ),
  withProps(({ upsertedWorkshop, fetchAllOffers, setStep, createOffers }) => ({
    createWorkshopOffers: async (data: any) => {
      createOffers(
        {
          ...data,
          meta_activity: upsertedWorkshop.id,
        },
        {
          onSuccess: () => {
            fetchAllOffers();
            setStep(STEP_PASS);
            window.scrollTo(0, 0);
          },
        },
      );
    },
  })),
  withTitle(({ t }) => t('titles:metaActivity.metaActivityFormPage')),
  withHandlers({
    createPaymentPack:
      ({ createOrUpdatePaymentPackAction, fetchPaymentPacks, onClose }) =>
      (data: any, options: OptionCallBack) => {
        createOrUpdatePaymentPackAction(data, {
          ...options,
          onSuccess: (res) => {
            options.onSuccess(res);
            fetchPaymentPacks();
            onClose();
          },
        });
      },
  }),
)(MetaActivityCreateDrawer);
