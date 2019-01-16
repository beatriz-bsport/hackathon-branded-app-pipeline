// @flow
import React, { Component } from 'react';

import {
  Button,
  Grid,
  List,
  ListItem,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import PriceInput from '../../input/PriceInput.component';
import { Moment } from '../../../i18n';
import PaymentPackSummary from '../../payment-pack/PaymentPackSummary.component';
import type {
  Coach,
  Establishment,
  Offer,
  PaymentPack as PaymentPackType,
} from '../../../api/types';
import { formatAsTime } from '../../../datetime';

import DateTimeForm from './DateTimeForm.component';
import RecursionToogle from './RecursionToogle.component';
import EstablishmentSubForm from './EstablishmentSubForm.component';
import CoachSubForm from './CoachSubForm.component';
import NotificationToogle from './NotificationToogle.component';

type Props = {
  processing: boolean,
  similarOfferLoading: boolean,
  t: TFunction,

  offer: Offer,
  similarOffers: Array<Offer>,
  compatiblePacks: Array<PaymentPackType>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,

  onCancel: () => void,
  fetchSimilarOffers: (id: number) => void,
  onConfirm: ({ offerId: number, data: FormData }) => void,
};

type State = {
  hour: string,
  step: number,
  coach: number,
  price_coach: number,
  establishment: number,
  modifyRecursively: boolean,
  notifyConsumers: boolean,
  date: Object,

  coach_override: ?Coach,
  establishment_override: ?Establishment,
  isSimilarOfferListExpanded: boolean,
};

export type FormData = Object;

function pad(n) {
  return n < 10 ? `0${n}` : n;
}

const STEPS = {
  GATHER_INFO: 0,
  SHOW_WARNING: 1,
};

export class EditLiveOfferForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSimilarOfferListExpanded: true,
      step: STEPS.GATHER_INFO,
      modifyRecursively: false,
      notifyConsumers: true,
      establishment: props.offer.etablissement.id,
      establishment_override: props.offer.establishment_override
        ? props.offer.establishment_override.id
        : null,
      coach: props.offer.coach.id,
      coach_override: props.offer.coach_override
        ? props.offer.coach_override.id
        : null,
      date: Moment(props.offer.date_start),
      hour: formatAsTime(Moment(props.offer.date_start)),
      price_coach: props.offer.price_coach,
    };
    this.initialOfferState = {
      date_start: Moment(props.offer.date_start),
      coach_override: props.offer.coach_override
        ? props.offer.coach_override.id
        : null,
      establishment_override: props.offer.establishment_override
        ? props.offer.establishment_override.id
        : null,
      coach: props.offer.coach.id,
      establishment: props.offer.etablissement.id,
      price_coach: props.offer.price_coach,
    };
  }

  componentDidMount() {
    this.props.fetchSimilarOffers(this.props.offer.id);
  }

  expandSimilarOfferList = () => {
    this.setState((prevState) => ({
      isSimilarOfferListExpanded: !prevState.isSimilarOfferListExpanded,
    }));
  };

  shouldModifyAllDates = () =>
    this.state.modifyRecursively ||
    this.hasChangedCoach() ||
    this.hasChangedEstablishment();

  hasChangePrice = () => {
    const { price_coach } = this.state;
    return price_coach !== this.initialOfferState.price_coach;
  };

  hasChangedDatetime = () => {
    const { date, hour } = this.state;
    const initialDateStart = this.initialOfferState.date_start;
    return (
      date.date() !== initialDateStart.date() ||
      date.month() !== initialDateStart.month() ||
      date.year() !== initialDateStart.year() ||
      Moment(hour, 'HH:mm').hour() !== initialDateStart.hour() ||
      Moment(hour, 'HH:mm').minute() !== initialDateStart.minute()
    );
  };

  hasChangedCoach = () => {
    const { coach } = this.state;
    return coach !== this.initialOfferState.coach;
  };

  hasChangedSubstituteCoach = () => {
    const { coach_override } = this.state;
    return coach_override !== this.initialOfferState.coach_override;
  };

  hasChangedEstablishment = () => {
    const { establishment } = this.state;
    return establishment !== this.initialOfferState.establishment;
  };

  hasChangedSubstituteEstablishment = () => {
    const { establishment_override } = this.state;
    return (
      establishment_override !== this.initialOfferState.establishment_override
    );
  };

  hasChangePrice = () => {
    const { price_coach } = this.state;
    return price_coach !== this.initialOfferState.price_coach;
  };

  onConfirm = () => {
    const { offer } = this.props;
    const {
      notifyConsumers,
      date,
      hour,
      establishment,
      coach,
      establishment_override,
      coach_override,
      price_coach,
    } = this.state;
    const data: FormData = {
      notifyConsumers,
      modifyAllDates: this.shouldModifyAllDates(),
    };
    if (this.hasChangedDatetime()) {
      data.date_start = Moment(
        `${pad(date.date())}/${pad(date.month() + 1)}/${pad(date.year())} ${pad(
          Moment(hour, 'HH:mm').hour(),
        )}:${pad(Moment(hour, 'HH:mm').minute())}`,
        'DD/MM/YYYY hh:mm',
      );
    }

    data.coach = coach;
    data.establishment = establishment;
    data.establishment_override = establishment_override;
    data.coach_override = coach_override;

    if (this.hasChangePrice()) {
      data.price_coach = price_coach;
    }

    this.props.onConfirm({ offerId: offer.id, data });
  };

  onFormFieldChange = (id: string) => (value: *) => {
    this.setState({ [id]: value });
  };

  renderPrice = () => (
    <PriceInput
      value={this.state.price_coach}
      onChange={(e) => this.onFormFieldChange('price_coach')(e.target.value)}
    />
  );

  renderButton = () => {
    const { t, similarOfferLoading, onCancel, processing } = this.props;
    if (processing) {
      return (
        <Grid
          container
          item
          justify="flex-end"
          alignItems="center"
          direction="row"
        >
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        direction="row"
        spacing={16}
      >
        <Grid item onClick={onCancel}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
        </Grid>
        <Grid item>
          <Button
            onClick={this.onConfirm}
            variant="contained"
            color="primary"
            disabled={
              (similarOfferLoading && this.shouldModifyAllDates()) ||
              !(
                this.hasChangedCoach() ||
                this.hasChangedSubstituteCoach() ||
                this.hasChangedEstablishment() ||
                this.hasChangedSubstituteEstablishment() ||
                this.hasChangedDatetime() ||
                this.hasChangePrice()
              )
            }
          >
            {t('common.confirm')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  onConfirmGatherInfoStep = () => {
    if (this.shouldModifyAllDates()) {
      this.setState({ step: STEPS.SHOW_WARNING });
    } else {
      this.onConfirm();
    }
  };

  renderNextStepButton = () => {
    const { t, onCancel, similarOfferLoading } = this.props;
    return (
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        direction="row"
        spacing={16}
      >
        <Grid item onClick={onCancel}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={
              (similarOfferLoading && this.shouldModifyAllDates()) ||
              !(
                this.hasChangedCoach() ||
                this.hasChangedSubstituteCoach() ||
                this.hasChangedSubstituteEstablishment() ||
                this.hasChangedDatetime() ||
                this.hasChangePrice()
              )
            }
            onClick={this.onConfirmGatherInfoStep}
          >
            {t('common.continue')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  renderWarning = () => {
    const { compatiblePacks, t } = this.props;
    // eslint-disable-next-line
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography>{t('form.offer.warningPackonEdit')}</Typography>
        </Grid>
        <List>
          {compatiblePacks.map((cp) => (
            <ListItem>
              <PaymentPackSummary paymentPack={cp} key={cp.id} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  };

  renderChangeForm = () => (
    <Grid container direction="column" spacing={40}>
      <Grid item>
        <Typography variant="title">
          {this.props.t('calendar.modifyOffer')}
        </Typography>
      </Grid>
      <Grid item>{this.renderPrice()}</Grid>
      <Grid item>
        <DateTimeForm
          date={this.state.date}
          hour={this.state.hour}
          onFormFieldChange={this.onFormFieldChange}
        />
      </Grid>
      <Grid item>
        <CoachSubForm
          hasChangedCoach={this.hasChangedCoach()}
          onFormFieldChange={this.onFormFieldChange}
          onDeleteCoachSubstitute={() =>
            this.setState({ coach_override: null })
          }
          coaches={this.props.coaches}
          coach={this.state.coach}
          coach_override={this.state.coach_override}
          offer={this.props.offer}
        />
      </Grid>
      <Grid item>
        <EstablishmentSubForm
          onFormFieldChange={this.onFormFieldChange}
          establishment={this.state.establishment}
          establishments={this.props.establishments}
          establishment_override={this.state.establishment_override}
          offer={this.props.offer}
          hasChangedEstablishment={this.hasChangedEstablishment()}
        />
      </Grid>
      <Grid item>
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <NotificationToogle
              notifyConsumers={this.state.notifyConsumers}
              onNotificationChange={(notifyConsumers) =>
                this.setState({ notifyConsumers })
              }
            />
          </Grid>
          <Grid item>
            <RecursionToogle
              loading={this.props.similarOfferLoading}
              similarOffers={this.props.similarOffers}
              shouldModifyAllDates={this.shouldModifyAllDates()}
              disabled={
                this.hasChangedCoach() || this.hasChangedEstablishment()
              }
              onChangeRecursion={() =>
                this.setState((prevState) => ({
                  modifyRecursively: !prevState.modifyRecursively,
                }))
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{this.renderNextStepButton()}</Grid>
    </Grid>
  );

  renderConfirmChange = () => (
    <Grid container direction="column" spacing={32}>
      <Grid item>
        <Typography variant="title">
          {this.props.t('calendar.modifyOffer')}
        </Typography>
      </Grid>
      <Grid item>{this.renderWarning()}</Grid>
      <Grid item>{this.renderButton()}</Grid>
    </Grid>
  );

  render() {
    switch (this.state.step) {
      case STEPS.GATHER_INFO:
      default:
        return this.renderChangeForm();

      case STEPS.SHOW_WARNING:
        return this.renderConfirmChange();
    }
  }
}

export default translate()(EditLiveOfferForm);
