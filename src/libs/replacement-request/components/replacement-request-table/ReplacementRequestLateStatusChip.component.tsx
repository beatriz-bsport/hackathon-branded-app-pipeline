// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import AccessTime from '@material-ui/icons/AccessTime';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import brown from '@material-ui/core/colors/brown';

import { ReplacementRequestStatus } from '#libs/replacement-request/constants';

type Props = {
  isLate: boolean;
  floatChip?: boolean;
  isMobile?: boolean;
};

export const ReplacementRequestLateStatusChip: React.FC<Props> = ({
  isLate,
  floatChip,
  isMobile,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <div
      className={classnames({
        [classes.chipContainer]: !floatChip,
        [classes.floatChip]: floatChip,
      })}
    >
      <div
        className={classnames(classes.chipStatus, {
          [classes.warningChip]: isLate,
          [classes.successChip]: !isLate,
        })}
      >
        {isLate ? (
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS && (
            <>
              <AccessTime
                classes={{ root: classes.warning }}
                fontSize={isMobile ? 'small' : 'medium'}
              />
              <Typography
                className={classnames({ [classes.smallFont]: isMobile })}
              >
                {t(`lateStatus.isLate`)}
              </Typography>
            </>
          )
        ) : (
          <>
            <CheckCircle
              classes={{ root: classes.success }}
              fontSize={isMobile ? 'small' : 'medium'}
            />
            <Typography
              className={classnames({ [classes.smallFont]: isMobile })}
            >
              {t(`lateStatus.isNotLate`)}
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(0.5),
  },
  warning: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(0.5),
  },
  chipContainer: {
    display: 'table',
    [theme.breakpoints.down('sm')]: { margin: 0 },
  },
  chipStatus: {
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.light,
    padding: `${theme.spacing(0.25)}px ${theme.spacing(0.75)}px`,
    borderRadius: theme.spacing(0.5),
  },
  successChip: {
    backgroundColor: green[50],
    color: green[900],
  },
  warningChip: {
    backgroundColor: amber[50],
    color: brown[800],
  },
  floatChip: {
    float: 'left',
    marginRight: theme.spacing(0.5),
  },
  smallFont: {
    [theme.breakpoints.down('xs')]: { fontSize: '12px' },
  },
}));

export default ReplacementRequestLateStatusChip;
