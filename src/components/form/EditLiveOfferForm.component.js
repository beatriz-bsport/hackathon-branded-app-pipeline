// @flow
import React, { Component } from 'react';

import {
  Switch,
  Button,
  Grid,
  List,
  ListItem,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import FormField from '../input/FormField.component';
import PriceInput from '../input/PriceInput.component';
import { Moment } from '../../i18n';
import PaymentPackSummary from '../consumer/PaymentPackSummary.component';
import type {
  Coach,
  Establishment,
  Offer,
  PaymentPack as PaymentPackType,
} from '../../api/types';
import { formatAsTime } from '../../datetime';

type Props = {
  t: (x: string) => string,
  onConfirm: ({ offerId: number, data: FormData }) => void,
  onCancel: () => void,
  processing: boolean,
  offer: Offer,
  compatiblePacks: Array<PaymentPackType>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
};

type State = {
  price_coach: number,
  modifyRecursively: boolean,
  notifyConsumers: boolean,
  establishment: number,
  coach: number,
  date: Object,
  hour: string,
  step: number,
  forcedPaymentPackMigrations: Object,
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
      step: STEPS.GATHER_INFO,
      modifyRecursively: false,
      notifyConsumers: true,
      establishment: props.offer.etablissement.id,
      coach: props.offer.coach.id,
      date: Moment(props.offer.date_start),
      hour: formatAsTime(Moment(props.offer.date_start)),
      forcedPaymentPackMigrations: {},
      price_coach: props.offer.price_coach,
    };
    this.initialOfferState = {
      date_start: Moment(props.offer.date_start),
      coach: props.offer.coach.id,
      establishment: props.offer.etablissement.id,
      price_coach: props.offer.price_coach,
    };
  }

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

  hasChangedEstablishment = () => {
    const { establishment } = this.state;
    return establishment !== this.initialOfferState.establishment;
  };

  hasChangePrice = () => {
    const { price_coach } = this.state;
    return price_coach !== this.initialOfferState.price_coach;
  };

  onConfirm = () => {
    const { offer } = this.props;
    const {
      notifyConsumers,
      modifyRecursively,
      date,
      hour,
      establishment,
      coach,
      forcedPaymentPackMigrations,
      price_coach,
    } = this.state;
    const data: FormData = { notifyConsumers, modifyRecursively };
    if (this.hasChangedDatetime()) {
      data.date_start = Moment(
        `${pad(date.date())}/${pad(date.month() + 1)}/${pad(date.year())} ${pad(
          Moment(hour, 'HH:mm').hour(),
        )}:${pad(Moment(hour, 'HH:mm').minute())}`,
        'DD/MM/YYYY hh:mm',
      );
    }
    if (this.hasChangedCoach()) {
      data.coach = coach;
    }
    if (this.hasChangedEstablishment()) {
      data.establishment = establishment;
    }
    if (modifyRecursively) {
      // forcedPaymentPackMigrations is not used in backend
      data.forcedPaymentPackMigrations = forcedPaymentPackMigrations;
    }
    if (this.hasChangePrice()) {
      data.price_coach = price_coach;
    }

    this.props.onConfirm({ offerId: offer.id, data });
  };

  onFormFieldChange = (id: string) => (value: *) => {
    this.setState({ [id]: value });
  };

  renderModifyDatetime = () => (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="caption">
          {this.props.t('form.offer.changeDate')}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item>
            <FormField
              id="date"
              value={this.state.date}
              onChange={this.onFormFieldChange}
            />
          </Grid>
          <Grid item>
            <FormField
              id="hour"
              value={this.state.hour}
              onChange={this.onFormFieldChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  renderModifyCoach = () => (
    <FormField
      id="coach"
      onChange={this.onFormFieldChange}
      choices={this.props.coaches}
      value={this.state.coach}
    />
  );

  renderModifyEstablishment = () => (
    <FormField
      id="establishment"
      onChange={this.onFormFieldChange}
      choices={this.props.establishments}
      value={this.state.establishment}
    />
  );

  renderPrice = () => (
    <PriceInput
      value={this.state.price_coach}
      onChange={(e) => this.onFormFieldChange('price_coach')(e.target.value)}
    />
  );

  renderRecursiveToogle = () => {
    const { t } = this.props;
    return (
      <Grid container direction="row" spacing={16} alignItems="center">
        <Grid item>
          <Switch
            color="primary"
            checked={this.state.modifyRecursively}
            onChange={(event) => {
              this.setState({ modifyRecursively: event.target.checked });
            }}
          />
        </Grid>
        <Grid item>
          <Typography>{t('form.offer.explainRecursiveOfferEdit')}</Typography>
        </Grid>
      </Grid>
    );
  };

  renderNotificationToogle = () => {
    const { t } = this.props;
    return (
      <Grid container direction="row" spacing={16} alignItems="center">
        <Grid item>
          <Switch
            color="primary"
            checked={this.state.notifyConsumers}
            onChange={(event) => {
              this.setState({ notifyConsumers: event.target.checked });
            }}
          />
        </Grid>
        <Grid item>
          <Typography>{t('form.offer.explainNotificationOnEdit')}</Typography>
        </Grid>
      </Grid>
    );
  };

  renderConfigSwitches = () => (
    <Grid container direction="column" spacing={8}>
      <Grid item>{this.renderRecursiveToogle()}</Grid>
      <Grid item>{this.renderNotificationToogle()}</Grid>
    </Grid>
  );

  renderButton = () => {
    const { t, onCancel, processing } = this.props;
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
              !(
                this.hasChangedCoach() ||
                this.hasChangedEstablishment() ||
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
    const { modifyRecursively } = this.state;
    if (modifyRecursively) {
      this.setState({ step: STEPS.SHOW_WARNING });
    } else {
      this.onConfirm();
    }
  };

  renderNextStepButton = () => {
    const { t, onCancel } = this.props;
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
              !(
                this.hasChangedCoach() ||
                this.hasChangedEstablishment() ||
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

  selectPaymentPackMigration = (id: number) => (event: Object) => {
    // forcedPaymentPackMigrations is not used in backend
    const { forcedPaymentPackMigrations } = this.state;
    forcedPaymentPackMigrations[id] = event.target.checked;
    this.setState({ forcedPaymentPackMigrations });
  };

  renderWarning = () => {
    const { compatiblePacks, t } = this.props;
    // eslint-disable-next-line
    const { forcedPaymentPackMigrations } = this.state;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography>{t('form.offer.warningPackonEdit')}</Typography>
        </Grid>
        <List>
          {compatiblePacks.map((cp) => (
            <ListItem>
              {/*
              <Switch
                checked={forcedPaymentPackMigrations[cp.id] || false}
                onClick={this.selectPaymentPackMigration(cp.id)}
              />
              */}
              <PaymentPackSummary paymentPack={cp} key={cp.id} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  };

  render() {
    const { t } = this.props;
    const { step } = this.state;
    switch (step) {
      case STEPS.GATHER_INFO:
      default:
        return (
          <Grid container direction="column" spacing={32}>
            <Grid item>
              <Typography variant="title">
                {t('calendar.modifyOffer')}
              </Typography>
            </Grid>
            <Grid item>{this.renderPrice()}</Grid>
            <Grid item>{this.renderModifyDatetime()}</Grid>
            <Grid item>
              <Grid container direction="row" sacing={16}>
                <Grid item>{this.renderModifyCoach()}</Grid>
                <Grid item>{this.renderModifyEstablishment()}</Grid>
              </Grid>
            </Grid>
            <Grid item>{this.renderConfigSwitches()}</Grid>
            <Grid item>{this.renderNextStepButton()}</Grid>
          </Grid>
        );
      case STEPS.SHOW_WARNING:
        return (
          <Grid container direction="column" spacing={32}>
            <Grid item>
              <Typography variant="title">
                {t('calendar.modifyOffer')}
              </Typography>
            </Grid>
            <Grid item>{this.renderWarning()}</Grid>
            <Grid item>{this.renderButton()}</Grid>
          </Grid>
        );
    }
  }
}

export default translate()(EditLiveOfferForm);
