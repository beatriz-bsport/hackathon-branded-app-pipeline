// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import brown from '@material-ui/core/colors/brown';
import red from '@material-ui/core/colors/red';

import {
  ReplacementRequestCoachAnswerStatus,
  REPLACEMENT_REQUEST_COACH_ANSWER_STATUS_LABELS,
} from '#libs/replacement-request/constants';

type Props = {
  replacementRequestCoachAnswerStatus: ReplacementRequestCoachAnswerStatus;
  floatChip?: boolean;
};

export const ReplacementRequestStatusChip: React.FC<Props> = ({
  replacementRequestCoachAnswerStatus,
  floatChip,
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
          [classes.errorChip]:
            replacementRequestCoachAnswerStatus ===
            ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_NO,
          [classes.warningChip]:
            replacementRequestCoachAnswerStatus ===
            ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_RATHER_NO,
          [classes.successChip]:
            replacementRequestCoachAnswerStatus ===
            ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_YES,
        })}
      >
        <Typography>
          {t(
            `coachAnswer.${REPLACEMENT_REQUEST_COACH_ANSWER_STATUS_LABELS[replacementRequestCoachAnswerStatus]}`,
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
  warning: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(0.5),
  },
  error: {
    color: theme.palette.error.main,
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
  warningChip: {
    backgroundColor: amber[50],
    color: brown[800],
  },
  errorChip: {
    backgroundColor: red[50],
    color: brown[800],
  },
  floatChip: {
    float: 'left',
    marginRight: theme.spacing(0.5),
  },
}));

export default ReplacementRequestStatusChip;
