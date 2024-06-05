import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import CancelIcon from '@material-ui/icons/Cancel';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import {
  ReplacementRequestStatus,
  REPLACEMENT_REQUEST_STATUS_LABELS,
} from '#src/libs/replacement-request/constants';

type Props = {
  replacementRequestStatus: ReplacementRequestStatus;
  floatChip?: boolean;
  isMobile?: boolean;
};

export const ReplacementRequestStatusChip: React.FC<Props> = ({
  replacementRequestStatus,
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
          [classes.pendingChip]:
            replacementRequestStatus ===
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS,
          [classes.successChip]:
            replacementRequestStatus ===
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS,
          [classes.errorChip]:
            replacementRequestStatus ===
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_DISPLAYED_AS_CANCELLED_BECAUSE_OFFER_IS_CANCELLED,
        })}
      >
        {replacementRequestStatus ===
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS && (
          <HourglassEmpty
            className={classes.pending}
            fontSize={isMobile ? 'small' : 'medium'}
          />
        )}
        {replacementRequestStatus ===
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS && (
          <CheckCircle
            className={classes.success}
            fontSize={isMobile ? 'small' : 'medium'}
          />
        )}
        {replacementRequestStatus ===
          ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_DISPLAYED_AS_CANCELLED_BECAUSE_OFFER_IS_CANCELLED && (
          <CancelIcon
            className={classes.error}
            fontSize={isMobile ? 'small' : 'medium'}
          />
        )}

        <Typography className={classnames({ [classes.smallFont]: isMobile })}>
          {t(
            // @ts-expect-error
            `replacementStatus.${REPLACEMENT_REQUEST_STATUS_LABELS[replacementRequestStatus]}`,
          )}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(0.5),
  },
  error: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(0.5),
  },
  pending: {
    color: theme.palette.info.dark,
    marginRight: theme.spacing(0.5),
  },
  chipContainer: {
    display: 'table',
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
  pendingChip: {
    backgroundColor: blue[50],
    color: theme.palette.info.dark,
  },
  errorChip: {
    backgroundColor: red[50],
    color: theme.palette.error.main,
  },
  floatChip: {
    float: 'left',
    marginRight: theme.spacing(0.5),
  },
  smallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
}));

export default ReplacementRequestStatusChip;
