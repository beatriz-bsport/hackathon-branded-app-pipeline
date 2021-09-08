// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { INVOICE_TYPE_MIGRATION } from '@bsport/common/lib/master-data/invoice-type';
import DeleteIcon from '@material-ui/icons/Delete';
import { ListItem } from '@material-ui/core';
import Tooltip from '../../../components/Tooltip.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import InvoiceItem from './InvoiceItem.component';
import PaymentItem from './PaymentItem.component';
import CouponCodeForm from '../../coupon/components/CouponCodeForm.component';

type Props = {
  paymentItemList: Array<PaymentItem>,
  invoiceItemList: Array<InvoiceItem>,
  removeInvoiceItem: (id: number) => void,
  removePaymentItem: (id: number) => void,
  amountInvoiceitem: number,
  amountPaymentItem: number,
  returnPayment: (uuid: string) => void,
  finalizeInvoice: () => void,
  updatePaymentMethod: (uuid: string, paymentMethodId: number) => void,
  isReturningPayment: boolean,
  goToSubscription: (id: number) => void,

  invoice: ?Invoice,
  invoiceItemLoading: boolean,
  invoiceItemList: Array<InvoiceItem>,
  editCustomFooter: (options: OptionCallback) => void,
  couponList?: Array<{
    coupon_code: string,
    coupon_voucher: number,
    compatible_items: Array<number>,
  }>,
  deleteCoupon?: (couponIndex: number) => void,
  applyCoupon?: (couponCode: String, options: OptionCallback) => void,
  disableCoupon: boolean,
  couponLoading: boolean,
};
export const InvoiceContent = (props: Props) => {
  const classes = useStyles(props);
  const {
    removeInvoiceItem,
    removePaymentItem,
    invoiceItemList,
    paymentItemList,
  } = props;
  const { t } = useTranslation(['invoice']);
  const [editFooterOpen, setEditFooterOpen] = React.useState(false);
  const [customFooterValue, setCustomFooterValue] = React.useState([
    props.invoice ? props.invoice.custom_footer : '',
  ]);

  const is_reverse = props.invoice && props.invoice.source_invoice;

  return (
    <div className={classes.container}>
      <Paper className={classes.paperContainer}>
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            {t(
              is_reverse
                ? 'section.invoiceItemList.titleReverse'
                : 'section.invoiceItemList.title',
            )}
          </Typography>
          {props.invoiceItemLoading ? (
            <LinearProgress className={classes.divider} />
          ) : (
            <Divider className={classes.divider} />
          )}
          {invoiceItemList.map((ii) => (
            <div>
              <InvoiceItem
                invoiceItem={ii}
                key={`${ii.buyable_item_identifier}:${ii.id}:${ii.voucher}`}
                onDelete={() => removeInvoiceItem(ii.id)}
              />
            </div>
          ))}
          {!props.invoiceItemLoading && !invoiceItemList.length && (
            <div className={classes.isEmptyContainer}>
              <Typography variant="caption">
                {t('section.invoiceItemList.isEmpty')}
              </Typography>
            </div>
          )}
          <div className={classes.sumUp}>
            <div className={classes.sumUpInnerPayment}>
              <Typography variant="h6" component="p">
                {t('section.invoiceItemList.total')}
              </Typography>
              <Typography variant="h5">
                {getCurrencyDisplayWithPrice(
                  parseFloat(props.amountInvoiceitem).toFixed(2),
                )}
              </Typography>
            </div>
          </div>
        </div>
        {!!props.invoice && !props.invoice.is_v2 && (
          <div className={classes.section}>
            <div className={classes.sectionTitle}>
              <Typography variant="h6">
                {t('section.paymentList.title')}
              </Typography>
            </div>
            <Divider className={classes.divider} />
            {!!paymentItemList &&
              paymentItemList.map((p) => (
                <PaymentItem
                  paymentItem={p}
                  returnPayment={props.returnPayment}
                  isReturningPayment={props.isReturningPayment}
                  handleChangeMethod={props.updatePaymentMethod}
                  onDelete={() => removePaymentItem(p.id)}
                  key={p.uuid}
                />
              ))}
            {!paymentItemList ||
              (!paymentItemList.length && (
                <div className={classes.isEmptyContainer}>
                  <Typography variant="caption">
                    {t('section.paymentList.isEmpty')}
                  </Typography>
                </div>
              ))}
            <div className={classes.sumUp}>
              <div className={classes.sumUpInnerInvoiceItem}>
                <Typography variant="h6" component="p">
                  {t('section.paymentList.total')}
                </Typography>
                <Typography
                  color={
                    props.amountPaymentItem < props.amountInvoiceitem
                      ? 'error'
                      : ''
                  }
                  variant="h5"
                >
                  {getCurrencyDisplayWithPrice(props.amountPaymentItem || 0)}
                </Typography>
              </div>
            </div>
          </div>
        )}
        {!!props.invoice && props.invoice.is_v2 && !editFooterOpen ? (
          <div className={classes.footerSectionColumn}>
            {!!props.invoice.custom_footer && (
              <Typography
                className={classes.customFooterContainer}
                variant="caption"
                color="textSecondary"
              >
                {props.invoice.custom_footer}
              </Typography>
            )}
            <div>
              <Button onClick={() => setEditFooterOpen(true)}>
                {t('actions.addFooter')}
              </Button>
            </div>
          </div>
        ) : (
          <div />
        )}
        {editFooterOpen && (
          <div className={classes.footerSectionRow}>
            <TextField
              value={customFooterValue}
              onChange={(ev) => setCustomFooterValue(ev.target.value)}
              fullWidth
              variant="outlined"
            />
            <IconButton onClick={() => setEditFooterOpen(false)}>
              <CancelIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                props.editCustomFooter(customFooterValue, {
                  onSuccess: () => setEditFooterOpen(false),
                })
              }
            >
              <SaveIcon />
            </IconButton>
          </div>
        )}
        <div>
          {props.couponList && (
            <div className={classes.couponButton}>
              <CouponCodeForm
                onSubmit={props.applyCoupon}
                disabled={props.disableCoupon || props.couponLoading}
              />
            </div>
          )}
          {props.couponLoading && (
            <LinearProgress className={classes.divider} />
          )}
          <List>
            {!!props.couponList &&
              props.couponList.length !== 0 &&
              props.couponList.map((coupon, index) => (
                <>
                  <ListItem>
                    <ListItemText
                      primary={`${
                        coupon.coupon_code
                      } - ${getCurrencyDisplayWithPrice(
                        coupon.coupon_voucher || 0,
                      )}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="delete"
                        onClick={() => props.deleteCoupon(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </>
              ))}
          </List>
        </div>
      </Paper>
      {!!props.finalizeInvoice &&
        !!props.invoice &&
        props.invoice.invoice_type !== INVOICE_TYPE_MIGRATION && (
          <div className={classes.buttonRow}>
            <Tooltip
              title={
                props.invoice.is_draft
                  ? `${t('actions.explainPdfDraft')}`
                  : undefined
              }
              aria-label="pdf-not-available"
            >
              <Button
                onClick={() => {
                  if (!props.invoice.is_draft) {
                    if (props.invoice.stripe_invoice_pdf) {
                      window.open(props.invoice.stripe_invoice_pdf);
                    } else {
                      props.finalizeInvoice();
                    }
                  }
                }}
                color={props.invoice.is_draft ? undefined : 'primary'}
                variant="contained"
              >
                <AttachFileIcon className={classes.iconLeft} />
                {t('actions.download')}
              </Button>
            </Tooltip>
            {!!props.invoice.plannedinvoice && (
              <Button
                onClick={() =>
                  props.goToSubscription(props.invoice.billing_plan)
                }
                color="primary"
                variant="outlined"
              >
                {t('actions.goToSubscription')}
                <ArrowForwardIcon className={classes.rightIcon} />
              </Button>
            )}
          </div>
        )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    minHeight: '20vh',
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  section: { marginBottom: theme.spacing(2) },
  divider: { marginBottom: theme.spacing(2) },
  sectionTitle: {
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  isEmptyContainer: { marginLeft: theme.spacing(3) },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  buttonRow: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  sumUp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  sumUpInnerPayment: {
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    borderRadius: theme.spacing(0.5),
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sumUpInnerInvoiceItem: {
    borderRight: (props) =>
      `2px solid ${
        props.amountPaymentItem !== props.amountInvoiceitem ? 'red' : 'black'
      }`,
    borderBottom: (props) =>
      `2px solid ${
        props.amountPaymentItem !== props.amountInvoiceitem ? 'red' : 'black'
      }`,
    borderRadius: theme.spacing(0.5),
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  explainMigration: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#DEDEDE',
    borderRadius: 8,
    border: '1px solid gray',
  },
  footerSectionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  customFooterContainer: {
    padding: theme.spacing(2),
    border: '1px solid #DEDEDE',
    borderRadius: 8,
  },
  footerSectionColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  couponButton: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default InvoiceContent;
