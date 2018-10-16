// @flow
import React, { Component } from 'react';

import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
  Grid,
  withStyles,
  Collapse,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import PaymentPackInput from '../input/PaymentPackInput.component';
import OfferInput from '../input/OfferInput.component';
import PaymentForm from './PaymentForm.component';
import PaymentSummary from './PaymentSummary.component';

import type { Offer, Activity, PaymentPack } from '../../api/types';
import type { PaymentFormData } from './types';

const BOOKING = 'BOOKING';
const PAYMENT_PACK = 'PAYMENT_PACK';
const NOTHING = 'NOTHING';

type Props = {
  t: (x: string) => string,
  classes: Object,
  offers: Array<Offer>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,
  cancel: () => void,
};

type State = {
  // UNUSED but will be
  // eslint-disable-next-line
  offerId: ?number,
  registeredPayments: Array<{ id: number, paymentData: PaymentFormData }>,
  paymentIdSeed: number,
  paymentPackId: ?number,
  payedObjectType: ?string,
};

export class InvoiceForm extends Component<Props, State> {
  state = {
    // UNUSED but will be
    // eslint-disable-next-line
    offerId: null,
    paymentPackId: null,
    registeredPayments: [],
    paymentIdSeed: 0,
    payedObjectType: NOTHING,
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    return this.state;
  };

  // UNUSED but will be
  // eslint-disable-next-line
  storeOfferId = (offerId: number) => {
    // UNUSED but will be
    // eslint-disable-next-line
    this.setState({ offerId });
  };

  storePaymentPackId = (paymentPackId: number) => {
    this.setState({ paymentPackId });
  };

  storePayment = (data: PaymentFormData) => {
    this.setState((prevState) => ({
      registeredPayments: [
        ...prevState.registeredPayments,
        { paymentData: data, id: prevState.paymentIdSeed },
      ],
      paymentIdSeed: prevState.paymentIdSeed + 1,
    }));
  };

  deletePaymentData = (id: number) => {
    this.setState((prevState) => ({
      registeredPayments: prevState.registeredPayments.filter(
        (rp) => rp.id !== id,
      ),
    }));
  };

  handleObjectTypeChange = (event: Object) => {
    console.log(event.target.value);
    this.setState({ payedObjectType: event.target.value });
  };

  renderObjectTypeChoser = () => {
    const { t, classes } = this.props;
    const { offers, activities, paymentPacks } = this.props;
    const { paymentPackId, payedObjectType } = this.state;
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">
          {t('form.invoice.objectTypeLabel')}
        </FormLabel>
        <RadioGroup
          aria-label="ObjectType"
          name="objectType"
          value={payedObjectType}
          onChange={this.handleObjectTypeChange}
        >
          <FormControlLabel
            value={BOOKING}
            control={<Radio />}
            label={t('common.booking')}
          />
          <Collapse in={BOOKING === payedObjectType}>
            <OfferInput
              offers={offers}
              activities={activities}
              offerHelperText={t('form.invoice.offerHelper')}
              activityHelperText={t('form.invoice.activityHelper')}
            />
          </Collapse>
          <FormControlLabel
            value={PAYMENT_PACK}
            control={<Radio />}
            label={t('common.paymentPack')}
          />
          <Collapse in={PAYMENT_PACK === payedObjectType}>
            <PaymentPackInput
              value={paymentPackId}
              paymentPacks={paymentPacks}
              onChange={this.storePaymentPackId}
              helperText={t('form.invoice.paymentPackHelper')}
            />
          </Collapse>
          <FormControlLabel
            value={NOTHING}
            control={<Radio />}
            label={t('form.invoice.noPayedObject')}
          />
        </RadioGroup>
      </FormControl>
    );
  };

  render() {
    const { t, classes } = this.props;
    const { registeredPayments } = this.state;
    return (
      <form>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <Typography variant="title">{t('form.invoice.title')}</Typography>
          </Grid>
          <Grid item>
            <Grid item>{this.renderObjectTypeChoser()}</Grid>
          </Grid>
          <Grid item>
            <FormControl>
              <FormLabel component="legend">
                {t('form.invoice.paymentLabel')}
              </FormLabel>
              <div className={classes.insideForm}>
                <PaymentForm onSubmit={this.storePayment} />
              </div>
            </FormControl>
            <Grid
              container
              direction="column"
              spacing={8}
              className={classes.registeredPaymentContainer}
            >
              {registeredPayments.map((rp) => (
                <Grid item xs={12}>
                  <PaymentSummary
                    payment={rp.paymentData}
                    id={rp.id}
                    key={rp.id}
                    onDelete={() => this.deletePaymentData(rp.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <Grid container justify="flex-start" spacing={16}>
              <Grid item>
                <Button onClick={this.props.cancel}>
                  {t('common.cancel')}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={this.onSubmit}
                  type="submit"
                  color="primary"
                  variant="raised"
                >
                  {t('common.save')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

const styles = (theme) => ({
  registeredPaymentContainer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  insideForm: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    backgroundColor: '#FAFAFA',
  },
});

export default withStyles(styles)(translate()(InvoiceForm));
