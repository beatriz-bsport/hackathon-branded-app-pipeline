// @flow
import React, { Component } from 'react';

import {
  Checkbox,
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
import { Moment } from '../../i18n';
import PaymentPackSummary from '../consumer/PaymentPackSummary.component';
import type { Offer, PaymentPack as PaymentPackType } from '../../api/types';

type Props = {
  t: (x: string) => string,
  onConfirm: ({ offerId: number, data: FormData }) => void,
  onCancel: () => void,
  processing: boolean,
  offer: Offer,
  compatiblePacks: Array<PaymentPackType>,
};

type State = {
  changeDateTime: boolean,
  changeCoach: boolean,
  changeEstablishment: boolean,
  modifyRecursively: boolean,
  notifyConsumers: boolean,
  establishment: number,
  coach: number,
  date: Object,
  hour: Object,
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
      changeDateTime: false,
      changeCoach: false,
      changeEstablishment: false,
      modifyRecursively: false,
      notifyConsumers: true,
      establishment: props.offer.etablissement.id,
      coach: props.offer.coach.id,
      date: Moment(props.offer.date_start),
      hour: Moment(props.offer.date_start),
      forcedPaymentPackMigrations: {},
    };
  }

  onConfirm = () => {
    const { offer } = this.props;
    const {
      notifyConsumers,
      modifyRecursively,
      changeCoach,
      changeEstablishment,
      changeDateTime,
      date,
      hour,
      establishment,
      coach,
      forcedPaymentPackMigrations,
    } = this.state;
    const data: FormData = { notifyConsumers, modifyRecursively };
    if (changeDateTime) {
      data.date_start = Moment(
        `${pad(date.date())}/${pad(date.month() + 1)}/${pad(date.year())} ${pad(
          hour.hour(),
        )}:${pad(hour.minute())}`,
        'DD/MM/YYYY hh:mm',
      );
    }
    if (changeCoach) {
      data.coach = coach;
    }
    if (changeEstablishment) {
      data.establishment = establishment;
    }
    if (modifyRecursively) {
      data.forcedPaymentPackMigrations = forcedPaymentPackMigrations;
    }
    this.props.onConfirm({ offerId: offer.id, data });
  };

  onFormFieldChange = (id) => (value) => {
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
            <Checkbox
              onChange={(event) => {
                this.setState({ changeDateTime: event.target.checked });
              }}
            />
          </Grid>
          <Grid item>
            <FormField
              id="date"
              value={this.state.date}
              onChange={this.onFormFieldChange}
              disabled={!this.state.changeDateTime}
            />
          </Grid>
          <Grid item>
            <FormField
              id="hour"
              value={this.state.hour}
              onChange={this.onFormFieldChange}
              disabled={!this.state.changeDateTime}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  renderModifyCoach = () => (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="caption">
          {this.props.t('form.offer.changeCoach')}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item>
            <Checkbox
              onChange={(event) => {
                this.setState({ changeCoach: event.target.checked });
              }}
            />
          </Grid>
          <Grid item>
            <FormField
              id="coach"
              onChange={this.onFormFieldChange}
              disabled={!this.state.changeCoach}
              choices={this.props.coaches}
              value={this.state.coach}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  renderModifyEstablishment = () => (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="caption">
          {this.props.t('form.offer.changeEstablishment')}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={16} alignItems="center">
          <Grid item>
            <Checkbox
              onChange={(event) => {
                this.setState({ changeEstablishment: event.target.checked });
              }}
            />
          </Grid>
          <Grid item>
            <FormField
              id="establishment"
              onChange={this.onFormFieldChange}
              disabled={!this.state.changeEstablishment}
              choices={this.props.establishments}
              value={this.state.establishment}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
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
    const { changeDateTime, changeCoach, changeEstablishment } = this.state;
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
            variant="raised"
            color="primary"
            disabled={!(changeDateTime || changeCoach || changeEstablishment)}
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
    const { changeDateTime, changeCoach, changeEstablishment } = this.state;
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
            variant="raised"
            color="primary"
            disabled={!(changeDateTime || changeCoach || changeEstablishment)}
            onClick={this.onConfirmGatherInfoStep}
          >
            {t('common.continue')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  selectPaymentPackMigration = (id: number) => (event: Object) => {
    const { forcedPaymentPackMigrations } = this.state;
    forcedPaymentPackMigrations[id] = event.target.checked;
    this.setState({ forcedPaymentPackMigrations });
  };

  renderWarning = () => {
    const { compatiblePacks } = this.props;
    const { forcedPaymentPackMigrations } = this.state;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography>
            Toutes les séances correspondant à cet horaire, ce jour de la
            semaine, ce coach, et cet établissement, seront modifiées.
            Attention: les abonnements suivants ne seront peut-être plus
            compatibles, pour forcer leur compatibilité, veuillez sélectionner
            les abonnements qui doivent rester compatibles. Les abonnements
            non-selectionnés garderont leurs règles initiales et ne seront pas
            modifiés.
          </Typography>
        </Grid>
        <List>
          {compatiblePacks.map((cp) => (
            <ListItem>
              <Switch
                checked={forcedPaymentPackMigrations[cp.id] || false}
                onClick={this.selectPaymentPackMigration(cp.id)}
              />
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
            <Grid item>{this.renderModifyDatetime()}</Grid>
            <Grid item>{this.renderModifyCoach()}</Grid>
            <Grid item>{this.renderModifyEstablishment()}</Grid>
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
