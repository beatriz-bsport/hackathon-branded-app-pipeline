// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';

import {
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_CREDIT,
  BUYABLE_ITEM_GIFTCARD,
} from '@bsport/common/lib/master-data/buyable-items';
import Modal from '@material-ui/core/Modal';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import type { TFunction } from 'react-i18next';
import InvoiceContent from './InvoiceContent.component';
import InvoiceEditorV2 from './InvoiceEditorV2.component';
import FinalizeInvoiceDialog from '../dialog/FinalizeInvoiceDialog.component';
import { OptionCallback } from '../../../state/types';
import { appliesToInvoice } from '../../coupon/api';
import type { Establishment } from '../../establishment/types';
import ConsumerGiftcardFormWithPreview from '../../giftcard/components/ConsumerGiftcardFormWithPreview.component';

type Props = {
  classes: Object,

  invoiceItemList: Array<InvoiceItem>,

  member: Member,
  finalizeInvoice: (uuid: string) => void,
  onSubmit: (
    {
      buyable_items: Array<BuyableItem>,
    },
    options: OptionCallback,
  ) => void,
  availableBuyableItems: { [identifier: number]: Array<any> },
  finalizeInvoiceAlertOpen: boolean,
  closeFinalizeInvoiceDialog: () => void,
  initialItems?: { withPrivatePass?: string, withCredit?: string },
  t: TFunction,
  establishments: Array<Establishment>,
  establishmentLoading: boolean,
  enableMultiLocalization: boolean,
};

type State = {
  invoiceItemList: Array<InvoiceItem>,
  coupon_list: Array<{
    coupon_code: string,
    coupon_voucher: number,
    compatible_items: Array<number>,
  }>,
  couponLoading: boolean,
  billing_establishment_id: number | null,
  giftcardToConfigureList: Array<number>,
  giftcardConfigList: Array<any>,
};

const asEditable = (editable, items) => {
  if (items) {
    return items.map((i) => ({ ...i, editable }));
  }
  return [];
};

export class InvoiceForm extends React.Component<Props, State> {
  state = {
    invoiceItemList: [],
    coupon_list: [],
    couponLoading: false,
    billing_establishment_id: null,
    giftcardToConfigureList: [],
    giftcardConfigList: [],
  };

