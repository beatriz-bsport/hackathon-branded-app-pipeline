/**
 * Legacy payout list item (Stripe flow). Used when fs_new_payout_flow is off.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

import chroma from 'chroma-js';

import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HelpIcon from '@material-ui/icons/Help';

import {
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} from '@bsport/common/lib/master-data/payout-status.js';

import { DateTime } from 'luxon';
import CustomMuiDialog from '#src/components/genericDialog/CustomMuiDialog.component';
// @ts-expect-error
import PaymentListItemV2 from '../../invoice/components/PaymentListItemV2.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { StripePayout } from '../types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type Props = {
  stripePayout: StripePayout;
  isOpen: boolean;
  tooglePayoutOpen: (id: number) => void;
  openInvoice?: (uuid: string) => void;
};

const PayoutListItemLegacy: React.FC<Props> = ({
  stripePayout,
  isOpen,
  tooglePayoutOpen,
  openInvoice,
}) => {
  const { t } = useTranslation('payment');
  const classes = useStyles({ stripePayout });
  const bsportPayout = stripePayout.bsport_payout_object;

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = React.useCallback(
    () => setOpenDialog(true),
    [setOpenDialog],
  );
  const handleCloseDialog = React.useCallback(
    () => setOpenDialog(false),
    [setOpenDialog],
  );

  const handleTooglePayoutOpen = React.useCallback(
    () => tooglePayoutOpen(stripePayout.stripe_id),
    [stripePayout.stripe_id, tooglePayoutOpen],
  );

  const handleOpenInvoice = React.useCallback(
    (invoiceId: string) => () => openInvoice?.(invoiceId),
    [openInvoice],
  );

  const dialogButtons = [
    {
      variant: 'text',
      onClick: handleCloseDialog,
      commonLabel: 'close',
    },
  ];

  if (bsportPayout && (bsportPayout?.payments?.length ?? 0) > 0) {
    return (
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.leftPart}>
            <Typography>
              {`${DateTime.fromSeconds(stripePayout.date_created).toFormat(
                'DD',
              )} - ${getCurrencyDisplayWithPrice(
                (stripePayout.amount_cts / 100).toFixed(2),
              )}${
                bsportPayout.amount_cts_from_previous_included_payouts > 0
                  ? ` (${t('payout.payoutAmountFromIncludedPayouts', {
                      price: getCurrencyDisplayWithPrice(
                        (
                          bsportPayout.amount_cts_from_previous_included_payouts /
                          100
                        ).toFixed(2),
                      ),
                    })})`
                  : ''
              }`}
            </Typography>
            {!!bsportPayout.is_included_in_payout && (
              <div className={classes.row}>
                <InfoOutlinedIcon
                  className={classes.iconLeft}
                  fontSize="small"
                />
                <Typography className={classes.info} variant="caption">
                  {t('payout.payoutIsIncludedInOther', {
                    date: formatAsDatetimeAdapted(
                      bsportPayout.is_included_in_payout.date_created,
                      'DDD',
                    ),
                    readable_identifier:
                      bsportPayout.is_included_in_payout.readable_identifier,
                  })}
                </Typography>
              </div>
            )}
            {bsportPayout.automatic === false && (
              <div className={classes.row}>
                <InfoOutlinedIcon
                  className={classes.iconLeft}
                  fontSize="small"
                />
                <Typography className={classes.info} variant="caption">
                  {t('payout.payoutIsManual')}
                </Typography>
              </div>
            )}
            {!bsportPayout.is_included_in_payout &&
              !(bsportPayout.automatic === false) && (
                <Typography color="textSecondary" variant="caption">
                  {t('payout.paymentNb', {
                    nb: (bsportPayout.payments ?? []).length,
                  })}
                </Typography>
              )}
            <Typography variant="body2">
              {bsportPayout.readable_identifier}
            </Typography>
          </div>
          <div className={classes.rightPart}>
            <Typography className={classes.status}>
              {t(`payout.status.${stripePayout.status}`)}
            </Typography>
            <IconButton
              disabled={!!bsportPayout.is_included_in_payout}
              onClick={handleTooglePayoutOpen}
            >
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>
        <Collapse in={isOpen}>
          <div className={classes.paymentContainer}>
            {(bsportPayout.payments ?? []).map((p: any) => (
              <div key={p.id} className={classes.paymentRow}>
                <div style={{ width: '100%' }}>
                  <PaymentListItemV2 paymentItem={p} />
                </div>
                <Button onClick={handleOpenInvoice(p.invoice)}>
                  {t('payout.invoice', {
                    uuid: p.invoice_public_identifier,
                  })}
                  <ArrowForwardIcon className={classes.iconRight} />
                </Button>
              </div>
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.leftPart}>
          <Typography>
            {`${DateTime.fromSeconds(stripePayout.date_created).toFormat(
              'DD',
            )} - ${getCurrencyDisplayWithPrice(
              (stripePayout.amount_cts / 100).toFixed(2),
            )}`}
          </Typography>
        </div>
        <div className={classes.rightPart}>
          <Typography className={classes.status}>
            {t(`payout.status.${stripePayout.status}`)}
          </Typography>
          <IconButton onClick={handleOpenDialog}>
            <HelpIcon />
          </IconButton>
        </div>
      </div>
      <CustomMuiDialog
        buttons={dialogButtons}
        content={t('payout.dialog.content')}
        contentColor="textSecondary"
        fullScreenBreakpoint="xs"
        open={openDialog}
        title={t('payout.dialog.title')}
      />
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
  info: { color: chroma(theme.palette.info.dark).darken(1.5).hex() },
  row: { display: 'flex', alignItems: 'center' },
  iconLeft: { marginRight: theme.spacing(0.5) },
  status: ({ stripePayout }: { stripePayout: StripePayout }) => {
    let color = 'black';
    switch (stripePayout.status) {
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

export default React.memo(PayoutListItemLegacy);
