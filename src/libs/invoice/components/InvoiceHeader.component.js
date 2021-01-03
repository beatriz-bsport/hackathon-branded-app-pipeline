// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import DevicesIcon from '@material-ui/icons/Devices';
import PersonIcon from '@material-ui/icons/Person';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ButtonBase from '@material-ui/core/ButtonBase';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import {
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
  INVOICE_TYPE_REVERSE,
  INVOICE_TYPE_MIGRATION,
} from '@bsport/common/lib/master-data/invoice-type';

type Props = {
  invoice: ?Invoice,
  onClickInvoice: (uuid: string) => void,
};

const InvoiceTypeInfo = ({
  invoice_type,
  classes,
  t,
}: {
  invoice_type: number,
  classes: any,
  t: TFunction,
}) => {
  if (
    ![INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER, INVOICE_TYPE_MIGRATION].includes(
      invoice_type,
    )
  ) {
    return null;
  }
  return (
    <div className={classes.infoContainer}>
      <InfoOutlinedIcon fontSize="large" className={classes.leftIcon} />
      <Typography color="textSecondary">
        {t(`invoiceInfo.${invoice_type}`)}
      </Typography>
    </div>
  );
};

export const InvoiceHeader = (props: Props) => {
  const { invoice } = props;
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  if (!invoice) {
    return null;
  }
  let invoiceHeaderType = 'title';
  if (invoice.invoice_type === INVOICE_TYPE_REVERSE) {
    invoiceHeaderType = 'titleRevert';
  } else if (invoice.invoice_type === INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER) {
    invoiceHeaderType = 'titleReceipt';
  } else if (invoice.reverse_invoices && !!invoice.reverse_invoices.length) {
    invoiceHeaderType = 'titleReverted';
  }
  return (
    <div className={classes.header}>
      <Typography variant="h4">
        {t(
          `invoice.${invoiceHeaderType}`,

          { uuid: invoice.uuid.slice(0, 8) },
        )}
      </Typography>
      <div className={classes.additionalInfo}>
        <div className={classes.row}>
          <TodayIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {moment(invoice.date).format('LLL')}
          </Typography>
        </div>
        <div className={classes.row}>
          <PersonIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {(invoice && invoice.member && invoice.member.name) || ''}
          </Typography>
        </div>
        <div className={classes.row}>
          <ReceiptIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {invoice.author
              ? invoice.author.email
              : t('invoice.header.clientAuthor')}
          </Typography>
        </div>
        <div className={classes.row}>
          <DevicesIcon fontSize="small" className={classes.leftIcon} />
          <Typography color="textSecondary">
            {t(`invoice.header.source.${invoice.source}`)}
          </Typography>
        </div>
        {!!invoice.source_invoice && (
          <ButtonBase
            onClick={() => props.onClickInvoice(invoice.source_invoice)}
            className={classes.row}
          >
            <DoubleArrowIcon fontSize="small" className={classes.leftIcon} />
            <Typography color="textSecondary">
              {`${t(
                'invoice.header.sourceInvoice',
              )} ${invoice.source_invoice.slice(0, 8)}`}
            </Typography>
          </ButtonBase>
        )}
        {!!invoice.reverse_invoices &&
          !!invoice.reverse_invoices.length &&
          invoice.reverse_invoices.map((inv) => (
            <ButtonBase
              onClick={() => props.onClickInvoice(inv)}
              className={classes.row}
            >
              <DoubleArrowIcon fontSize="small" className={classes.leftIcon} />
              <Typography color="error">
                {`${t('invoice.header.reverseInvoice')} ${inv.slice(0, 8)}`}
              </Typography>
            </ButtonBase>
          ))}
      </div>
      <InvoiceTypeInfo
        t={t}
        classes={classes}
        invoice_type={invoice.invoice_type}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(2),
  },
  additionalInfo: {
    borderLeft: '2px solid black',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '&>*': {
      marginBottom: theme.spacing(0.5),
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #dedede',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

export default InvoiceHeader;
