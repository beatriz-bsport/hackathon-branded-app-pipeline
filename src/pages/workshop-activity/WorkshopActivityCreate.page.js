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
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { fetchAllOffers as fetchAllOffersActions } from '../../libs/offer/actions';
import {
  fetchAllPaymentPacks as fetchAllPaymentPacksAction,
  createOrUpdate as createOrUpdatePaymentPack,
} from '../../libs/payment-packs/actions';
import { mapFormData } from '../form.utils';
import { upsert } from '../../libs/meta-activity/actions';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../../libs/meta-activity/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';
import themeSelectors from '../../libs/theme/selectors';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';
import PaymentPackForm from '../../libs/payment-packs/components/PaymentPackForm.component';
import OfferForm from '../../libs/offer/OfferForm.component';

import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
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
  goToPreviousPage: () => void,
  classes: Object,

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
  fetchAssociatedCoachesList: () => void,

  t: TFunction,
};
const MetaActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  is_workshop: 'is_workshop',
  SCT: 'SCT',
  color: 'color',
  is_broadcast: 'is_broadcast',
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
    this.props.fetchAssociatedCoachesList();
  }

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

const styles = () => ({
  container: {
    marginBottom: '20vh',
  },
});

export default compose(
  withNamespaces([]),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withState('step', 'setStep', STEP_ACTIVITY),
  connect(
    (state) => ({
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
    }),
    {
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      goToWorkshop: (id: number) => push(`/workshop-activity/${id}`),
      fetchPaymentPacks: fetchAllPaymentPacksAction,
      createPass: createOrUpdatePaymentPack,
      fetchAllOffers: fetchAllOffersActions,
      fetchEstablishments,
      fetchAssociatedCoachesList,
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
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:workshopActivity.workshopActivityCreate'),
  ),
)(WorkshopActivityFormPage);
