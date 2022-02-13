// @flow

import { withTranslation, TFunction } from 'react-i18next';

import { push, goBack } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose, withState, withHandlers } from 'recompose';
import Grid from '@material-ui/core/Grid';

import withStyles from '@material-ui/core/styles/withStyles';
import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import uniqBy from 'lodash/uniqBy';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { fetchAllOffers as fetchAllOffersAction } from '../../libs/offer/actions';
import { mapFormData } from '../form.utils';
import {
  upsert,
  fetchAllActivities,
  fetchAll as fetchWorkhops,
  fetchAllMetaActivityCategory,
} from '../../libs/meta-activity/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';
import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  resetCompatiblePaymentPacks as resetCompatiblePaymentPacksAction,
  createOrUpdate as createPaymentPack,
  fetchAllPaymentPacks as fetchAllPaymentPacksAction,
  fetchAllPaymentPackCategory,
} from '../../libs/payment-packs/actions';

import withTitle from '../../hocs/with-title.hoc';
import themeSelectors from '../../libs/theme/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  getActivityCompatiblePaymentPacks,
  getAllPaymentPackCategory,
} from '../../libs/payment-packs/selectors';
import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';
import OfferForm from '../../libs/offer/OfferForm.component';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
  getActivitiesByIdList,
  getMetaActivityCategories,
} from '../../libs/meta-activity/selectors';
import CompatiblePaymentPacks from '../../libs/meta-activity/components/MetaActivityCompatiblePacks.component';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  getAvailableEstablishmentList,
  getAllEstablishments,
} from '../../libs/establishment/selectors';
import { Establishment } from '../../libs/establishment/types';
import { PaymentPack } from '../../libs/payment-packs/types';
import { getAvailableRoomBlueprints } from '../../libs/spot-scheduling/selector';
import { fetchRoomBlueprints } from '../../libs/spot-scheduling/actions';
import { RoomBlueprint } from '../../libs/spot-scheduling/types';
import { fetchAllCoachPaymentRules } from '../../libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../../libs/coach-payment-rules/selectors';
import { CoachPaymentRule } from '../../libs/coach-payment-rules/types';

import { getallTagsWithTagGroup } from '#libs/tag/selectors';
import { MetaActivityCategoryWithActivities } from '../../libs/meta-activity/types';

type StepType = {
  id: number,
  label: string,
};

const STEP_ACTIVITY: StepType = { id: 0, label: 'activity_form' };
const STEP_OFFER: StepType = { id: 1, label: 'offer_form' };
const STEP_PASS: StepType = { id: 2, label: 'pass_list' };
const STEPS: Array<StepType> = [STEP_ACTIVITY, STEP_OFFER, STEP_PASS];

type Props = {
  classes: Object,

  loading: ?boolean,
  compatiblePacksLoading: boolean,
  goBack: () => void,
  metaActivityNames: Array<string>,
  compatiblePaymentPacks: Array<PaymentPack>,
  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  SCTs: *[],

  onSubmitMetaActivity: () => void,
  coaches: Array<Coach>,
  fetchAssociatedCoachesList: () => void,
  setStep: (step: StepType) => void,
  step: StepType,
  upsertedMetaActivity: ?MetaActivity,
  fetchPaymentPacks: (id: number) => void,
  offerHadError: ?Error,
  createOffers: () => void,
  offerIsProcessing: boolean,
  goToMetaActivity: (id: number) => void,
  t: TFunction,
  goToPaymentPackCreate: () => void,
  resetPaymentPacks: () => void,
  companyTheme: CompanyTheme,
  fetchRoomBlueprints: () => void,
  roomBlueprints: Array<RoomBlueprint>,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  fetchAllActivities: (data: { customer_enabled: true }) => void,
  fetchWorkhops: () => void,
  fetchAllPaymentPacks: () => void,
  fetchAllPaymentPackCategory: () => void,
  establishmentList: any,
  allEstablishmentList: any,
  metaActivities: any,
  allTagsWithTagGroup: any,
  paymentPackCategories: any,
  createPaymentPack: (data: any, options: any) => void,
  categoryList: any,
  showPartnership: boolean,
  metaActivityCategories: Array<MetaActivityCategoryWithActivities>,
  fetchAllMetaActivityCategory: (companyId?: number) => void,
};

