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
import PaymentPackInput from '../input/PaymentPackInput.component';
import ShopItemInput from '../input/ShopItemInput.container';
import { Moment } from '../../i18n';

type Props = {
  t: (x: string) => string,
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  showCancel: ?boolean,
  defaultTab: ?number,
  onCancel: ?() => void,
  onAddPaymentPack: (paymentPackId: number) => void,
  onAddShopItem: (shopItemId: number) => void,
};

type State = {
  expandedSelector: number,
  paymentPackId: ?number,
  shopItemId: ?number,
  date_bought: Object,
};

export const SELECTOR_PAYMENT_PACK = 1;
export const SELECTOR_SHOP = 2;

export class InvoiceItemSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expandedSelector: props.defaultTab || SELECTOR_PAYMENT_PACK,
      paymentPackId: null,
      shopItemId: null,
      date_bought: Moment(),
    };
  }

  onSelectorChange = (event: Object, value: number) => {
    this.setState({ expandedSelector: value });
  };

  storePaymentPackId = (event: Object) => {
    this.setState({ paymentPackId: event });
  };

  storeShopItemId = (shopItemId: number) => {
    this.setState({ shopItemId });
  };

  submitInvoiceItems = () => {
    switch (this.state.expandedSelector) {
      case SELECTOR_SHOP: {
        return this.props.onAddShopItem(this.state.shopItemId);
      }
      case SELECTOR_PAYMENT_PACK:
      default:
        return this.props.onAddPaymentPack(
          this.state.paymentPackId,
          this.state.date_bought,
        );
    }
  };

  render() {
    const { paymentPacks, classes, t, onCancel, showCancel } = this.props;
    const { paymentPackId, shopItemId } = this.state;
    const selectedPaymentPack = paymentPacks.find(
      (pp) => pp.id === paymentPackId,
    );
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
            <Tab
              label={t('payment.addPaymentPack')}
              value={SELECTOR_PAYMENT_PACK}
            />
            <Tab label={t('shop.myShop')} value={SELECTOR_SHOP} />
          </Tabs>
        </Paper>
        <Grid
          container
          direction="column"
          className={classes.innerList}
          justify="space-between"
        >
          <Grid item className={classes.input}>
            <Collapse in={SELECTOR_SHOP === expandedSelector}>
              <ShopItemInput
                value={shopItemId}
                onChange={this.storeShopItemId}
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
                (expandedSelector === SELECTOR_PAYMENT_PACK && !paymentPackId)
                || (expandedSelector === SELECTOR_SHOP && !shopItemId)
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
