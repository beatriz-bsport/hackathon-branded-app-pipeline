import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { AccessStatus, EntryStatus } from '#src/libs/access-control/constants';
import type { Props as MemberVisitDetailsCardProps } from './MemberVisitDetailsCard.component';

const MemberVisitDetailsCardManualEntrySection: React.FC<
  Pick<
    MemberVisitDetailsCardProps,
    'memberVisit' | 'onAllowManualEntry' | 'onRefuseManualEntry'
  >
> = ({ memberVisit, onAllowManualEntry, onRefuseManualEntry }) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const { access_status, entry_status, door_access } = memberVisit;

  if (!access_status || access_status !== AccessStatus.ORANGE || door_access) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className={classes.manualEntrySection}>
        <Typography variant="body1">
          {t('memberVisitDetails.manualEntry.description')}
        </Typography>
        <div className={classes.manualEntryButtonsContainer}>
          {/* Refuse button */}
          {entry_status === EntryStatus.NOT_ENTERED ? (
            <Button
              disabled
              className={clsx(classes.manualEntryButton, classes.refuseButton)}
              size="small"
              variant="contained"
            >
              {t('memberVisitDetails.manualEntry.button.entryRefused')}
            </Button>
          ) : (
            <Button
              className={clsx(classes.manualEntryButton, classes.refuseButton)}
              onClick={onRefuseManualEntry}
              size="small"
              variant="outlined"
            >
              {t('memberVisitDetails.manualEntry.button.refuse')}
            </Button>
          )}
          {/* Accept button */}
          {entry_status === EntryStatus.ENTERED ? (
            <Button
              disabled
              className={clsx(classes.manualEntryButton, classes.allowButton)}
              size="small"
              variant="contained"
            >
              {t('memberVisitDetails.manualEntry.button.entryAllowed')}
            </Button>
          ) : (
            <Button
              className={clsx(classes.manualEntryButton, classes.allowButton)}
              onClick={onAllowManualEntry}
              size="small"
              variant="outlined"
            >
              {t('memberVisitDetails.manualEntry.button.accept')}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  manualEntrySection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manualEntryButtonsContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  manualEntryButton: {
    width: 160,
  },
  refuseButton: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
    '&:disabled': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12)',
    },
  },
  allowButton: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    '&:disabled': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.common.white,
      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12)',
    },
  },
}));

export default React.memo(MemberVisitDetailsCardManualEntrySection);
