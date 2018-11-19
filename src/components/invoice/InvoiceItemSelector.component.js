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

import DatePicker from 'material-ui-pickers/DatePicker';
import OfferInput from '../input/OfferInput.component';
import PaymentPackInput from '../input/PaymentPackInput.component';
import { Moment } from '../../i18n';

type Props = {
  t: (x: string) => string,
  classes: Object,
  events: Array<Event>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,
  showCancel: ?boolean,
  onCancel: ?() => void,
  onAddOffer: (offerId: number) => void,
  onAddPaymentPack: (paymentPackId: number) => void,
};

const SELECTOR_OFFER = 0;
const SELECTOR_PAYMENT_PACK = 1;

export class InvoiceItemSelector extends Component<Props> {
  state = {
    expandedSelector: SELECTOR_PAYMENT_PACK,
    offerId: null,
    paymentPackId: null,
    date_bought: Moment(),
  };

  onSelectorChange = (event, value) => {
    this.setState({ expandedSelector: value });
  };

  storePaymentPackId = (event) => {
    this.setState({ paymentPackId: event });
  };

  storeOfferId = (event) => {
    this.setState({ offerId: event });
  };

  submitInvoiceItems = () => {
    switch (this.state.expandedSelector) {
      case SELECTOR_OFFER:
        this.props.onAddOffer(this.state.offerId);
        break;
      case SELECTOR_PAYMENT_PACK:
      default:
        this.props.onAddPaymentPack(
          this.state.paymentPackId,
          this.state.date_bought,
        );
    }
  };

  render() {
    const {
      events,
      activities,
      paymentPacks,
      classes,
      t,
      onCancel,
      showCancel,
    } = this.props;
    const { paymentPackId, offerId } = this.state;
    const selectedPaymentPack = paymentPacks.find(
      (pp) => pp.id === paymentPackId,
    );
    const { expandedSelector } = this.state;
    // <Tab label={t('payment.addOffer')} value={SELECTOR_OFFER} />
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
                events={events}
                activities={activities}
                offerHelperText={t('form.invoice.offerHelper')}
                activityHelperText={t('form.invoice.activityHelper')}
                onChange={this.storeOfferId}
              />
            </Collapse>
            <Collapse in={SELECTOR_PAYMENT_PACK === expandedSelector}>
              <Grid
                container
                direction="column"
                spacing={16}
                alignItems="flex-start"
              >
                <Grid item>
                  <PaymentPackInput
                    value={paymentPackId}
                    paymentPacks={paymentPacks}
                    onChange={this.storePaymentPackId}
                    helperText={t('form.invoice.paymentPackHelper')}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    disabled={!(selectedPaymentPack || {}).duration_days}
                    value={this.state.date_bought}
                    onChange={(date_bought) =>
                      this.setState({ date_bought: Moment(date_bought) })
                    }
                    format="DD-MM-YYYY"
                    label={t('form.invoice.dateStartPaymentPack')}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
          <Grid item className={classes.addButton}>
            {showCancel ? (
              <Button
                color="secondary"
                variant="outlined"
                onClick={onCancel}
                className={classes.cancelButton}
              >
                {t('form.invoice.backToInvoiceItemList')}
              </Button>
            ) : null}
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
  cancelButton: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(translate()(InvoiceItemSelector));
