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
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { INVOICE_TYPE_MIGRATION } from '@bsport/common/lib/master-data/invoice-type';

import InvoiceItem from './InvoiceItem.component';
import PaymentItem from './PaymentItem.component';

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

  invoice: ?Invoice,
  invoiceItemLoading: boolean,
  invoiceItemList: Array<InvoiceItem>,
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
                {`${parseFloat(props.amountInvoiceitem).toFixed(2)} €`}
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
                  {`${props.amountPaymentItem || 0} €`}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </Paper>
      {props.invoice.invoice_type === INVOICE_TYPE_MIGRATION && (
        <div className={classes.explainMigration}>
          <InfoOutlinedIcon className={classes.iconLeft} />
          <Typography color="textSecondary">
            {t('actions.explainMigrationInvoice')}
          </Typography>
        </div>
      )}
      {!!props.finalizeInvoice && (
        <div className={classes.buttonRow}>
          <Button
            onClick={() => {
              if (props.invoice.stripe_invoice_pdf) {
                window.open(props.invoice.stripe_invoice_pdf);
              } else {
                props.finalizeInvoice();
              }
            }}
            color="primary"
            variant="contained"
          >
            <AttachFileIcon className={classes.iconLeft} />
            {t('actions.download')}
          </Button>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainer: { minHeight: '20vh', paddingBottom: theme.spacing(2) },
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
}));

export default InvoiceContent;
