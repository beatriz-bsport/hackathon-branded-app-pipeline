import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Payout } from '../types';
import PayoutListItem from './PayoutListItem.component';

const useToogle = () => {
  const [openedPayoutId, setOpenedPayoutId] = React.useState(null);
  const tooglePayoutOpen = (id: number) => {
    if (id === openedPayoutId) {
      setOpenedPayoutId(null);
    } else {
      setOpenedPayoutId(id);
    }
  };
  return [openedPayoutId, tooglePayoutOpen];
};

interface Props {
  payoutList: Array<Payout>;
  hasMorePayout: boolean;
  fetchMorePayoutList: () => void;
  loading: boolean;
  openInvoice: (uuid: string) => void;
}

export const PayoutList = (props: Props) => {
  const [openedPayoutId, tooglePayoutOpen] = useToogle();
  const { t } = useTranslation(['payment']);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        {t('payout.title')}
      </Typography>
      {!props.loading && !props.payoutList.length && (
        <div>
          <Typography variant="body2" color="textSecondary">
            {t('payout.isEmpty')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('payout.isEmptyWarning')}
          </Typography>
        </div>
      )}
      <Paper>
        {props.payoutList.map((po) => (
          <PayoutListItem
            payout={po}
            isOpen={po.id === openedPayoutId}
            tooglePayoutOpen={tooglePayoutOpen}
            openInvoice={props.openInvoice}
            key={po.id}
          />
        ))}
      </Paper>
      {props.hasMorePayout && !props.loading && (
        <div className={classes.centeredButton}>
          <Button
            onClick={() => props.fetchMorePayoutList()}
            variant="outlined"
            color="primary"
          >
            {t('payout.seeMore')}
          </Button>
        </div>
      )}
      {props.loading && (
        <div className={classes.centeredButton}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  centeredButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(2),
  },
}));

export default PayoutList;
