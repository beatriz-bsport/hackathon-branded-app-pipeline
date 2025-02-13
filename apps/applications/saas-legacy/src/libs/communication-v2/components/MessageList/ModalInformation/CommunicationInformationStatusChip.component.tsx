import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { CheckCircle, Cancel, WatchLater } from '@material-ui/icons';
import { red, green, orange } from '@material-ui/core/colors/';

import {
  EMAIL_RECIPIENT_DELIVERED,
  EMAIL_RECIPIENT_PROCESSED,
} from '@bsport/common/lib/master-data/recipient-status.js';

const BACKGROUND_COLOR_VARIANT = 50;
const ICON_COLOR_VARIANT = 500;
const TEXT_COLOR_VARIANT = 900;
const FONT_WEIGHT = 500;

const CommunicationInformationStatusChip = (props: {
  statusNumber: number;
}) => {
  const { t } = useTranslation(['communication']);
  const classes = useStyles();

  switch (props.statusNumber) {
    case EMAIL_RECIPIENT_DELIVERED:
      return (
        <Chip
          className={classes.successChip}
          icon={<CheckCircle className={classes.successChipIcon} />}
          label={t(`dialogInformation.status.${EMAIL_RECIPIENT_DELIVERED}`)}
          size="small"
        />
      );
    case EMAIL_RECIPIENT_PROCESSED:
      return (
        <Chip
          className={classes.warningChip}
          icon={<WatchLater className={classes.warningChipIcon} />}
          label={t(`dialogInformation.status.${EMAIL_RECIPIENT_PROCESSED}`)}
          size="small"
        />
      );
    default:
      return (
        <Chip
          className={classes.errorChip}
          icon={<Cancel className={classes.errorChipIcon} />}
          label={t(`dialogInformation.status.notReceived`)}
          size="small"
        />
      );
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  successChip: {
    backgroundColor: green[BACKGROUND_COLOR_VARIANT],
    color: green[TEXT_COLOR_VARIANT],
    fontWeight: FONT_WEIGHT,
    borderRadius: theme.spacing(1),
  },
  successChipIcon: {
    color: green[ICON_COLOR_VARIANT],
  },
  errorChip: {
    backgroundColor: red[BACKGROUND_COLOR_VARIANT],
    color: red[TEXT_COLOR_VARIANT],
    fontWeight: FONT_WEIGHT,
    borderRadius: theme.spacing(1),
  },
  errorChipIcon: {
    color: red[ICON_COLOR_VARIANT],
  },
  warningChip: {
    backgroundColor: orange[BACKGROUND_COLOR_VARIANT],
    color: orange[TEXT_COLOR_VARIANT],
    fontWeight: FONT_WEIGHT,
    borderRadius: theme.spacing(1),
  },
  warningChipIcon: {
    color: orange[ICON_COLOR_VARIANT],
  },
}));

export default React.memo(CommunicationInformationStatusChip);
