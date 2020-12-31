// @flow

import { withTranslation } from 'react-i18next';

import { push, goBack } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose, withState } from 'recompose';
import Grid from '@material-ui/core/Grid';

import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { fetchAllOffers as fetchAllOffersAction } from '../../libs/offer/actions';
import { mapFormData } from '../form.utils';
import { upsert } from '../../libs/meta-activity/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors.ts';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';
import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  resetCompatiblePaymentPacks as resetCompatiblePaymentPacksAction,
} from '../../libs/payment-packs/actions';

import withTitle from '../../hocs/with-title.hoc';
import themeSelectors from '../../libs/theme/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getActivityCompatiblePaymentPacks } from '../../libs/payment-packs/selectors';
import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';
import OfferForm from '../../libs/offer/OfferForm.component';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../../libs/meta-activity/selectors';
import CompatiblePaymentPacks from '../../libs/meta-activity/components/MetaActivityCompatiblePacks.component';
import { fetchEstablishments } from '../../libs/establishment/actions.ts';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions.ts';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors.ts';
import { Establishment } from '../../libs/establishment/types.ts';
import type { PaymentPack } from '../../libs/payment-packs/types';

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

  onSubmitMetaActivity: (*) => void,
  coaches: Array<Coach>,
  fetchAssociatedCoachesList: () => void,
  setStep: (step: StepType) => void,
  step: StepType,
  upsertedMetaActivity: ?MetaActivity,
  fetchPaymentPacks: (id: number) => void,
  offerHadError: ?Error,
  createOffers: (*) => void,
  offerIsProcessing: boolean,
  goToMetaActivity: (id: number) => void,
  t: TFunction,
  goToPaymentPackCreate: () => void,
  resetPaymentPacks: () => void,
  companyTheme: CompanyTheme,
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
  }

  renderActivityStep = () => (
    <MetaActivityForm
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
      error={this.props.offerHadError}
      processing={this.props.offerIsProcessing}
      discardButtonText={this.props.t('common.skip')}
      onCancel={() => this.props.setStep(STEP_PASS)}
      timezone={this.props.companyTheme.timezone_name}
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
      fetchAllOffers: fetchAllOffersAction,
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
)(MetaActivityFormPage);
