import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment-timezone';
import { ValidationRollCallState } from '../constants';
import Tooltip from '#components/Tooltip.component';

export type Props = {
  validationRollCallState: ValidationRollCallState;
  nbRemainingRollCall?: number;
  severalRollCall: boolean;
  lastValidatedRollCallDate?: string;
};

export const ValidationRollCallText = (props: Props) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();
  switch (props.validationRollCallState) {
    case ValidationRollCallState.NOT_VALIDATED:
      return (
        <Alert severity="warning" className={classes.alert}>
          {props.severalRollCall
            ? t('rollCall.remainingRollCall', {
                number: props.nbRemainingRollCall,
              })
            : t('rollCall.noValidationRollCall')}
        </Alert>
      );
    case ValidationRollCallState.MODIFIED:
      return (
        <Tooltip
          title={t('rollCall.lastValidatedRollCall', {
            date: moment(props.lastValidatedRollCallDate).format('L'),
            time: moment(props.lastValidatedRollCallDate).format('LT'),
          })}
        >
          <Alert severity="warning" className={classes.alert}>
            {t('rollCall.modifiedRollCall')}
          </Alert>
        </Tooltip>
      );
    case ValidationRollCallState.VALIDATED:
      return (
        <Typography>
          {props.severalRollCall
            ? t('rollCall.noRemainingRollCall')
            : t('rollCall.validatedRollCall', {
                date: moment(props.lastValidatedRollCallDate).format('L'),
                time: moment(props.lastValidatedRollCallDate).format('LT'),
              })}
        </Typography>
      );
    default:
      return null;
  }
};

const useStyles = makeStyles(() => ({
  alert: {
    alignItems: 'center',
  },
}));

ValidationRollCallText.defaultProps = {
  severalRollCall: false,
};

export default ValidationRollCallText;
