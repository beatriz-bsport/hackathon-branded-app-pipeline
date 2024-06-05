import React from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Pagination from '@material-ui/lab/Pagination';

import { COMMUNICATION_SCHEDULED_LIST_PAGINATION } from '#src/libs/communication-v2/constants';

import type { CommunicationScheduled } from '#src/libs/communication-v2/types';
import CommunicationScheduledItem from './CommunicationScheduledItem.component';

type Props = {
  loading: boolean;
  communicationScheduledList: CommunicationScheduled[];
  total: number;
  currentPage: number;
  changePage: (page: number) => void;
  editCommunication: (communicationScheduled: CommunicationScheduled) => void;
  deleteCommunication: (communicationScheduled: CommunicationScheduled) => void;
};

export const CommunicationScheduledList: React.FC<Props> = ({
  loading,
  communicationScheduledList,
  total,
  currentPage = 1,
  changePage,
  editCommunication,
  deleteCommunication,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const totalPages = React.useMemo(
    () => Math.ceil(total / COMMUNICATION_SCHEDULED_LIST_PAGINATION) || 1,
    [total],
  );

  const handleEditCommunication = React.useCallback(
    (communicationScheduled: CommunicationScheduled) => () =>
      editCommunication(communicationScheduled),
    [editCommunication],
  );

  const handleDeleteCommunication = React.useCallback(
    (communicationScheduled: CommunicationScheduled) => () =>
      deleteCommunication(communicationScheduled),
    [deleteCommunication],
  );

  const handleChangePage = React.useCallback(
    (_: React.ChangeEvent<unknown> | null, newPage: number) =>
      currentPage !== newPage && changePage(newPage),
    [changePage, currentPage],
  );

  return (
    <div className={classes.container}>
      {communicationScheduledList?.map((communicationScheduled) => (
        <CommunicationScheduledItem
          key={communicationScheduled.id}
          communicationScheduled={communicationScheduled}
          deleteCommunication={handleDeleteCommunication(
            communicationScheduled,
          )}
          editCommunication={handleEditCommunication(communicationScheduled)}
        />
      ))}
      <div className={classes.buttonContainer}>
        {loading && <CircularProgress />}
        {!loading && communicationScheduledList?.length > 0 && (
          <div className={classes.footer}>
            <Pagination
              className={classes.pagination}
              count={totalPages}
              onChange={handleChangePage}
              page={currentPage}
              size="small"
            />
          </div>
        )}
        {!loading && !communicationScheduledList?.length && (
          <div className={classes.column}>
            {/* @ts-expect-error : grey color not assignable to type 'Color' */}
            <Alert className={classes.alertInfo} color="grey" severity="info">
              {t('scheduled.isEmpty')}
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  column: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    display: 'inline-flex',
    alignSelf: 'flex-end',
    width: '100%',
    justifyContent: 'end',
    gap: theme.spacing(1),
  },
  pagination: {
    '& li': { listStyleType: 'none' },
    '& ul': { justifyContent: 'flex-end' },
  },
}));

export default React.memo(CommunicationScheduledList);