const MetaActivityMap = {
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

export class MetaActivityFormPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.resetPaymentPacks();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAllActivities({ customer_enabled: true });
    this.props.fetchWorkhops();
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchAllMetaActivityCategory();
  }

  renderActivityStep = () => (
    <MetaActivityForm
      metaActivityCategories={this.props.metaActivityCategories}
      coaches={this.props.coaches}
      establishments={this.props.establishments}
      SCTs={this.props.SCTs}
      onSubmit={this.props.onSubmitMetaActivity}
      onCancel={this.props.goBack}
      is_broadcast_enabled
      metaActivityNames={this.props.metaActivityNames}
      initial={{ images: [] }}
    />
  );

  renderOfferStep = () => (
    <OfferForm
      onSubmit={this.props.createOffers}
      metaActivity={this.props.upsertedMetaActivity}
      coaches={this.props.coaches}
      establishments={this.props.establishments}
      roomBlueprints={this.props.roomBlueprints}
      error={this.props.offerHadError}
      processing={this.props.offerIsProcessing}
      discardButtonText={this.props.t('common.skip')}
      onCancel={() => this.props.setStep(STEP_PASS)}
      timezone={this.props.companyTheme.timezone_name}
      coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
      editableCoachPaymentRule
      showPartnership={this.props.showPartnership}
    />
  );

  renderPaymentPackStep = () => (
    <CompatiblePaymentPacks
      loading={this.props.compatiblePacksLoading}
      paymentPacks={this.props.compatiblePaymentPacks}
      metaActivity={this.props.upsertedMetaActivity}
      fetchPaymentPacks={this.props.fetchPaymentPacks}
      goToMetaActivity={this.props.goToMetaActivity}
      goToPaymentPackCreate={this.props.goToPaymentPackCreate}
      establishmentList={this.props.establishmentList}
      categoryList={[...this.props.categoryList].filter(
        (category) =>
          this.props.metaActivities.map((a) => a.SCT).indexOf(category.id) !==
          -1,
      )}
      allEstablishmentList={this.props.allEstablishmentList}
      metaActivityList={this.props.metaActivities}
      tagList={this.props.allTagsWithTagGroup}
      paymentPackCategories={this.props.paymentPackCategories}
      onSubmit={this.props.createPaymentPack}
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
      case STEP_OFFER.id:
        content = this.renderOfferStep();
        break;
      case STEP_PASS.id:
        content = this.renderPaymentPackStep();
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
            {this.props.step === STEP_PASS ? null : (
              <StepperForm activeStep={this.props.step} />
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = () => ({
  container: {
    marginBottom: '20vh',
  },
});

export default compose(
  withTranslation([]),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withState('step', 'setStep', STEP_ACTIVITY),
  connect(
    (state) => ({
      establishments: getAvailableEstablishmentList(state),
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
      metaActivityNames: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ].map((ma) => ma.name),
      coaches: getActiveCoaches(state),
      upsertedMetaActivity: state.metaActivity.upsert.data,
      companyTheme: themeSelectors.getTheme(state),
      compatiblePaymentPacks: {
        items: getActivityCompatiblePaymentPacks(state),
        count: state.paymentPack.byActivity.count,
        page: state.paymentPack.byActivity.page,
        loading: state.paymentPack.byActivity.loading,
      },
      roomBlueprints: getAvailableRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      allEstablishmentList: getAllEstablishments(state),
      allTagsWithTagGroup: getallTagsWithTagGroup(state),
      paymentPackCategories: getAllPaymentPackCategory(state),
      metaActivities: uniqBy(
        [
          ...getEnabledMetaActivities(state),
          ...getEnabledWorkshops(state),
          ...getActivitiesByIdList(state, []),
        ],
        'id',
      ),
      categoryList: state.category.SCTs,
      showPartnership: state.theme.theme.has_partnership,
      metaActivityCategories: getMetaActivityCategories(state),
    }),
    {
      goBack,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchPaymentPacks: fetchActivityCompatiblePaymentPacksAction,
      upsertMetaActivity: upsert,
      resetPaymentPacks: resetCompatiblePaymentPacksAction,
      goToMetaActivity: (id: number) => push(`/activity/${id}/general`),
      goToPaymentPackCreate: () => push('/payment-pack/add'),
      goToPaymentPack: (id: number) => push(`/payment-pack/${id}`),
      fetchAllOffers: fetchAllOffersAction,
      fetchRoomBlueprints,
      fetchAllCoachPaymentRules,
      fetchAllActivities,
      fetchWorkhops,
      fetchAllPaymentPacks: fetchAllPaymentPacksAction,
      fetchAllPaymentPackCategory,
      createOrUpdatePaymentPackAction: createPaymentPack,
      fetchAllMetaActivityCategory,
    },
  ),
  //
  withProps(({ upsertMetaActivity, setStep }) => ({
    onSubmitMetaActivity: (values, options) => {
      const formData = mapFormData(values, MetaActivityMap);
      formData.append('is_workshop', false);
      upsertMetaActivity(formData, {
        ...options,
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          setStep(STEP_OFFER);
          window.scrollTo(0, 0);
        },
      });
    },
  })),
  withState('offerIsProcessing', 'setOfferIsProcessing', false),
  withState('offerHadError', 'setOfferHadError', null),
  withProps(
    ({
      upsertedMetaActivity,
      fetchAllOffers,
      setOfferIsProcessing,
      setOfferHadError,
      setStep,
    }) => ({
      createOffers: async (data: *) => {
        setOfferIsProcessing(true);
        setOfferHadError(null);
        createOffersAPI(upsertedMetaActivity.id, data)
          .then(() => {
            fetchAllOffers();
            setStep(STEP_PASS);
            window.scrollTo(0, 0);
          })
          .catch((err) => {
            console.error(err);
            setOfferIsProcessing(false);
            setOfferHadError(err);
          });
      },
    }),
  ),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityFormPage'),
  ),
  withHandlers({
    createPaymentPack:
      ({
        createOrUpdatePaymentPackAction,
        fetchAllPaymentPacks,
        goToPaymentPack,
      }) =>
      (data: any, options: OptionCallBack) => {
        createOrUpdatePaymentPackAction(data, {
          ...options,
          onSuccess: (res) => {
            options.onSuccess(res);
            fetchAllPaymentPacks();
            goToPaymentPack(res.id);
          },
        });
      },
  }),
)(MetaActivityFormPage);
