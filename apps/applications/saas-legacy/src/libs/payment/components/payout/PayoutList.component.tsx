/**
 * Payout list for the new flow (fs_new_payout_flow).
 * Fetches from GET /api/v1/payout/reconciliation/.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import type { Theme } from '#src/libs/theme/types';
import type { Payout } from '../../types';
import PayoutListItemContainer from './PayoutListItemContainer.component';

const useToggle = (): [number | null, (id: number) => void] => {
  const [openedPayoutId, setOpenedPayoutId] = React.useState<number | null>(
    null,
  );
  const togglePayoutOpen = React.useCallback(
    (id: number) => {
      setOpenedPayoutId(id === openedPayoutId ? null : id);
    },
    [openedPayoutId],
  );
  return [openedPayoutId, togglePayoutOpen];
};

type Props = {
  theme: Theme;
  payouts: Payout[];
  loading: boolean;
  loadingMore: boolean;
  nextPage: number | null;
  error: string | null;
  fetchPayoutList: (params: { page: number; append?: boolean }) => void;
};

const PayoutList: React.FC<Props> = ({
  error,
  fetchPayoutList,
  loading,
  loadingMore,
  nextPage,
  payouts,
  theme,
}) => {
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('xs'));
  const [openedPayoutId, togglePayoutOpen] = useToggle();

  React.useEffect(() => {
    fetchPayoutList({ page: 1, append: false });
  }, [fetchPayoutList]);

  const handleFetchMore = React.useCallback(() => {
    if (nextPage != null && !loadingMore) {
      fetchPayoutList({ page: nextPage, append: true });
    }
  }, [nextPage, loadingMore, fetchPayoutList]);

  const hasMorePayout = nextPage != null;

  return (
    <>
      <Typography className={classes.title} variant="h5">
        {t('payout.title')}
      </Typography>
      <Divider className={classes.divider} />

      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !payouts.length && !error && (
        <div>
          <Typography color="textSecondary" variant="body2">
            {t('payout.isEmpty')}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {t('payout.isEmptyWarning')}
          </Typography>
        </div>
      )}

      {isMobile ? (
        <div className={classes.mobileList}>
          {payouts.map((payout) => (
            <PayoutListItemContainer
              key={payout.id}
              isMobile
              isOpen={payout.id === openedPayoutId}
              payout={payout}
              timezoneName={theme.timezone_name}
              tooglePayoutOpen={togglePayoutOpen}
            />
          ))}
        </div>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('payout.table.date')}</TableCell>
                <TableCell>{t('payout.table.amount')}</TableCell>
                <TableCell>{t('payout.table.transactions')}</TableCell>
                <TableCell>{t('payout.table.id')}</TableCell>
                <TableCell>{t('payout.table.status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.map((payout) => (
                <PayoutListItemContainer
                  key={payout.id}
                  isMobile={false}
                  isOpen={payout.id === openedPayoutId}
                  payout={payout}
                  timezoneName={theme.timezone_name}
                  tooglePayoutOpen={togglePayoutOpen}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {loading && (
        <div className={classes.centeredButton}>
          <CircularProgress />
        </div>
      )}
      {!loading && hasMorePayout && (
        <div className={classes.centeredButton}>
          {loadingMore ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              color="primary"
              onClick={handleFetchMore}
              variant="outlined"
            >
              {t('payout.seeMore')}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  centeredButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(2),
  },
  mobileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default React.memo(PayoutList);
