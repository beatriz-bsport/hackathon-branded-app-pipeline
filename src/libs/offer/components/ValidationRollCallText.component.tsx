import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment-timezone';
import { RollCallState } from '../constants';
import Tooltip from '#components/Tooltip.component';

export type Props = {
  validationRollCallState: RollCallState;
  nbRollCallsLeftToValidate?: number;
  isSeveralRollCallsPage?: boolean;
  lastValidatedRollCallDate?: string;
};

export const ValidationRollCallText: React.FC<Props> = (props) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();
  switch (props.validationRollCallState) {
    case RollCallState.NOT_VALIDATED:
      return (
        <Alert severity="warning" className={classes.alert}>
          {props.isSeveralRollCallsPage && props.nbRollCallsLeftToValidate
            ? t('rollCall.warningText.rollCallsLeftToValidate', {
                number: props.nbRollCallsLeftToValidate,
                count: props.nbRollCallsLeftToValidate,
              })
            : t('rollCall.warningText.notValidatedRollCall')}
        </Alert>
      );
    case RollCallState.MODIFIED:
      return (
        <Tooltip
          title={t('rollCall.warningText.lastValidatedRollCall', {
            date: moment(props.lastValidatedRollCallDate).format('L'),
            time: moment(props.lastValidatedRollCallDate).format('LT'),
          })}
        >
          <Alert severity="warning" className={classes.alert}>
            {t('rollCall.warningText.modifiedRollCall')}
          </Alert>
        </Tooltip>
      );
    case RollCallState.VALIDATED:
      return (
        <Typography className={classes.validatedText}>
          {props.isSeveralRollCallsPage
            ? t('rollCall.warningText.noRollCallLeft')
            : t('rollCall.warningText.validatedDate', {
                date: moment(props.lastValidatedRollCallDate).format('L'),
                time: moment(props.lastValidatedRollCallDate).format('LT'),
              })}
        </Typography>
      );
    default:
      return null;
  }
};

const useStyles = makeStyles((theme) => ({
  alert: {
    alignItems: 'center',
  },
  validatedText: { color: theme.palette.text.secondary },
}));

ValidationRollCallText.defaultProps = {
  isSeveralRollCallsPage: false,
};

export default ValidationRollCallText;
