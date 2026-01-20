// @flow
import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import { BUYABLE_ITEM_GIFTCARD } from '@bsport/common/lib/master-data/buyable-items.js';

import EstablishmentBillingGroupSelector from '#src/libs/establishment/components/EstablishmentBillingGroupSelector';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { ConsumerGiftcardFormWithPreview } from '#src/libs/giftcard/components/ConsumerGiftcardFormWithPreview';
import CreditMemberBadge from '../../member/components/CreditMemberBadge.component';

import { InvoiceListItem } from '../components/InvoiceItem.component';
import InvoiceItemEditor from '../components/InvoiceItemEditor.component';
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '../../establishment/types';

type Props = {
  quickInvoiceTitle: string,
  t: TFunction,
  quickInvoice: { memberId: number, creditAccount: number, member: Member },
  isCustomDiscountReasonRequired: boolean,
  editMode?: boolean,
  onClose?: () => void,
  classes: Object,
  createInvoice: (data: any) => void,
  updateInvoice: (data: any) => void,
  availableBuyableItems: {
    [buyable_item_identifier: number]: Array<BuyableItem>,
  },
  uneditableInvoiceItems: Array<InvoiceItem>,
  establishmentBillingGroups: Array<Establishment>,
  establishmentLoading: boolean,
  enableMultiLocalization: boolean,
  memberDetails: { [id: number]: Member },
  displayNewWebshop: boolean,
  staffDefaultEstablishmentBillingGroup?: EstablishmentBillingGroup | null,
};

type State = {
  showInvoiceItemSelector: boolean,
  invoiceItemList: Array<InvoiceItem>,
  processing: boolean,
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup | null,
  requiredEstablishmentBillingGroupIsMissing: boolean,
  giftcardConfigList: Array<any>,
  giftcardToConfigureList: Array<number>,
};

