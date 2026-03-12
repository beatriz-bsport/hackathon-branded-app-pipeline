import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import WarningIcon from '@material-ui/icons/Warning';
import chroma from 'chroma-js';
import {
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} from '@bsport/common/lib/master-data/payout-status.js';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import {
  formatAsDatetimeAdapted,
  formatAsDate,
} from '../../../../utils/datetime';
import type { BalanceTransaction, Payout } from '../../types';
import BalanceTransactionRow from './BalanceTransactionRow.component';
import PayoutSummary from './PayoutSummary.component';
import TapTooltip from './TapTooltip.component';

// The table in PayoutList has 5 columns — the detail row spans all of them.
const COLUMN_COUNT = 6;

type Props = {
  isMobile: boolean;
  isOpen: boolean;
  payout: Payout;
  timezoneName?: string;
  tooglePayoutOpen: (id: number) => void;
  balanceTransactions: BalanceTransaction[];
  balanceTransactionLoading: boolean;
  balanceTransactionLoadingMore: boolean;
  balanceTransactionNextPage: number | null;
  balanceTransactionError: string | null;
  fetchPayoutBalanceTransactions: (params: {
    payoutId: number;
    page: number;
    append?: boolean;
  }) => void;
};

const PayoutListItem: React.FC<Props> = ({
  payout,
  isMobile,
  isOpen,
  timezoneName,
  tooglePayoutOpen,
  balanceTransactions,
  balanceTransactionLoading,
  balanceTransactionLoadingMore,
  balanceTransactionNextPage,
  balanceTransactionError,
  fetchPayoutBalanceTransactions: fetchPayoutBalanceTransactionsAction,
}) => {
  const { t } = useTranslation('payment');
  const classes = useStyles({ payout });
  React.useEffect(() => {
    if (
      isOpen &&
      balanceTransactions.length === 0 &&
      !balanceTransactionLoading
    ) {
      fetchPayoutBalanceTransactionsAction({
        payoutId: payout.id,
        page: 1,
        append: false,
      });
    }
  }, [
    isOpen,
    payout.id,
    balanceTransactions.length,
    balanceTransactionLoading,
    fetchPayoutBalanceTransactionsAction,
  ]);

  const handleLoadMore = React.useCallback(() => {
    if (balanceTransactionNextPage != null && !balanceTransactionLoadingMore) {
      fetchPayoutBalanceTransactionsAction({
        payoutId: payout.id,
        page: balanceTransactionNextPage,
        append: true,
      });
    }
  }, [
    balanceTransactionNextPage,
    balanceTransactionLoadingMore,
    payout.id,
    fetchPayoutBalanceTransactionsAction,
  ]);

  const handleToggle = React.useCallback(
    () => tooglePayoutOpen(payout.id),
    [payout.id, tooglePayoutOpen],
  );

  const dateFormatted = formatAsDate(
    payout.payment_provider_date_created,
    timezoneName,
  );
  const amountDisplay = getCurrencyDisplayWithPrice(
    (payout.amount_cts / 100).toFixed(2),
  );
  const amountFromIncluded =
    payout.amount_cts_from_previous_included_payouts > 0
      ? getCurrencyDisplayWithPrice(
          (payout.amount_cts_from_previous_included_payouts / 100).toFixed(2),
        )
      : null;

  const reconciliationStatus = payout.reconciliation_status ?? 'completed';
  const showReconciliationIndicator = reconciliationStatus !== 'completed';
  const reconciliationHelper = t(
    `payout.reconciliationStatusPayout.${reconciliationStatus}`,
    { defaultValue: reconciliationStatus },
  );

  const expandedSection = (
    <div className={classes.expandedContent}>
      <PayoutSummary payout={payout} />
      <Divider />
      {balanceTransactionLoading && (
        <div className={classes.loadingRow}>
          <CircularProgress size={20} />
        </div>
      )}
      {balanceTransactionError && (
        <Alert severity="error">{balanceTransactionError}</Alert>
      )}
      {!balanceTransactionLoading && balanceTransactions.length > 0 && (
        <>
          {isMobile ? (
            <div className={classes.mobileTransactionList}>
              {balanceTransactions.map((balanceTransaction) => (
                <BalanceTransactionRow
                  key={balanceTransaction.id}
                  isMobile
                  balanceTransaction={balanceTransaction}
                />
              ))}
            </div>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {t('payout.balanceTransactionTable.type')}
                  </TableCell>
                  <TableCell>
                    {t('payout.balanceTransactionTable.paymentMethod')}
                  </TableCell>
                  <TableCell>
                    {t('payout.balanceTransactionTable.status')}
                  </TableCell>
                  <TableCell>
                    {t('payout.balanceTransactionTable.amount')}
                  </TableCell>
                  <TableCell>
                    {t('payout.balanceTransactionTable.invoices')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceTransactions.map((balanceTransaction) => (
                  <BalanceTransactionRow
                    key={balanceTransaction.id}
                    balanceTransaction={balanceTransaction}
                    isMobile={false}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
      {!balanceTransactionLoading && balanceTransactionNextPage != null && (
        <div className={classes.loadingRow}>
          {balanceTransactionLoadingMore ? (
            <CircularProgress size={20} />
          ) : (
            <Button
              color="primary"
              onClick={handleLoadMore}
              size="small"
              variant="outlined"
            >
              {t('payout.loadMore')}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Paper className={classes.mobileCard} variant="outlined">
        {/* ── Card header: date + status badge + expand toggle ── */}
        <div className={classes.mobileCardHeader}>
          <div className={classes.mobileCardHeaderLeft}>
            <Typography variant="body2">{dateFormatted}</Typography>
            {showReconciliationIndicator && (
              <TapTooltip isMobile placement="top" title={reconciliationHelper}>
                <span className={classes.reconciliationIndicatorWrapper}>
                  <WarningIcon
                    className={classes.reconciliationIndicator}
                    fontSize="small"
                  />
                </span>
              </TapTooltip>
            )}
          </div>
          <div className={classes.mobileCardHeaderRight}>
            <Typography className={classes.status} variant="caption">
              {t(`payout.status.${payout.status}`)}
            </Typography>
            <IconButton onClick={handleToggle} size="small">
              {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>

        {/* ── Amount row ── */}
        <div className={classes.amountCell}>
          <Typography variant="body1">
            <strong>{amountDisplay}</strong>
          </Typography>
          {amountFromIncluded && (
            <TapTooltip
              isMobile
              placement="top"
              title={
                t('payout.amountCarryOverFromPreviousPayouts', {
                  amount: amountFromIncluded,
                }) ?? ''
              }
            >
              <InfoOutlinedIcon
                className={classes.includedIcon}
                fontSize="small"
              />
            </TapTooltip>
          )}
          {!!payout.is_included_in_payout && (
            <TapTooltip
              isMobile
              placement="top"
              title={
                t('payout.payoutIsIncludedInOther', {
                  date: formatAsDatetimeAdapted(
                    payout.is_included_in_payout.payment_provider_date_created,
                    'DDD',
                    timezoneName,
                  ),
                  readable_identifier:
                    payout.is_included_in_payout.readable_identifier,
                }) ?? ''
              }
            >
              <InfoOutlinedIcon
                className={classes.includedIcon}
                fontSize="small"
              />
            </TapTooltip>
          )}
        </div>

        {/* ── Footer: ID + transaction count ── */}
        <div className={classes.mobileCardFooter}>
          <Typography color="textSecondary" variant="caption">
            {payout.readable_identifier}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {payout.balance_transaction_count}{' '}
            {t('payout.table.transactions').toLowerCase()}
          </Typography>
        </div>

        {/* ── Expanded detail ── */}
        <Collapse unmountOnExit in={isOpen}>
          <Divider className={classes.mobileExpandDivider} />
          {expandedSection}
        </Collapse>
      </Paper>
    );
  }

  return (
    <>
      {/* ── Data row ── */}
      <TableRow hover className={classes.dataRow}>
        {/* Date */}
        <TableCell>
          <div className={classes.dateCell}>
            <Typography variant="body2">{dateFormatted}</Typography>
            {showReconciliationIndicator && (
              <TapTooltip
                isMobile={false}
                placement="top"
                title={reconciliationHelper}
              >
                <span className={classes.reconciliationIndicatorWrapper}>
                  <WarningIcon
                    className={classes.reconciliationIndicator}
                    fontSize="small"
                  />
                </span>
              </TapTooltip>
            )}
          </div>
        </TableCell>

        {/* Amount */}
        <TableCell>
          <div className={classes.amountCell}>
            <Typography variant="body2">{amountDisplay}</Typography>
            {amountFromIncluded && (
              <TapTooltip
                isMobile={false}
                placement="top"
                title={
                  t('payout.amountCarryOverFromPreviousPayouts', {
                    amount: amountFromIncluded,
                  }) ?? ''
                }
              >
                <InfoOutlinedIcon
                  className={classes.includedIcon}
                  fontSize="small"
                />
              </TapTooltip>
            )}
            {!!payout.is_included_in_payout && (
              <TapTooltip
                isMobile={false}
                placement="top"
                title={
                  t('payout.payoutIsIncludedInOther', {
                    date: formatAsDatetimeAdapted(
                      payout.is_included_in_payout
                        .payment_provider_date_created,
                      'DDD',
                      timezoneName,
                    ),
                    readable_identifier:
                      payout.is_included_in_payout.readable_identifier,
                  }) ?? ''
                }
              >
                <InfoOutlinedIcon
                  className={classes.includedIcon}
                  fontSize="small"
                />
              </TapTooltip>
            )}
          </div>
        </TableCell>

        {/* Transaction count */}
        <TableCell>
          <Typography variant="body2">
            {payout.balance_transaction_count}
          </Typography>
        </TableCell>

        {/* Readable ID */}
        <TableCell>
          <Typography color="textSecondary" variant="body2">
            {payout.readable_identifier}
          </Typography>
        </TableCell>

        {/* Status */}
        <TableCell>
          <Typography className={classes.status} variant="caption">
            {t(`payout.status.${payout.status}`)}
          </Typography>
        </TableCell>

        {/* Expand */}
        <TableCell align="right" padding="checkbox">
          <IconButton onClick={handleToggle} size="small">
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
      </TableRow>

      {/* ── Detail row ── */}
      <TableRow>
        <TableCell
          className={classes.detailCell}
          colSpan={COLUMN_COUNT}
          padding="none"
        >
          <Collapse unmountOnExit in={isOpen}>
            {expandedSection}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  dataRow: {
    '& > *': { borderBottom: 'unset' },
  },
  detailCell: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  amountCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  includedIcon: {
    color: chroma(theme.palette.info.dark).darken(1.5).hex(),
    cursor: 'default',
    flexShrink: 0,
  },
  expandedContent: {
    background: '#F8F8F8',
  },
  loadingRow: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  mobileCard: {
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
  },
  mobileCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileCardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  mobileCardHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  reconciliationIndicatorWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'default',
  },
  reconciliationIndicator: {
    color: theme.palette.warning?.main ?? 'orange',
    flexShrink: 0,
  },
  mobileCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileExpandDivider: {
    marginTop: theme.spacing(0.75),
  },
  mobileTransactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
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
      borderRadius: 4,
      color,
      padding: '2px 6px',
    };
  },
}));

export default React.memo(PayoutListItem);
