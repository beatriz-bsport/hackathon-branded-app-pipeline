import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import Skeleton from '@material-ui/lab/Skeleton';

import { AccessStatus } from '#libs/access-control/constants';

type Props = {
  accessStatus: AccessStatus;
  isLoading: boolean;
  onClose: () => void;
  onRefresh: () => void;
};

const MemberVisitHeadButtons: React.FC<Props> = ({
  accessStatus,
  isLoading,
  onClose,
  onRefresh,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  if (isLoading) {
    return (
      <div className={classes.root}>
        <Skeleton
          className={classes.skeleton}
          height={24}
          variant="rect"
          width={121}
        />
        <Skeleton
          className={classes.skeleton}
          height={24}
          variant="rect"
          width={121}
        />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Button
        onClick={onClose}
        size="small"
        startIcon={<CloseIcon />}
        variant="outlined"
      >
        {t('memberVisit.closeMemberVisit')}
      </Button>
      {accessStatus !== AccessStatus.GREEN && (
        <Button
          onClick={onRefresh}
          size="small"
          startIcon={<RefreshIcon />}
          variant="outlined"
        >
          {t('memberVisit.refreshMemberVisit')}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  skeleton: {
    borderRadius: theme.spacing(1),
  },
}));

export default React.memo(MemberVisitHeadButtons);
