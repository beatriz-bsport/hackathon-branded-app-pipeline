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
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Moment } from '../../i18n';
import PaymentPackSummary from '../../components/payment-pack/PaymentPackSummary.component';
import DurationInput from '../../components/input/DurationInput.component';
import NumericInput from '../../components/input/NumericInput.component';
import type {
  Coach,
  Establishment,
  Offer,
  PaymentPack as PaymentPackType,
} from '../../api/types';
import { formatAsTime } from '../../datetime';

import DateTimeForm from './form/DateTimeForm.component';
import RecursionToogle from './form/RecursionToogle.component';
import EstablishmentSubForm from './form/EstablishmentSubForm.component';
import CoachSubForm from './form/CoachSubForm.component';
import NotificationToogle from './form/NotificationToogle.component';
import WarningForceRecursion from './form/WarningForceRecursion.component';

import LevelInput from '../../components/input/LevelInput.component';

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
  establishment: number,
  modifyRecursively: boolean,
  notifyConsumers: boolean,
  date: Object,
  duration_minute: ?number,

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

const FIELDS = [
  'establishment',
  'establishment_override',
  'coach',
  'coach_override',
  'duration_minute',
  'effectif',
  'credit_price_override',
  'waiting_list_max_size',
  'level',
];

const getModifiedFields = (oldData, newData) => {
  const modifiedFields = [];
  for (const field of FIELDS) {
    if (oldData[field] !== newData[field]) {
      modifiedFields.push(field);
    }
  }
  return modifiedFields;
};
const appendModifiedData = (oldData, newData, data) => {
  for (const field of FIELDS) {
    if (oldData[field] !== newData[field]) {
      // eslint-disable-next-line
      data[field] = newData[field];
    }
  }
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
      duration_minute: props.offer.duration_minute,
      hour: formatAsTime(Moment(props.offer.date_start)),
      effectif: props.offer.effectif,
      credit_price_override: props.offer.credit_price_override,
      waiting_list_max_size: props.offer.waiting_list_max_size,
      level: props.offer.level_id,
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
      duration_minute: props.offer.duration_minute,
      effectif: props.offer.effectif,
      credit_price_override: props.offer.credit_price_override,
      waiting_list_max_size: props.offer.waiting_list_max_size,
      level: props.offer.level_id,
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
    this.hasChangedEstablishment() ||
    this.hasChangedLevel();

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

  onConfirm = () => {
    const { offer } = this.props;
    const { notifyConsumers, date, hour } = this.state;
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

    appendModifiedData(this.initialOfferState, this.state, data);

    this.props.onConfirm({ offerId: offer.id, data });
  };

  onFormFieldChange = (id: string) => (value: *) => {
    this.setState({ [id]: value });
  };

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
                getModifiedFields(this.initialOfferState, this.state).length ||
                this.hasChangedDatetime()
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

  hasChangedCoach = () => this.state.coach !== this.initialOfferState.coach;

  hasChangedLevel = () => this.state.level !== this.initialOfferState.level;

  hasChangedEstablishment = () =>
    this.state.establishment !== this.initialOfferState.establishment;

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
                getModifiedFields(this.initialOfferState, this.state).length ||
                this.hasChangedDatetime()
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

  renderWarning = () => (
    <Grid container direction="column" spacing={16}>
      <Grid item>
        <Typography>{this.props.t('form.offer.warningPackonEdit')}</Typography>
      </Grid>
      <List>
        {this.props.compatiblePacks.map((cp) => (
          <ListItem>
            <PaymentPackSummary paymentPack={cp} key={cp.id} />
          </ListItem>
        ))}
      </List>
    </Grid>
  );

  renderBilling = () =>
    null /*
        <NumericInput
          required
          label={this.props.t('credit')}
          value={this.state.credit_price_override}
          onChange={(event) =>
            this.onFormFieldChange('credit_price_override')(event.target.value)
          }
	/>
	*/;

  renderChangeForm = () => (
    <Grid container direction="column" spacing={40}>
      <Grid item>
        <Typography variant="h6">
          {this.props.t('form.caracteristics')}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={16}>
          <Grid item>
            <NumericInput
              required
              label={this.props.t('offer.effectif')}
              value={this.state.effectif}
              onChange={(event) =>
                this.onFormFieldChange('effectif')(event.target.value)
              }
            />
          </Grid>
          <Grid item>
            <NumericInput
              required
              value={this.state.waiting_list_max_size}
              label={this.props.t('offer.sizeOfWaitingList')}
              onChange={(event) =>
                this.onFormFieldChange('waiting_list_max_size')(
                  event.target.value,
                )
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{this.renderBilling()}</Grid>
      <Grid item>
        <Typography variant="h6">
          {this.props.t('form.timeSettings')}
        </Typography>
      </Grid>
      <Grid item>
        <DateTimeForm
          date={this.state.date}
          hour={this.state.hour}
          onFormFieldChange={this.onFormFieldChange}
        />
      </Grid>
      <Grid item>
        <DurationInput
          required
          value={this.state.duration_minute}
          onChange={this.onFormFieldChange('duration_minute')}
        />
      </Grid>
      <Grid item>
        <LevelInput
          required
          value={this.state.level}
          onChange={(e) =>
            parseInt(this.onFormFieldChange('level')(e.target.value), 10)
          }
        />
        {this.state.level !== this.initialOfferState.level ? (
          <WarningForceRecursion
            text={this.props.t('form.offer.levelChangeWarning')}
          />
        ) : null}
      </Grid>
      <Grid item>
        <CoachSubForm
          coaches={this.props.coaches}
          coach={this.state.coach}
          coach_override={this.state.coach_override}
          offer={this.props.offer}
          hasChangedCoach={this.hasChangedCoach()}
          onFormFieldChange={this.onFormFieldChange}
          onDeleteCoachSubstitute={() =>
            this.setState({ coach_override: null })
          }
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
              similarOffers={this.props.similarOffers.filter(
                (o) => o.available,
              )}
              message={this.props.t('form.offer.explainRecursiveOfferEdit')}
              listTitle={this.props.t('offer.offersPendingChange')}
              shouldModifyAllDates={this.shouldModifyAllDates()}
              disabled={
                this.hasChangedCoach() ||
                this.hasChangedEstablishment() ||
                this.hasChangedLevel()
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
        <Typography variant="h6">
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

export default withNamespaces()(EditLiveOfferForm);
