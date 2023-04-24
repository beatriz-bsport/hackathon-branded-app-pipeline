// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { alpha } from '@material-ui/core';

import {
  ReplacementRequestCoachAnswerStatus,
  REPLACEMENT_REQUEST_COACH_ANSWER_STATUS_LABELS,
} from '#libs/replacement-request/constants';

type Props = {
  coachAnswer: ReplacementRequestCoachAnswerStatus | null;
  smallFont?: boolean;
  handleCoachAnswer: (
    answer: ReplacementRequestCoachAnswerStatus,
  ) => Promise<unknown>;
};

export const ReplacementRequestStatusChip: React.FC<Props> = ({
  coachAnswer,
  handleCoachAnswer,
  smallFont,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <div className={classes.buttonAlign}>
      <Button
        variant="outlined"
        classes={{
          root: classnames(classes.successButton, classes.coachAnswerButton, {
            [classes.smallFont]: smallFont,
          }),
          disabled: classes.successButtonDisabled,
        }}
        disableElevation
        onClick={() =>
          handleCoachAnswer(
            ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_YES,
          )
        }
        disabled={
          coachAnswer ===
          ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_YES
        }
      >
        {t(
          `coachAnswer.${
            REPLACEMENT_REQUEST_COACH_ANSWER_STATUS_LABELS[
              ReplacementRequestCoachAnswerStatus
                .REPLACEMENT_REQUEST_COACH_STATUS_YES
            ]
          }`,
        )}
      </Button>
      <Button
        variant="outlined"
        classes={{
          root: classnames(classes.warningButton, classes.coachAnswerButton, {
            [classes.smallFont]: smallFont,
          }),
          disabled: classes.warningButtonDisabled,
        }}
        disableElevation
        onClick={() =>
          handleCoachAnswer(
            ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_RATHER_NO,
          )
        }
        disabled={
          coachAnswer ===
          ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_RATHER_NO
        }
      >
        {t(
          `coachAnswer.${
            REPLACEMENT_REQUEST_COACH_ANSWER_STATUS_LABELS[
              ReplacementRequestCoachAnswerStatus
                .REPLACEMENT_REQUEST_COACH_STATUS_RATHER_NO
            ]
          }`,
        )}
      </Button>
      <Button
        variant="outlined"
        classes={{
          root: classnames(classes.errorButton, classes.coachAnswerButton, {
            [classes.smallFont]: smallFont,
          }),
          disabled: classes.errorButtonDisabled,
        }}
        disableElevation
        onClick={() =>
          handleCoachAnswer(
            ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_NO,
          )
        }
        disabled={
          coachAnswer ===
          ReplacementRequestCoachAnswerStatus.REPLACEMENT_REQUEST_COACH_STATUS_NO
        }
      >
        {t(
          `coachAnswer.${
            REPLACEMENT_REQUEST_COACH_ANSWER_STATUS_LABELS[
              ReplacementRequestCoachAnswerStatus
                .REPLACEMENT_REQUEST_COACH_STATUS_NO
            ]
          }`,
        )}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  coachAnswerButton: {
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
    '&:last-child': {
      marginRight: 0,
    },
  },
  successButton: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.success.main, 0.1),
    },
  },
  warningButton: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
    },
  },
  errorButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
  },
  successButtonDisabled: {
    backgroundColor: theme.palette.success.main,
    '&:disabled': {
      color: 'white',
    },
  },
  warningButtonDisabled: {
    backgroundColor: theme.palette.warning.main,
    '&:disabled': {
      color: 'white',
    },
  },
  errorButtonDisabled: {
    backgroundColor: theme.palette.error.main,
    '&:disabled': {
      color: 'white',
    },
  },
  buttonAlign: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  smallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
}));

export default ReplacementRequestStatusChip;