  componentDidMount() {
    const { initialItems } = this.props;
    if (initialItems) {
      if (initialItems.withPrivatePass) {
        const privatePass = this.props.availableBuyableItems[
          BUYABLE_ITEM_PRIVATE_PASS
        ].find((bi) => bi.id === parseInt(initialItems.withPrivatePass, 10));
        this.addBuyableItem(BUYABLE_ITEM_PRIVATE_PASS, {
          ...privatePass,
          price: parseFloat(privatePass.price).toFixed(2),
          voucher: '0.00',
          buyable_item_id: privatePass.id,
        });
      }
      if (initialItems.withCredit) {
        this.addBuyableItem(BUYABLE_ITEM_CREDIT, {
          buyable_item_id: 0,
          price: parseFloat(initialItems.withCredit).toFixed(2),
          voucher: '0.00',
          name: this.props.t('invoiceItem.credit.label'),
        });
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.invoiceItemList &&
      this.state.invoiceItemList &&
      prevState.invoiceItemList !== this.state.invoiceItemList
    ) {
      this.checkCouponApplicability();
    }
  }

  removeInvoiceItem = (id: number) => {
    this.setState((prevState) => {
      const idx = prevState.invoiceItemList.findIndex((ii) => ii.id === id);
      return {
        invoiceItemList: prevState.invoiceItemList.filter((ii, idx_) => {
          return idx_ !== idx;
        }),
      };
    });
  };

  addBuyableItem = (buyable_item_identifier: number, item: any) => {
    this.setState((prevState) => ({
      invoiceItemList: [
        ...prevState.invoiceItemList,
        {
          ...item,
          voucher:
            (parseFloat(item.price) >= 0
              ? Math.min(parseFloat(item.price), item.voucher || 0)
              : 0) || 0,
          buyable_item_identifier,
        },
      ],
    }));
  };

  getInvoiceItemAmount = () => {
    return [
      ...(this.props.invoiceItemList || []),
      ...this.state.invoiceItemList,
    ]
      .filter((ii) => !!ii && !ii.reverted)
      .reduce(
        (acc, v) => acc + parseFloat(v.price) - parseFloat(v.voucher || 0),
        -this.state.coupon_list.reduce((acc, v) => acc + v.coupon_voucher, 0),
      );
  };

  invoiceItemIsEmpty = () => {
    return (
      this.state.invoiceItemList.length === 0 &&
      (this.props.invoiceItemList || []).length === 0
    );
  };

  applyCoupon = async (couponCode: string, options: any) => {
    const { data } = await appliesToInvoice(couponCode, this.props.member.id, {
      invoice_items: this.state.invoiceItemList.map((item) => item),
      invoice_amount: this.getInvoiceItemAmount(),
    });
    if (data.can_be_applied) {
      this.setState((prevState) => {
        return {
          ...prevState,
          coupon_list: [
            ...prevState.coupon_list,
            {
              coupon_code: couponCode,
              coupon_voucher: data.voucher,
              compatible_items: data.compatible_items,
            },
          ],
        };
      });
      if (options && options.onSuccess) options.onSuccess();
    } else if (options && options.onError) options.onError();
  };

  deleteCoupon = (index: number) => {
    this.setState((prevState) => {
      const coupon_list = [
        ...prevState.coupon_list.slice(0, index),
        ...prevState.coupon_list.slice(index + 1),
      ];
      return {
        ...prevState,
        coupon_list,
      };
    });
  };

  checkCouponApplicability = async () => {
    this.setState({ coupon_list: [], couponLoading: true });
    const promises = this.state.coupon_list.map((coupon) => {
      return this.applyCoupon(coupon.coupon_code);
    });
    await Promise.all(promises);
    this.setState({ couponLoading: false });
  };

  finalizeInvoiceItems = () => {
    this.setState((prevState) => {
      const giftcardToConfigureList = prevState.invoiceItemList
        .filter((ii) => ii.buyable_item_identifier === BUYABLE_ITEM_GIFTCARD)
        .map((b) => b.buyable_item_id);
      if (!giftcardToConfigureList.length) this.onSubmit([]);
      return {
        giftcardToConfigureList,
      };
    });
  };

  onSubmit = (giftcard_config_list) => {
    this.props.onSubmit({
      buyable_items: this.state.invoiceItemList,
      coupon_codes: this.state.coupon_list.map((coupon) => coupon.coupon_code),
      billing_establishment_id: this.state.billing_establishment_id,
      giftcard_config_list,
    });
  };

  storeGiftcardConfig = (giftcardConfig) => {
    this.setState((prevState) => {
      const newState = {
        giftcardConfigList: [...prevState.giftcardConfigList, giftcardConfig],
        giftcardToConfigureList: prevState.giftcardToConfigureList.slice(1),
      };
      if (!newState.giftcardToConfigureList.length) {
        this.onSubmit(newState.giftcardConfigList);
      }
      return newState;
    });
  };

  render() {
    const { classes, t } = this.props;
    const invoiceItemAmount = this.getInvoiceItemAmount();
    const giftcardToConfigure = this.state.giftcardToConfigureList.length
      ? this.props.availableBuyableItems[BUYABLE_ITEM_GIFTCARD].find(
          (bi) => bi.id === this.state.giftcardToConfigureList[0],
        )
      : null;

    return (
      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={12} md={6}>
          <InvoiceEditorV2
            availableBuyableItems={this.props.availableBuyableItems}
            onAddBuyableItem={this.addBuyableItem}
            invoiceItemIsEmpty={this.invoiceItemIsEmpty()}
            invoiceHasChanged={this.state.invoiceItemList.length}
            amountInvoiceitem={invoiceItemAmount}
            isEquilibrated
            member={this.props.member}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.title} variant="h4">
            {this.props.t('invoice.editor.sumup')}
          </Typography>
          <InvoiceContent
            removeInvoiceItem={this.removeInvoiceItem}
            invoiceItemList={[
              ...asEditable(false, this.props.invoiceItemList),
              ...asEditable(true, this.state.invoiceItemList),
            ]}
            amountInvoiceitem={invoiceItemAmount}
            applyCoupon={this.applyCoupon}
            couponList={this.state.coupon_list}
            deleteCoupon={this.deleteCoupon}
            disableCoupon={this.invoiceItemIsEmpty()}
            couponLoading={this.state.couponLoading}
            withEstablishment
            establishments={this.props.establishments}
            establishmentLoading={this.props.establishmentLoading}
            billing_establishment_id={this.state.billing_establishment_id}
            setBillingEstablishment={(billing_establishment_id) =>
              this.setState({ billing_establishment_id })
            }
            enableMultiLocalization={this.props.enableMultiLocalization}
          />
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              disabled={!this.state.invoiceItemList.length}
              onClick={this.finalizeInvoiceItems}
              variant="contained"
            >
              {t('invoice.editor.save')}
            </Button>
          </div>
        </Grid>
        <FinalizeInvoiceDialog
          open={this.props.finalizeInvoiceAlertOpen}
          onClose={this.props.closeFinalizeInvoiceDialog}
          onSubmit={() => {
            this.props.finalizeInvoice();
            this.props.closeFinalizeInvoiceDialog();
          }}
        />
        {!!this.state.giftcardToConfigureList?.length &&
          this.state.giftcardToConfigureList.map((gc) => (
            <Modal
              open={gc.id === this.state.giftcardToConfigureList[0].id}
              key={gc.id}
              classes={{ paper: classes.container }}
            >
              <>
                <div
                  style={{
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%',
                  }}
                  className={classes.modal}
                >
                  <div>
                    <ConsumerGiftcardFormWithPreview
                      forceVertical
                      giftcard={giftcardToConfigure}
                      onSubmit={(data) =>
                        this.storeGiftcardConfig({
                          ...data,
                          giftcard: giftcardToConfigure.id,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            </Modal>
          ))}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxWidth: '100vw',
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 600,
    },
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    overflow: 'auto',
    maxHeight: '100vh',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['invoice']),
)(InvoiceForm);
