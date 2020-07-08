// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

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
  updatePaymentMethod: (uuid: string, paymentMethodId: number) => void,
  isReturningPayment: boolean,
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

  return (
    <div className={classes.container}>
      <Paper className={classes.paperContainer}>
        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            {t('section.invoiceItemList.title')}
          </Typography>
          <Divider className={classes.divider} />
          {invoiceItemList.map((ii) => (
            <div>
              <InvoiceItem
                invoiceItem={ii}
                key={`${ii.buyable_item_identifier}:${ii.id}:${ii.voucher}`}
                onDelete={() => removeInvoiceItem(ii.id)}
              />
            </div>
          ))}
          {!invoiceItemList.length && (
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
              <Typography variant="h5">{`${props.amountInvoiceitem} €`}</Typography>
            </div>
          </div>
        </div>
        <div className={classes.section}>
          <div className={classes.sectionTitle}>
            <Typography variant="h6">
              {t('section.paymentList.title')}
            </Typography>
          </div>
          <Divider className={classes.divider} />
          {props.paymentItemList.map((p) => (
            <PaymentItem
              paymentItem={p}
              returnPayment={props.returnPayment}
              isReturningPayment={props.isReturningPayment}
              handleChangeMethod={props.updatePaymentMethod}
              onDelete={() => removePaymentItem(p.id)}
              key={p.uuid}
            />
          ))}
          {!paymentItemList.length && (
            <div className={classes.isEmptyContainer}>
              <Typography variant="caption">
                {t('section.paymentList.isEmpty')}
              </Typography>
            </div>
          )}
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
                {`${props.amountPaymentItem} €`}
              </Typography>
            </div>
          </div>
        </div>
      </Paper>
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
}));

export default InvoiceContent;
