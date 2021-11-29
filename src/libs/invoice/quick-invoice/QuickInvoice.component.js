// @flow
import React, { Component } from 'react';
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

import CreditMemberBadge from '../../member/components/CreditMemberBadge.component';

import InvoiceItem from '../components/InvoiceItem.component';
import InvoiceItemEditor from '../components/InvoiceItemEditor.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import type { Establishment } from '../../establishment/types';

type Props = {
  quickInvoiceTitle: string,
  t: TFunction,
  quickInvoice: { memberId: number, creditAccount: number, member: Member },
  editMode: ?boolean,
  onClose: ?() => void,
  classes: Object,
  createInvoice: (data: [*]) => void,
  updateInvoice: (data: [*]) => void,
  availableBuyableItems: {
    [buyable_item_identifier: number]: Array<BuyableItem>,
  },
  uneditableInvoiceItems: Array<InvoiceItem>,
  establishments: Array<Establishment>,
  establishmentLoading: boolean,
  memberDetails: { [id: number]: Member },
};

type State = {
  showInvoiceItemSelector: boolean,
  invoiceItemList: Array<InvoiceItem>,
  processing: boolean,
  billingEstablishmentId: number | null,
};

export class QuickInvoice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showInvoiceItemSelector: !props.editMode,
      invoiceItemList: [],
      processing: false,
      billingEstablishmentId: null,
    };
  }

  choseInvoiceItem = () => {
    this.setState({ showInvoiceItemSelector: true });
  };

  closeUnevenInvoiceDialog = () => {};

  onSubmit = () => {
    const { quickInvoice, createInvoice } = this.props;
    const invoiceData = {
      payment_methods: [],
      is_v2: true,
      buyable_items: this.state.invoiceItemList,
      member: quickInvoice.memberId,
      billing_establishment_id: this.state.billingEstablishmentId,
    };
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

  render() {
    const { classes, onClose, quickInvoiceTitle, quickInvoice } = this.props;
    if (!quickInvoice.member) {
      return <CircularProgress />;
    }
    return (
      <div className={classes.container}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Grid item>
            <CreditMemberBadge
              credit={quickInvoice.member.credit_account_balance}
            >
              <Typography variant="h6" inline>
                {quickInvoiceTitle}
              </Typography>
            </CreditMemberBadge>
          </Grid>
          {onClose ? (
            <Grid item>
              <IconButton onClick={onClose} color="secondary">
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
              onAddBuyableItem={this.addBuyableItem}
              member={this.getMemberDetail(quickInvoice)}
            />
          </div>
        ) : (
          <React.Fragment>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={9} className={classes.invoiceItemListContainer}>
                {[
                  ...(this.state.invoiceItemList || []),
                  ...(this.props.uneditableInvoiceItems || []).map((ii) => ({
                    ...ii,
                    editable: false,
                  })),
                ].map((ii) => (
                  <div>
                    <InvoiceItem
                      invoiceItem={ii}
                      key={`${ii.buyable_item_identifier}:${ii.id}:${ii.voucher}`}
                      onDelete={() => this.removeInvoiceItem(ii.id)}
                    />
                  </div>
                ))}
              </Grid>
              <Grid item xs={3}>
                <Grid container item justify="center" alignItems="center">
                  <Button
                    disabled={this.props.editMode}
                    onClick={this.choseInvoiceItem}
                    color="primary"
                    variant="contained"
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.establishmentSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                {this.props.t(
                  'invoice:section.invoiceItemList.billing_establishment',
                )}
              </Typography>
              <Divider className={classes.divider} />
              <EstablishmentSelector
                establishments={this.props.establishments}
                isClearable
                isLoading={this.props.establishmentLoading}
                isOptionDisabled
                selectOption={async (item: {
                  value: number,
                  label: string,
                }) => {
                  this.setState({
                    billingEstablishmentId: item ? item.value : null,
                  });
                }}
                selectedEstablishments={[this.state.billingEstablishmentId]}
                noMulti
                closeMenuOnSelect
              />
            </div>
            <div className={classes.actionRow}>
              {this.state.processing ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  onClick={this.onSubmit}
                  variant="outlined"
                >
                  {this.props.t('invoice.editor.save')}
                </Button>
              )}
              <Button
                onClick={this.props.onClose}
                disabled={this.state.processing}
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
