// @flow

import React, { Component } from 'react';

import {
  Tabs,
  Tab,
  Paper,
  Button,
  Collapse,
  Grid,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { translate } from 'react-i18next';

import OfferInput from '../input/OfferInput.component';
import PaymentPackInput from '../input/PaymentPackInput.component';

type Props = {
  t: (x: string) => string,
  classes: Object,
  offers: Array<Offer>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,
  onAddOffer: (offerId: number) => void,
  onAddPaymentPack: (paymentPackId: number) => void,
};

const SELECTOR_OFFER = 0;
const SELECTOR_PAYMENT_PACK = 1;

export class InvoiceItemSelector extends Component<Props> {
  state = {
    expandedSelector: SELECTOR_OFFER,
    offerId: null,
    paymentPackId: null,
  };

  onSelectorChange = (event, value) => {
    this.setState({ expandedSelector: value });
  };

  storePaymentPackId = (event) => {
    console.log(event);
    this.setState({ paymentPackId: event });
  };

  storeOfferId = (event) => {
    console.log(event);
    this.setState({ offerId: event });
  };

  submitInvoiceItems = () => {
    switch (this.state.expandedSelector) {
      case SELECTOR_OFFER:
        this.props.onAddOffer(this.state.offerId);
        break;
      case SELECTOR_PAYMENT_PACK:
      default:
        this.props.onAddPaymentPack(this.state.paymentPackId);
    }
  };

  render() {
    const { offers, activities, paymentPacks, classes, t } = this.props;
    const { paymentPackId, offerId } = this.state;
    const { expandedSelector } = this.state;
    return (
      <div className={classes.container}>
        <Paper>
          <Tabs
            value={expandedSelector}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.onSelectorChange}
            fullWidth
          >
            <Tab label={t('payment.addOffer')} value={SELECTOR_OFFER} />
            <Tab
              label={t('payment.addPaymentPack')}
              value={SELECTOR_PAYMENT_PACK}
            />
          </Tabs>
        </Paper>
        <Grid
          container
          direction="column"
          className={classes.innerList}
          justify="space-between"
        >
          <Grid item className={classes.input}>
            <Collapse in={SELECTOR_OFFER === expandedSelector}>
              <OfferInput
                offers={offers}
                activities={activities}
                offerHelperText={t('form.invoice.offerHelper')}
                activityHelperText={t('form.invoice.activityHelper')}
                onChange={this.storeOfferId}
              />
            </Collapse>
            <Collapse in={SELECTOR_PAYMENT_PACK === expandedSelector}>
              <PaymentPackInput
                value={paymentPackId}
                paymentPacks={paymentPacks}
                onChange={this.storePaymentPackId}
                helperText={t('form.invoice.paymentPackHelper')}
              />
            </Collapse>
          </Grid>
          <Grid item className={classes.addButton}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.submitInvoiceItems}
              disabled={
                // prettier-ignore
                (expandedSelector === SELECTOR_OFFER && !offerId)
                || (expandedSelector === SELECTOR_PAYMENT_PACK && !paymentPackId)
              }
            >
              <AddIcon className={classes.leftIcon} />
              {t('payment.addInvoiceItem')}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    height: '100%',
    flexGrow: 1,
  },
  innerList: {
    flexGrow: 1,
    height: '100%',
    marginTop: -theme.spacing.unit * 6, // TODO understand why
    padding: theme.spacing.unit * 4,
  },
  input: {
    paddingTop: theme.spacing.unit * 2, // TODO understand why
  },
  addButton: {
    marginTop: theme.spacing.unit * 4,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(translate()(InvoiceItemSelector));
