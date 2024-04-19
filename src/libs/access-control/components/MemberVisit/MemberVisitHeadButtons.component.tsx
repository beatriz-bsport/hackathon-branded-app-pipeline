import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import { AccessStatus } from '#libs/access-control/constants';

type Props = {
  accessStatus: AccessStatus;
  isLoading: boolean;
  onClose?: () => void;
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
  const theme = useTheme();

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
      {!!onClose && (
        <Button
          onClick={onClose}
          size="small"
          startIcon={<CloseIcon htmlColor={theme.palette.text.secondary} />}
          variant="outlined"
        >
          <Typography className={classes.label} color="textSecondary">
            {t('memberVisit.closeMemberVisit')}
          </Typography>
        </Button>
      )}
      {accessStatus !== AccessStatus.GREEN && (
        <Button
          onClick={onRefresh}
          size="small"
          startIcon={<RefreshIcon htmlColor={theme.palette.text.secondary} />}
          variant="outlined"
        >
          <Typography className={classes.label} color="textSecondary">
            {t('memberVisit.refreshMemberVisit')}
          </Typography>
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  label: {
    fontWeight: 500,
  },
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
