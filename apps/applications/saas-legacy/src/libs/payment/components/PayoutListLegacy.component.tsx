/**
 * Legacy payout list (Stripe flow). Used when fs_new_payout_flow is off.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';
import type { StripePayout } from '../types';
import PayoutListItemLegacy from './PayoutListItemLegacy.component';

const useToggle = () => {
  const [openedPayoutId, setOpenedPayoutId] = React.useState<number | null>(
    null,
  );
  const togglePayoutOpen = (id: number) => {
    if (id === openedPayoutId) {
      setOpenedPayoutId(null);
    } else {
      setOpenedPayoutId(id);
    }
  };
  return [openedPayoutId, togglePayoutOpen] as const;
};

interface Props {
  stripePayoutList: Array<StripePayout>;
  hasMorePayout: boolean;
  fetchMorePayoutList: () => void;
  loading: boolean;
  openInvoice: (uuid: string) => void;
}

const PayoutListLegacy: React.FC<Props> = ({
  stripePayoutList,
  hasMorePayout,
  fetchMorePayoutList,
  loading,
  openInvoice,
}) => {
  const [openedPayoutId, togglePayoutOpen] = useToggle();
  const { t } = useTranslation(['payment']);
  const classes = useStyles();

  const handleFetchMorePayoutList = React.useCallback(
    () => fetchMorePayoutList(),
    [fetchMorePayoutList],
  );

  return (
    <>
      <Typography className={classes.title} variant="h5">
        {t('payout.title')}
      </Typography>
      <Divider className={classes.divider} />

      {!loading && !stripePayoutList.length && (
        <div>
          <Typography color="textSecondary" variant="body2">
            {t('payout.isEmpty')}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {t('payout.isEmptyWarning')}
          </Typography>
        </div>
      )}
      <Paper>
        {stripePayoutList?.map((po) => (
          <PayoutListItemLegacy
            key={po.stripe_id}
            isOpen={po.stripe_id === openedPayoutId}
            openInvoice={openInvoice}
            stripePayout={po}
            tooglePayoutOpen={togglePayoutOpen}
          />
        ))}
      </Paper>
      {hasMorePayout && !loading && (
        <div className={classes.centeredButton}>
          <Button
            color="primary"
            onClick={handleFetchMorePayoutList}
            variant="outlined"
          >
            {t('payout.seeMore')}
          </Button>
        </div>
      )}
      {loading && (
        <div className={classes.centeredButton}>
          <CircularProgress />
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
}));

export default React.memo(PayoutListLegacy);
