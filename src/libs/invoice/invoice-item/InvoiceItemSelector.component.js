// @flow

import React, { Component } from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '../../private-service/components/PrivatePassSelector.component';
import ShopItemInput from '../../../components/input/ShopItemInput.component';
import PriceInput from '../../../components/input/PriceInput.component';

// eslint-disable-next-line
import type { PaymentPack } from '../../../libs/payment-packs/types';

type Props = {
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  showCancel: ?boolean,
  defaultTab: ?number,
  creditAccountBalance: number,

  onCancel: ?() => void,
  onTopUp: (number) => void,
  onAddPaymentPack: (paymentPackId: ?number) => void,
  onAddShopItem: (shopItemId: ?number) => void,

  t: TFunction,
  classes: Object,
};

type State = {
  expandedSelector: number,
  paymentPackId: ?number,
  privatePassId: ?number,
  shopItemId: ?number,
  creditTopUp: number,
};

export const SELECTOR_PAYMENT_PACK = 1;
export const SELECTOR_SHOP = 2;
export const SELECTOR_CREDIT_ACCOUNT = 3;
export const SELECTOR_PRIVATE_PASS = 4;

export class InvoiceItemSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expandedSelector: props.defaultTab || SELECTOR_PAYMENT_PACK,
      paymentPackId: null,
      privatePassId: null,
      shopItemId: null,
      creditTopUp: 0,
    };
  }

  onSelectorChange = (event: Object, value: number) => {
    this.setState({ expandedSelector: value });
  };

  storePaymentPackId = (event: Object) => {
    this.setState({ paymentPackId: event });
  };

  storePrivatePassId = (event: Object) => {
    this.setState({ privatePassId: event });
  };

  storeShopItemId = (shopItemId: number) => {
    this.setState({ shopItemId });
  };

  submitInvoiceItems = () => {
    switch (this.state.expandedSelector) {
      case SELECTOR_SHOP: {
        return this.props.onAddShopItem(this.state.shopItemId);
      }
      case SELECTOR_CREDIT_ACCOUNT: {
        return this.props.onTopUp(parseFloat(this.state.creditTopUp));
      }
      case SELECTOR_PRIVATE_PASS:
        return this.props.onAddPrivatePass(this.state.privatePassId);
      case SELECTOR_PAYMENT_PACK:
      default:
        return this.props.onAddPaymentPack(this.state.paymentPackId);
    }
  };

  renderPaymentPackSelector = () => {
    const { paymentPacks, t, classes } = this.props;
    const { paymentPackId } = this.state;
    return (
      <PaymentPackSelector
        value={paymentPackId}
        paymentPacks={paymentPacks}
        onChange={this.storePaymentPackId}
        helperText={t('form.invoice.paymentPackHelper')}
        selectorClass={classes.selector}
      />
    );
  };

  renderPrivatePassSelector = () => {
    const { privatePassList, classes } = this.props;
    const { privatePassId } = this.state;
    return (
      <PrivatePassSelector
        value={privatePassId}
        privatePassList={privatePassList}
        onChange={this.storePrivatePassId}
        selectorClass={classes.selector}
      />
    );
  };

  renderShopItemSelector = () => (
    <ShopItemInput
      value={this.state.shopItemId}
      onChange={this.storeShopItemId}
      selectorClass={this.props.classes.selector}
      shopItems={this.props.shopItems}
    />
  );

  renderCreditTopUpSelector = () => {
    const { classes, creditAccountBalance, t } = this.props;
    const { creditTopUp } = this.state;
    return (
      <div>
        <Grid
          container
          justify="space-between"
          className={classes.accountBalanceInfo}
        >
          <Grid item>
            <Typography variant="h6">
              {t('payment.creditAccountBalance')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              color={creditAccountBalance <= 0 ? 'error' : 'primary'}
            >
              {`${creditAccountBalance} €`}
            </Typography>
          </Grid>
        </Grid>
        <PriceInput
          variant="outlined"
          value={creditTopUp}
          onChange={(e) => this.setState({ creditTopUp: e.target.value })}
        />
      </div>
    );
  };

  render() {
    const { classes, t, onCancel, showCancel } = this.props;
    const {
      paymentPackId,
      privatePassId,
      shopItemId,
      creditTopUp,
    } = this.state;
    const { expandedSelector } = this.state;
    return (
      <div className={classes.container}>
        <Paper className={classes.tabs}>
          <Tabs
            value={expandedSelector}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.onSelectorChange}
            variant="scrollable"
            scrollButtons="off"
          >
            <Tab
              label={t('payment.addPaymentPack')}
              value={SELECTOR_PAYMENT_PACK}
            />
            <Tab label={t('shop.myShop')} value={SELECTOR_SHOP} />
            <Tab label={t('payment.credit')} value={SELECTOR_CREDIT_ACCOUNT} />
            <Tab
              label={t('payment.privatePass')}
              value={SELECTOR_PRIVATE_PASS}
            />
          </Tabs>
        </Paper>
        <div className={classes.innerList}>
          <Grid container direction="column" justify="space-between">
            <Grid item className={classes.input}>
              <Collapse in={SELECTOR_SHOP === expandedSelector}>
                {this.renderShopItemSelector()}
              </Collapse>
              <Collapse in={SELECTOR_PAYMENT_PACK === expandedSelector}>
                {this.renderPaymentPackSelector()}
              </Collapse>
              <Collapse in={SELECTOR_CREDIT_ACCOUNT === expandedSelector}>
                {this.renderCreditTopUpSelector()}
              </Collapse>
              <Collapse in={SELECTOR_PRIVATE_PASS === expandedSelector}>
                {this.renderPrivatePassSelector()}
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
                || (expandedSelector === SELECTOR_PRIVATE_PASS && !privatePassId)
                || (expandedSelector === SELECTOR_CREDIT_ACCOUNT && !creditTopUp)
                }
              >
                <AddIcon className={classes.leftIcon} />
                {t('payment.addInvoiceItem')}
              </Button>
            </Grid>
          </Grid>
        </div>
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
    paddingRight: 0, // theme.spacing.unit * 4,
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
  accountBalanceInfo: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    border: '1px solid #ced4da',
    backgroundColor: '#F8F8F8',
    borderRadius: `${theme.shape.borderRadius}px`,
  },
  tabs: {
    backgroundColor: '#F8F8F8',
    borderRadius: 0,
  },
  selector: {
    width: 340,
    marginTop: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(InvoiceItemSelector));