export class QuickInvoice extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      giftcardConfigList: [],
      giftcardToConfigureList: [],
      showInvoiceItemSelector: !props.editMode,
      invoiceItemList: [],
      processing: false,
      selectedEstablishmentBillingGroup:
        props.staffDefaultEstablishmentBillingGroup || null,
      requiredEstablishmentBillingGroupIsMissing: false,
    };
  }

  componentDidMount() {
    if (
      !this.state.selectedEstablishmentBillingGroup &&
      this.props.staffDefaultEstablishmentBillingGroup
    ) {
      this.setState({
        selectedEstablishmentBillingGroup:
          this.props.staffDefaultEstablishmentBillingGroup,
      });
    }
  }

  choseInvoiceItem = () => {
    this.setState({ showInvoiceItemSelector: true });
  };

  closeUnevenInvoiceDialog = () => {};

  finalizeInvoiceItems = () => {
    this.setState((prevState: State) => {
      const giftcardToConfigureList = prevState.invoiceItemList
        .filter((ii) => ii.buyable_item_identifier === BUYABLE_ITEM_GIFTCARD)
        .map((b) => b.buyable_item_id);
      if (!giftcardToConfigureList.length) this.onSubmit();
      return {
        giftcardToConfigureList,
      };
    });
  };

  onSubmit = (giftcard_config_list?: Array<unknown>) => {
    const { quickInvoice, createInvoice } = this.props;
    const invoiceData = {
      payment_methods: [],
      is_v2: true,
      buyable_items: this.state.invoiceItemList,
      member: quickInvoice.memberId,
      establishment_billing_group:
        this.state.selectedEstablishmentBillingGroup?.id,
      giftcard_config_list,
    };
    if (
      this.props.enableMultiLocalization &&
      !this.state.selectedEstablishmentBillingGroup &&
      this.props.establishmentBillingGroups?.length
    ) {
      this.setState({ requiredEstablishmentBillingGroupIsMissing: true });
      return;
    }
    if (this.props.editMode) {
      this.props.updateInvoice(invoiceData);
    } else {
      this.setState({ processing: true });
      createInvoice(invoiceData, {
        onSuccess: () => this.setState({ processing: false }),
        onError: () => this.setState({ processing: false }),
      });
    }
  };

  addBuyableItem = (buyable_item_identifier, buyableItem) => {
    this.setState((prevState) => ({
      invoiceItemList: [
        {
          ...buyableItem,
          buyable_item_identifier,
          editable: true,
        },
        ...prevState.invoiceItemList,
      ],
      showInvoiceItemSelector: false,
    }));
  };

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

  getMemberDetail = (quickInv: QuickInvoice) => {
    return {
      ...quickInv.member,
      ...(this.props?.memberDetails[quickInv.member.id]?.tags
        ? {
            tags: this.props?.memberDetails[quickInv.member.id]?.tags,
          }
        : {}),
    };
  };

  getGiftcardToConfigure = () => {
    const giftcardToConfigure = this.state.giftcardToConfigureList.length
      ? this.props.availableBuyableItems[BUYABLE_ITEM_GIFTCARD].find(
          (buyableItem) =>
            buyableItem.id === this.state.giftcardToConfigureList[0],
        )
      : null;
    return giftcardToConfigure;
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

  handleStoreGiftcardConfig = (data) => {
    this.storeGiftcardConfig({
      ...data,
      giftcard: this.getGiftcardToConfigure()?.id,
    });
  };

  render() {
    const { classes, onClose, quickInvoiceTitle, quickInvoice } = this.props;
    if (!quickInvoice.member) {
      return <CircularProgress />;
    }
    const giftcardToConfigure = this.getGiftcardToConfigure();
    return (
      <div className={classes.container}>
        {!!this.state.giftcardToConfigureList?.length &&
          this.state.giftcardToConfigureList.map(
            (giftcardId) =>
              !!giftcardToConfigure && (
                <GenericResponsiveDialog
                  key={giftcardId}
                  classes={{ paper: classes.container }}
                  open={giftcardId === this.state.giftcardToConfigureList[0]}
                >
                  <ConsumerGiftcardFormWithPreview
                    forceVertical
                    isManager
                    giftcard={giftcardToConfigure}
                    giftcardBackgroundImageList={[]}
                    onSubmit={this.handleStoreGiftcardConfig}
                  />
                </GenericResponsiveDialog>
              ),
          )}

        <Grid
          container
          alignItems="center"
          className={classes.header}
          direction="row"
          justify="space-between"
        >
          <Grid item>
            <CreditMemberBadge
              credit={quickInvoice.member.credit_account_balance}
              unpaidAmount={quickInvoice.member.total_unpaid_amount}
            >
              <Typography inline variant="h6">
                {quickInvoiceTitle}
              </Typography>
            </CreditMemberBadge>
          </Grid>
          {onClose ? (
            <Grid item>
              <IconButton
                color="secondary"
                onClick={() => onClose(quickInvoice.memberId, quickInvoice)}
              >
                <CancelIcon />
              </IconButton>
            </Grid>
          ) : null}
        </Grid>
        <Divider />
        {this.state.showInvoiceItemSelector ? (
          <div>
            <InvoiceItemEditor
              availableBuyableItems={this.props.availableBuyableItems}
              displayNewWebshop={!!this.props?.displayNewWebshop}
              isCustomDiscountReasonRequired={
                this.props.isCustomDiscountReasonRequired
              }
              member={this.getMemberDetail(quickInvoice)}
              onAddBuyableItem={this.addBuyableItem}
            />
          </div>
        ) : (
          <React.Fragment>
            <Grid container alignItems="center" direction="row">
              <Grid item className={classes.invoiceItemListContainer} xs={9}>
                {[
                  ...(this.state.invoiceItemList ?? []),
                  ...(this.props.uneditableInvoiceItems ?? []).map((ii) => ({
                    ...ii,
                    editable: false,
                  })),
                ].map((ii) => (
                  <div
                    key={`${ii.buyable_item_identifier}:${ii.id}:${ii.voucher}`}
                  >
                    <InvoiceListItem
                      invoiceItem={ii}
                      onDelete={() => this.removeInvoiceItem(ii.id)}
                    />
                  </div>
                ))}
              </Grid>
              <Grid item xs={3}>
                <Grid container item alignItems="center" justify="center">
                  <Button
                    color="primary"
                    disabled={this.props.editMode}
                    onClick={this.choseInvoiceItem}
                    variant="contained"
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {this.props.enableMultiLocalization && (
              <div className={classes.establishmentSection}>
                <Typography className={classes.sectionTitle} variant="h6">
                  {this.props.t('invoice:section.invoiceItemList.billingGroup')}
                </Typography>
                <Divider className={classes.divider} />
                <EstablishmentBillingGroupSelector
                  closeMenuOnSelect
                  isOptionDisabled
                  isRequired
                  noMulti
                  establishmentBillingGroups={
                    this.props.establishmentBillingGroups
                  }
                  isLoading={this.props.establishmentLoading}
                  requiredValueIsMissing={
                    this.props.enableMultiLocalization &&
                    this.state.requiredEstablishmentBillingGroupIsMissing
                  }
                  selectedEstablishmentBillingGroup={
                    this.state.selectedEstablishmentBillingGroup
                  }
                  selectOption={(item: EstablishmentBillingGroup) => {
                    this.setState({
                      selectedEstablishmentBillingGroup: item || null,
                      requiredEstablishmentBillingGroupIsMissing: !item,
                    });
                  }}
                />
              </div>
            )}
            <div className={classes.actionRow}>
              {this.state.processing ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  onClick={this.finalizeInvoiceItems}
                  variant="outlined"
                >
                  {this.props.t('invoice.editor.save')}
                </Button>
              )}
              <Button
                disabled={this.state.processing}
                onClick={this.props.onClose}
              >
                {this.props.t('paymentPanel.actions.cancel')}
              </Button>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    border: 'solid 1px #E0E0E0',
    borderRadius: '4px',
  },
  header: {
    paddingLeft: theme.spacing(1),
  },
  invoiceItemListContainer: {
    backgroundColor: '#F8F8F8',
  },
  badge: {
    marginTop: (theme.spacing(1) * 1) / 4,
    padding: (theme.spacing(1) * 1) / 2,
  },
  actionRow: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    '&>*': {
      marginLeft: theme.spacing(1),
    },
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  establishmentSection: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['invoice']),
)(QuickInvoice);
