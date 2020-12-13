// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import DevicesIcon from '@material-ui/icons/Devices';
import PersonIcon from '@material-ui/icons/Person';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ButtonBase from '@material-ui/core/ButtonBase';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

type Props = {
  invoice: ?Invoice,
  onClickInvoice: (uuid: string) => void,
};

export const InvoiceHeader = (props: Props) => {
  const { invoice } = props;
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  if (!invoice) {
    return null;
  }
  return (
    <div className={classes.header}>
      <Typography variant="h4">
        {t(
          invoice.source_invoice ? 'invoice.titleRevert' : 'invoice.title',

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
}));

export default InvoiceHeader;
