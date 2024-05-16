import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { DateTime } from 'luxon';
import Tooltip from '#components/Tooltip.component';
import { formatISOStringAsTime } from '../../../utils/datetime';

export type Props = {
  nbRollCallsLeftToValidate: number;
  isSeveralRollCallsPage?: boolean;
  lastValidatedRollCallDate?: string;
};

export const ValidationRollCallText: React.FC<Props> = (props) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();
  if (props.nbRollCallsLeftToValidate !== 0) {
    if (!props.lastValidatedRollCallDate) {
      return (
        <Alert className={classes.alert} severity="warning">
          {props.isSeveralRollCallsPage && props.nbRollCallsLeftToValidate
            ? t('rollCall.warningText.rollCallsLeftToValidate', {
                number: props.nbRollCallsLeftToValidate,
                count: props.nbRollCallsLeftToValidate,
              })
            : t('rollCall.warningText.notValidatedRollCall')}
        </Alert>
      );
    }
    return (
      <Tooltip
        title={t('rollCall.warningText.lastValidatedRollCall', {
          date: DateTime.fromISO(
            props.lastValidatedRollCallDate,
          ).toLocaleString(DateTime.DATE_SHORT),
          time: formatISOStringAsTime(props.lastValidatedRollCallDate),
        })}
      >
        <Alert className={classes.alert} severity="warning">
          {t('rollCall.warningText.modifiedRollCall')}
        </Alert>
      </Tooltip>
    );
  }
  if (props.isSeveralRollCallsPage) {
    return (
      <Typography className={classes.validatedText}>
        {t('rollCall.warningText.noRollCallLeft')}
      </Typography>
    );
  }
  return (
    <Typography className={classes.validatedText}>
      {props.lastValidatedRollCallDate &&
        t('rollCall.warningText.validatedDate', {
          date: DateTime.fromISO(
            props.lastValidatedRollCallDate,
          ).toLocaleString(DateTime.DATE_SHORT),
          time: formatISOStringAsTime(props.lastValidatedRollCallDate),
        })}
    </Typography>
  );
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
