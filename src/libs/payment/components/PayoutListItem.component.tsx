import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import moment from 'moment-timezone';
import {
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} from '@bsport/common/lib/master-data/payout-status';
import PaymentListItemV2 from '../../invoice/components/PaymentListItemV2.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Payout } from '../types';

type Props = {
  payout: Payout;
  isOpen: boolean;
  tooglePayoutOpen: (id: number) => void;
  openInvoice: (uuid: string) => void;
};

const PayoutListItem = (props: Props) => {
  const { payout } = props;
  const { t } = useTranslation(['payment']);
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.leftPart}>
          <Typography>
            {`${moment(payout.date_created).format(
              'LL',
            )} - ${getCurrencyDisplayWithPrice(
              (payout.amount_cts / 100).toFixed(2),
            )}`}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('payout.paymentNb', {
              nb: (payout.payments || []).length,
            })}
          </Typography>
          <Typography variant="body2">{payout.readable_identifier}</Typography>
        </div>
        <div className={classes.rightPart}>
          <Typography className={classes.status}>
            {t(`payout.status.${payout.status}`)}
          </Typography>
          <IconButton onClick={() => props.tooglePayoutOpen(payout.id)}>
            {props.isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </div>
      <Collapse in={props.isOpen}>
        <div className={classes.paymentContainer}>
          {(payout.payments || []).map((p) => (
            <div className={classes.paymentRow}>
              <div style={{ width: '100%' }}>
                <PaymentListItemV2 paymentItem={p} />
              </div>
              <Button onClick={() => props.openInvoice(p.invoice)}>
                {t('payout.invoice', { uuid: p.invoice.slice(0, 8) })}
                <ArrowForwardIcon className={classes.iconRight} />
              </Button>
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  innerContainer: {
    paddding: theme.spacing(1),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  container: {
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
  },
  leftPart: {
    flexDirection: 'column',
    display: 'flex',
  },
  rightPart: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  paymentContainer: {
    background: '#F8F8F8',
    padding: theme.spacing(1),
  },
  paymentRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconRight: {
    marginLeft: theme.spacing(1),
  },
  status: ({ payout }: { payout: Payout }) => {
    let color = 'black';
    switch (payout.status) {
      case PAYOUT_STATUS_TRANSIT:
        color = 'blue';
        break;
      case PAYOUT_STATUS_PENDING:
        color = 'orange';
        break;
      case PAYOUT_STATUS_FAILED:
        color = 'red';
        break;
      case PAYOUT_STATUS_SUCCESS:
        color = 'green';
        break;
      case PAYOUT_STATUS_CANCELED:
      default:
        color = 'black';
    }
    return {
      border: `1px solid ${color}`,
      color,
      borderRadius: 4,
      padding: theme.spacing(1),
    };
  },
}));

export default PayoutListItem;
