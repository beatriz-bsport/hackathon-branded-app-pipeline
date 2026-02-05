// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { withProps, compose, withState } from 'recompose';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { mapFormData } from '../../../pages/form.utils';
import MetaActivityForm from './MetaActivityForm.component';
import OfferCreateForm from '../../offer/OfferCreateForm.component';
import CompatiblePaymentPacks from './MetaActivityCompatiblePacks.component';
import { OptionCallback, PaginatedState } from '../../../state/types';

import type { PaymentPackWithContractId } from '#src/libs/subscription/types';
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
  loading?: boolean,
  compatiblePacksLoading: boolean,
  compatiblePaymentPacks: Array<PaymentPack>,
  paymentPacksWithContractIdPaginated?: PaginatedState<PaymentPackWithContractId>,
  availableEstablishments: Array<Establishment>,
  fetchEstablishments: () => void,
  SCTs: any[],

  onSubmitMetaActivity: () => void,
  coaches: Array<Coach>,
  fetchAssociatedCoachesList: () => void,
  fetchAllActivities: () => void,
  setStep: (step: StepType) => void,
  step: StepType,
  upsertedMetaActivity?: MetaActivity,
  fetchPaymentPacks: (metaActvityId?: number) => void,
  offerHadError?: Error,
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
  createPaymentPack: (data: any, options: OptionCallback) => void,
  categoryList: any,
  showPartnership: boolean,
  skipOfferStep: boolean,

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
  upsertedWorkshop?: MetaActivity,
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
  custom_restriction_rule: 'custom_restriction_rule',
};

