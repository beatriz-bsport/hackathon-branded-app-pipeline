// @flow

import { withNamespaces } from 'react-i18next';

import { goBack, push } from 'connected-react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withProps, compose, withState } from 'recompose';
import Grid from '@material-ui/core/Grid';

import type { TFunction } from 'react-i18next';
import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  paymentPack as paymentPackActions,
  offer as offerActions,
} from '../../actions';
import { mapFormData } from '../form.utils';
import { upsert } from '../../libs/meta-activity/actions/workshop-activity.actions';
import { associatedCoachSelector } from '../../libs/associated-coach/selectors';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';
import PaymentPackForm from '../../libs/payment-packs/PaymentPackForm.component';
import OfferForm from '../../libs/offer/OfferForm.component';

import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';

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

  associatedCoaches: *[],
  establishments: Array<Establishment>,
  SCTs: *[],

  onSubmitPass: (*) => void,
  onSubmitWorkshopActivity: (*) => void,
  metaActivitiesAndWorkshops: Array<MetaActivity>,
  step: StepType,
  setStep: (StepType) => void,
  upsertedWorkshop: ?MetaActivity,

  offerHadError: ?Error,
  createOffers: (*) => void,
  offerIsProcessing: boolean,
  goToWorkshop: (id: number) => void,
  fetchEstablishments: () => void,

  t: TFunction,
};
const MetaActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  is_workshop: 'is_workshop',
  category: 'category',
};

const StepperForm = withNamespaces(['metaActivity'])(
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
  componentWillMount() {
    this.props.fetchEstablishments();
  }

  renderActivityStep = () => (
    <MetaActivityForm
      variant="workshop"
      establishments={this.props.establishments}
      SCTs={this.props.SCTs}
      onSubmit={this.props.onSubmitWorkshopActivity}
      metaActivityNames={[]}
      initial={{ images: [] }}
    />
  );

  renderPassStep = () => {
    const availableCategoriesId = this.props.metaActivitiesAndWorkshops.map(
      (a) => a.category_id,
    );
    return (
      <PaymentPackForm
        onSubmit={this.props.onSubmitPass}
        categories={this.props.SCTs.filter(
          (c) => availableCategoriesId.indexOf(c.id) !== -1,
        )}
        metaActivities={this.props.metaActivitiesAndWorkshops}
        establishments={this.props.establishments}
        loading={this.props.loading}
        onCancel={() => this.props.setStep(STEP_OFFER)}
        onCancelText={this.props.t('common.skip')}
        initial={
          this.props.upsertedWorkshop
            ? { metaActivities: [this.props.upsertedWorkshop.id] }
            : null
        }
      />
    );
  };

  renderOfferStep = () => (
    <OfferForm
      metaActivity={this.props.upsertedWorkshop}
      coaches={this.props.associatedCoaches}
      establishments={this.props.establishments}
      error={this.props.offerHadError}
      onSubmit={this.props.createOffers}
      processing={this.props.offerIsProcessing}
      onCancel={() => this.props.goToWorkshop(this.props.upsertedWorkshop.id)}
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
      <Grid container justify="center" alignItems="center">
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

export default compose(
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  withState('step', 'setStep', STEP_ACTIVITY),
  connect(
    (state) => ({
      associatedCoaches: associatedCoachSelector.getActive(state),
      establishments: getAllEstablishments(state),
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
      metaActivityNames: [
        ...state.metaActivity.all,
        ...state.workshopActivity.all,
      ].map((ma) => ma.name),
      metaActivitiesAndWorkshops: [
        ...state.metaActivity.all,
        ...state.workshopActivity.all,
      ],
      upsertedWorkshop: state.workshopActivity.upsert.data,
    }),
    {
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      goToWorkshop: (id: number) => push(`/workshop-activity/${id}`),
      fetchPaymentPacks: paymentPackActions.fetchAll,
      createPass: paymentPackActions.createOrUpdate,
      fetchAllOffers: offerActions.fetchAllOffers,
      fetchEstablishments,
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
  withState('offerIsProcessing', 'setOfferIsProcessing', false),
  withState('offerHadError', 'setOfferHadError', null),
  withProps(
    ({
      upsertedWorkshop,
      fetchAllOffers,
      goToWorkshop,
      setOfferIsProcessing,
      setOfferHadError,
    }) => ({
      createOffers: async (data: *) => {
        setOfferIsProcessing(true);
        setOfferHadError(null);
        createOffersAPI(upsertedWorkshop.id, data)
          .then(() => {
            fetchAllOffers();
            goToWorkshop(upsertedWorkshop.id);
          })
          .catch((err) => {
            console.error(err);
            setOfferIsProcessing(false);
            setOfferHadError(err);
          });
      },
    }),
  ),
  withDrawer(({ t }: { t: TFunction }) =>
    t('appbar.title.metaActivityFormPage'),
  ),
)(WorkshopActivityFormPage);
