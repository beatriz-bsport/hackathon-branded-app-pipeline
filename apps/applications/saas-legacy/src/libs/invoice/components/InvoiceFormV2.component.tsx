import React from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import {
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_CREDIT,
  BUYABLE_ITEM_GIFTCARD,
} from '@bsport/common/lib/master-data/buyable-items.js';
import Modal from '@material-ui/core/Modal';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { appliesToInvoice } from '#src/libs/coupon/api';
import { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import { ConsumerGiftcardFormWithPreview } from '#src/libs/giftcard/components/ConsumerGiftcardFormWithPreview';
import { GiftcardBackgroundImage } from '#src/libs/giftcard/types';
import { Member } from '#src/libs/member/types';
import { isErrorWithCustomCode } from '#src/libs/utils';
import InvoiceContent from './InvoiceContent.component';
// @ts-expect-error
import InvoiceEditorV2 from './InvoiceEditorV2.component';
import FinalizeInvoiceDialog from '../dialog/FinalizeInvoiceDialog.component';
import type {
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
} from '../../../state/types';
import type { InvoiceItem } from '../invoice-item/types';

type OwnProps = {
  invoiceItemList: InvoiceItem[];

  member: Member;
  finalizeInvoice: (uuid: string) => void;
  onSubmit: (
    data: {
      // Poor naming ...
      buyable_items: InvoiceItem[];
      coupon_codes: string[];
      establishment_billing_group?: number;
      giftcard_config_list: any[];
    },
    options?: OptionCallback,
  ) => void;
  availableBuyableItems: { [identifier: number]: Array<any> };
  finalizeInvoiceAlertOpen: boolean;
  closeFinalizeInvoiceDialog: () => void;
  initialItems?: { withPrivatePass?: string; withCredit?: string };
  t: TFunction;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  establishmentLoading: boolean;
  enableMultiLocalization: boolean;
  defaultEstablishmentBillingGroup?: EstablishmentBillingGroup | null;
  imageCarouselChangeable: boolean;
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>;
  displayNewWebshop: boolean;
  isCustomDiscountReasonRequired: boolean;
};

type Props = OwnProps & WithStyles & WithTranslation;

type State = {
  invoiceItemList: Array<InvoiceItem>;
  appliedCoupons: Array<{
    voucher: number;
    coupon_partially_applied: boolean;
    id: number;
    code: string;
  }>;
  couponLoading: boolean;
  selectedEstablishmentBillingGroup?: EstablishmentBillingGroup | null;
  giftcardToConfigureList: Array<number>;
  giftcardConfigList: Array<any>;
  requiredEstablishmentIsMissing: boolean;
};

const asEditable = (editable: boolean, items: Array<any>) => {
  if (items) {
    return items.map((i: any) => ({ ...i, editable }));
  }
  return [];
};

export class InvoiceForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invoiceItemList: [],
      appliedCoupons: [],
      couponLoading: false,
      selectedEstablishmentBillingGroup:
        props.defaultEstablishmentBillingGroup || null,
      giftcardToConfigureList: [],
      giftcardConfigList: [],
      requiredEstablishmentIsMissing: false,
    };
  }

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
      this.refreshCouponsCompatibilityAndVoucher();
    }

    // @debt(3, 2, 2): In the revamp, the whole page should be loading while this data fetches.
    if (
      this.props.enableMultiLocalization &&
      !this.state.selectedEstablishmentBillingGroup &&
      this.props.defaultEstablishmentBillingGroup &&
      this.props.defaultEstablishmentBillingGroup !==
        prevProps.defaultEstablishmentBillingGroup &&
      this.props.defaultEstablishmentBillingGroup?.disabled === false
    ) {
      this.setState({
        selectedEstablishmentBillingGroup:
          this.props.defaultEstablishmentBillingGroup,
      });
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
          voucher_reason: item.voucher_reason || '',
          buyable_item_identifier,
        },
      ],
    }));
  };

  getInvoiceItemAmount = () => {
    const amount = [
      ...(this.props.invoiceItemList ?? []),
      ...this.state.invoiceItemList,
    ]
      .filter((ii) => !!ii && !ii.reverted)
      .reduce(
        (acc, invoiceItem) =>
          acc +
          parseFloat(invoiceItem.price) -
          parseFloat(invoiceItem.voucher || '0'),
        -this.state.appliedCoupons.reduce(
          (acc, appliedCoupon) => acc + appliedCoupon.voucher,
          0,
        ),
      );
    return amount < 0 ? 0 : amount;
  };

  invoiceItemIsEmpty = () => {
    return (
      this.state.invoiceItemList.length === 0 &&
      (this.props.invoiceItemList ?? []).length === 0
    );
  };

  applyCoupon = async (
    couponCode: string,
    options?: OptionCallBackWithKeyedCallbacks & { onNotFound: () => void },
  ) => {
    try {
      const { data } = await appliesToInvoice({
        codes: [couponCode],
        member: this.props.member.id,
        invoice: {
          invoice_items: this.state.invoiceItemList,
        },
        already_applied_coupons: this.state.appliedCoupons.map(
          (appliedCoupon) => ({
            coupon_id: appliedCoupon.id,
            code: appliedCoupon.code,
          }),
        ),
      });

      if (data.can_be_applied) {
        this.setState({
          appliedCoupons: data.applied_coupons,
        });
        if (options && options.onSuccess) options.onSuccess();
      } else if (options && options.onNotFound) {
        options.onNotFound();
      }
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response?.data?.error_code) {
        if (options && options[error.response?.data?.error_code]) {
          options[error.response.data.error_code]();
        }
      } else if (options && options.onError) {
        options.onError(error);
      } else if (options && options.onNotFound) {
        options.onNotFound();
      }
    }
  };

  deleteCoupon = (index: number) => {
    this.setState((prevState) => {
      const appliedCoupons = [
        ...prevState.appliedCoupons.slice(0, index),
        ...prevState.appliedCoupons.slice(index + 1),
      ];
      return {
        ...prevState,
        appliedCoupons,
      };
    }, this.refreshCouponsCompatibilityAndVoucher);
  };

  refreshCouponsCompatibilityAndVoucher = async () => {
    if (this.state.appliedCoupons.length === 0) return;
    this.setState({ appliedCoupons: [], couponLoading: true });

    try {
      const { data } = await appliesToInvoice({
        codes: this.state.appliedCoupons.map(
          (appliedCoupon) => appliedCoupon.code,
        ),
        member: this.props.member.id,
        invoice: {
          invoice_items: this.state.invoiceItemList,
        },
        already_applied_coupons: [],
      });

      this.setState({
        appliedCoupons: data.applied_coupons,
      });
    } finally {
      this.setState({ couponLoading: false });
    }
  };

  finalizeInvoiceItems = () => {
    this.setState((prevState: State) => {
      const giftcardToConfigureList = prevState.invoiceItemList
        // @ts-expect-error
        .filter((ii) => ii.buyable_item_identifier === BUYABLE_ITEM_GIFTCARD)
        // @ts-expect-error
        .map((b) => b.buyable_item_id);
      if (!giftcardToConfigureList.length) this.onSubmit([]);
      return {
        giftcardToConfigureList,
      };
    });
  };

  onSubmit = (giftcard_config_list: Array<any>) => {
    if (
      this.props.enableMultiLocalization &&
      !this.state.selectedEstablishmentBillingGroup &&
      this.props.establishmentBillingGroups?.length
    ) {
      this.setState({ requiredEstablishmentIsMissing: true });
    } else {
      this.props.onSubmit({
        buyable_items: this.state.invoiceItemList,
        coupon_codes: this.state.appliedCoupons.map(
          (appliedCoupon) => appliedCoupon.code,
        ),
        establishment_billing_group:
          this.state.selectedEstablishmentBillingGroup?.id,
        giftcard_config_list,
      });
    }
  };

  // @ts-expect-error
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

    const displayCouponNotFullyAppliedWarning = this.state.appliedCoupons.some(
      (appliedCoupon) => appliedCoupon.coupon_partially_applied,
    );

    return (
      <Grid container className={classes.container} spacing={1}>
        <Grid item md={6} xs={12}>
          <InvoiceEditorV2
            isEquilibrated
            amountInvoiceItem={invoiceItemAmount}
            availableBuyableItems={this.props.availableBuyableItems}
            displayNewWebshop={this.props.displayNewWebshop}
            invoiceHasChanged={this.state.invoiceItemList.length}
            invoiceItemIsEmpty={this.invoiceItemIsEmpty()}
            isCustomDiscountReasonRequired={
              this.props.isCustomDiscountReasonRequired
            }
            member={this.props.member}
            onAddBuyableItem={this.addBuyableItem}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography className={classes.title} variant="h4">
            {this.props.t('invoice.editor.sumup')}
          </Typography>
          {/* @ts-expect-error */}
          <InvoiceContent
            withEstablishment
            amountInvoiceItem={invoiceItemAmount}
            applyCoupon={this.applyCoupon}
            couponList={this.state.appliedCoupons.map((appliedCoupon) => ({
              coupon_code: appliedCoupon.code,
              coupon_voucher: appliedCoupon.voucher,
            }))}
            couponLoading={this.state.couponLoading}
            deleteCoupon={this.deleteCoupon}
            disableCoupon={this.invoiceItemIsEmpty()}
            displayCouponNotFullyAppliedWarning={
              displayCouponNotFullyAppliedWarning
            }
            enableMultiLocalization={this.props.enableMultiLocalization}
            establishmentBillingGroups={this.props.establishmentBillingGroups}
            establishmentLoading={this.props.establishmentLoading}
            invoiceItemList={[
              ...asEditable(false, this.props.invoiceItemList),
              ...asEditable(true, this.state.invoiceItemList),
            ]}
            removeInvoiceItem={this.removeInvoiceItem}
            requiredEstablishmentIsMissing={
              this.state.requiredEstablishmentIsMissing
            }
            selectedEstablishmentBillingGroup={
              this.state.selectedEstablishmentBillingGroup
            }
            setEstablishmentBillingGroup={(establishmentBillingGroup) =>
              this.setState({
                selectedEstablishmentBillingGroup: establishmentBillingGroup,
                requiredEstablishmentIsMissing: !establishmentBillingGroup,
              })
            }
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
          onClose={this.props.closeFinalizeInvoiceDialog}
          onSubmit={() => {
            // @ts-expect-error
            this.props.finalizeInvoice();
            this.props.closeFinalizeInvoiceDialog();
          }}
          open={this.props.finalizeInvoiceAlertOpen}
        />
        {!!this.state.giftcardToConfigureList?.length &&
          this.state.giftcardToConfigureList.map((giftcardId) => (
            <Modal
              key={giftcardId}
              classes={{ paper: classes.container }}
              open={giftcardId === this.state.giftcardToConfigureList[0]}
            >
              <>
                <div
                  className={classes.modal}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <ConsumerGiftcardFormWithPreview
                      forceVertical
                      giftcard={giftcardToConfigure}
                      giftcardBackgroundImageList={
                        this.props.giftcardBackgroundImageList
                      }
                      isManager={this.props.imageCarouselChangeable}
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

const styles = (theme: Theme) => ({
  container: {
    maxWidth: '100vw',
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
      margin: theme.spacing(2),
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
    maxWidth: '60%',
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 600,
    },
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
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['invoice']),
)(InvoiceForm);