const StepperForm = withTranslation(['metaActivity'])(
  (props: { t: TFunction, activeStep: { id: number, label: string } }) => (
    <Stepper alternativeLabel activeStep={props.activeStep.id}>
      {STEPS.map((step) => (
        <Step key={step.id}>
          <StepLabel>{props.t(`forms.create.steps.${step.label}`)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  ),
);

export class MetaActivityCreateDrawer extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.topDrawerRef = React.createRef<HTMLDivElement>(null);
  }

  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.handleFetchLevel();
  }

  scrollToTopDrawer = () => this.topDrawerRef?.current?.scroll(0, 0);

  handleSkip = () => {
    this.props.setStep(STEP_PASS);
    this.scrollToTopDrawer();
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  handleOnSubmitWorkshopActivity = (values) => {
    this.props.onSubmitWorkshopActivity(values, {
      onSuccess: this.scrollToTopDrawer,
    });
  };

  handleOnSubmitMetaActivity = (values) => {
    this.props.onSubmitMetaActivity(values, {
      onSuccess: this.scrollToTopDrawer,
    });
  };

  handleCreateWorkshopOffers = (data) => {
    this.props.createWorkshopOffers(data, {
      onSuccess: this.scrollToTopDrawer,
    });
  };

  handleCreateMetaOffers = (data) => {
    this.props.createMetaOffers(data, {
      onSuccess: this.scrollToTopDrawer,
    });
  };

  renderMetaActivityStep = () => (
    <MetaActivityForm
      is_broadcast_enabled
      onCancel={this.handleClose}
      onSubmit={
        this.props.isWorkshop
          ? this.handleOnSubmitWorkshopActivity
          : this.handleOnSubmitMetaActivity
      }
      SCTs={this.props.SCTs}
      tags={this.props.allTagsWithTagGroup}
      variant={this.props.isWorkshop ? 'workshop' : null}
    />
  );

  renderOfferStep = () => (
    <OfferCreateForm
      disableCoachSelectorFocus
      disableEstablishmentSelectorFocus
      editableCoachPaymentRule
      hideActivitySection
      hideBanner
      activeCustomLevels={this.props.activeCustomLevels}
      allCustomLevels={this.props.allCustomLevels}
      allowGuestMaster={
        this.props.companyTheme.allow_guest_activatable &&
        this.props.companyTheme.allow_guest
      }
      availableEstablishments={this.props.availableEstablishments}
      coaches={
        this.props.isWorkshop
          ? this.props.associatedCoaches
          : this.props.coaches
      }
      coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
      createLevel={this.props.createLevel}
      deleteLevel={this.props.deleteLevel}
      error={this.props.offerHadError}
      fetchLevelList={this.handleFetchLevel}
      isForbidden={this.props.skipOfferStep}
      metaActivity={
        this.props.isWorkshop
          ? this.props.upsertedWorkshop
          : this.props.upsertedMetaActivity
      }
      onCancel={this.handleSkip}
      onCancelText={this.props.t('common.skip')}
      onSubmit={
        this.props.isWorkshop
          ? this.handleCreateWorkshopOffers
          : this.handleCreateMetaOffers
      }
      processing={this.props.offerIsProcessing}
      roomBlueprints={this.props.roomBlueprints}
      showPartnership={this.props.showPartnership}
      tagList={this.props.allTagsWithTagGroup}
      timezone={this.props.companyTheme.timezone_name}
      updateLevel={this.props.updateLevel}
    />
  );

  renderPaymentPackStep = () => {
    return (
      <CompatiblePaymentPacks
        availableEstablishmentList={this.props.availableEstablishments}
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
        fetchPaymentPacksAsConsumer={this.props.fetchPaymentPacks}
        goToMetaActivity={this.props.goToMetaActivity}
        goToPaymentPackCreate={this.props.goToPaymentPackCreate}
        loading={this.props.compatiblePacksLoading}
        metaActivity={
          this.props.isWorkshop
            ? this.props.upsertedWorkshop
            : this.props.upsertedMetaActivity
        }
        metaActivityList={
          this.props.isWorkshop
            ? this.props.metaActivitiesAndWorkshops
            : this.props.metaActivities
        }
        onSubmit={this.props.createPaymentPack}
        paymentPackCategories={this.props.paymentPackCategories}
        paymentPacks={this.props.compatiblePaymentPacks}
        paymentPacksWithContractIdPaginated={
          this.props.paymentPacksWithContractIdPaginated
        }
        tagList={this.props.allTagsWithTagGroup}
      />
    );
  };

  /**
   * Renders a stepper form.
   *
   * @returns The rendered stepper form.
   */
  renderStepper() {
    return <StepperForm activeStep={this.props.step} />;
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
      this.props.isWorkshop
        ? SegmentAnalyticsFormObjectIdentifier.Workshop
        : SegmentAnalyticsFormObjectIdentifier.Activity,
    );

    return (
      <GenericResponsiveDrawer
        open
        withoutPadding
        forwardedContainerRef={this.topDrawerRef}
        onClose={() => {
          this.props.fetchAllActivities();
          this.props.onClose();
          trackFormCancel();
        }}
        subtitle={
          this.props.isWorkshop
            ? this.props.t(
                'titles:workshopActivity.workshopActivityFormSubtitle',
              )
            : this.props.t('titles:metaActivity.metaActivityFormSubtitle')
        }
        title={
          this.props.isWorkshop
            ? this.props.t('titles:workshopActivity.workshopActivityFormPage')
            : this.props.t('titles:metaActivity.metaActivityFormPage')
        }
      >
        {this.renderStepper()}
        {this.props.step.id === STEP_ACTIVITY.id &&
          this.renderMetaActivityStep()}
        {this.props.step.id === STEP_OFFER.id && this.renderOfferStep()}
        {this.props.step.id === STEP_PASS.id && this.renderPaymentPackStep()}
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
        },
      });
    },
  })),
  withProps(
    ({ upsertedMetaActivity, fetchAllOffers, setStep, createOffers }) => ({
      createMetaOffers: async (data: any, options: OptionCallback) => {
        createOffers(
          {
            ...data,
            meta_activity: upsertedMetaActivity.id,
          },
          {
            onSuccess: () => {
              fetchAllOffers();
              if (options.onSuccess) options.onSuccess();
              setStep(STEP_PASS);
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
    createWorkshopOffers: async (data: any, options: OptionCallback) => {
      createOffers(
        {
          ...data,
          meta_activity: upsertedWorkshop.id,
        },
        {
          onSuccess: () => {
            fetchAllOffers();
            if (options.onSuccess) options.onSuccess();
            setStep(STEP_PASS);
          },
        },
      );
    },
  })),
)(MetaActivityCreateDrawer);
