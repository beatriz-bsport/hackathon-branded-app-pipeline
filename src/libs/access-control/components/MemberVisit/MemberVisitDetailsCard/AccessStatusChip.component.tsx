import React from 'react';

import { useTranslation } from 'react-i18next';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import Chip from '@material-ui/core/Chip';
import { Theme, lighten, makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { AccessStatus } from '#libs/access-control/constants';

type Props = {
  accessStatus: AccessStatus;
  initialAccessStatus?: AccessStatus;
};

const AccessStatusChip: React.FC<Props> = ({
  accessStatus,
  initialAccessStatus,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles({ accessStatus });

  // Recursively render the chips if the access status has changed (max depth = 2)
  if (!!initialAccessStatus && initialAccessStatus !== accessStatus) {
    return (
      <div className={classes.chipsContainer}>
        <AccessStatusChip accessStatus={initialAccessStatus} />
        <ChevronRightIcon color="disabled" />
        <AccessStatusChip accessStatus={accessStatus} />
      </div>
    );
  }

  switch (accessStatus) {
    case AccessStatus.GREEN:
      return (
        <Chip
          className={classes.chip}
          icon={<CheckCircleIcon className={classes.icon} />}
          label={t('memberVisitDetails.accessStatus.green')}
          size="medium"
        />
      );
    case AccessStatus.RED:
      return (
        <Chip
          className={classes.chip}
          icon={<CancelIcon className={classes.icon} />}
          label={t('memberVisitDetails.accessStatus.red')}
          size="medium"
        />
      );
    case AccessStatus.ORANGE:
      return (
        <Chip
          className={classes.chip}
          icon={<WarningIcon className={classes.icon} />}
          label={t('memberVisitDetails.accessStatus.orange')}
          size="medium"
        />
      );
    default:
      return null;
  }
};

const useStyles = makeStyles<Theme, { accessStatus: AccessStatus }>(
  (theme) => ({
    chip: {
      borderRadius: theme.shape.borderRadius,
      color: ({ accessStatus }) => {
        switch (accessStatus) {
          case AccessStatus.GREEN:
            return theme.palette.success.dark;
          case AccessStatus.RED:
            return theme.palette.error.dark;
          case AccessStatus.ORANGE:
            return theme.palette.warning.dark;
          default:
            return theme.palette.success.dark;
        }
      },
      backgroundColor: ({ accessStatus }) => {
        switch (accessStatus) {
          case AccessStatus.GREEN:
            return lighten(theme.palette.success.light, 0.85);
          case AccessStatus.RED:
            return lighten(theme.palette.error.light, 0.85);
          case AccessStatus.ORANGE:
            return lighten(theme.palette.warning.light, 0.85);
          default:
            return lighten(theme.palette.success.light, 0.85);
        }
      },
    },
    icon: {
      color: ({ accessStatus }) => {
        switch (accessStatus) {
          case AccessStatus.GREEN:
            return theme.palette.success.dark;
          case AccessStatus.RED:
            return theme.palette.error.dark;
          case AccessStatus.ORANGE:
            return theme.palette.warning.dark;
          default:
            return theme.palette.success.dark;
        }
      },
    },
    chipsContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
);

export default React.memo(AccessStatusChip);
