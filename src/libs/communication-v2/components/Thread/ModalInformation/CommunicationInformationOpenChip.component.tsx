// @ts-nocheck
import React from 'react';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { red, green, orange } from '@material-ui/core/colors/';

const BACKGROUND_COLOR_VARIANT = 50;
const TEXT_COLOR_VARIANT = 900;
const FONT_WEIGHT = 500;

const CommunicationInformationOpenChip = (props: { openStatus: boolean }) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  if (props.openStatus)
    return (
      <Chip
        className={classes.successChip}
        label={t('dialogInformation.status.openYes')}
        size="small"
      />
    );
  return (
    <Chip
      className={classes.errorChip}
      label={t('dialogInformation.status.openNo')}
      size="small"
    />
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  successChip: {
    backgroundColor: green[BACKGROUND_COLOR_VARIANT],
    color: green[TEXT_COLOR_VARIANT],
    fontWeight: FONT_WEIGHT,
    borderRadius: theme.spacing(1),
  },
  errorChip: {
    backgroundColor: red[BACKGROUND_COLOR_VARIANT],
    color: red[TEXT_COLOR_VARIANT],
    fontWeight: FONT_WEIGHT,
    borderRadius: theme.spacing(1),
  },
  warningChip: {
    backgroundColor: orange[BACKGROUND_COLOR_VARIANT],
    color: orange[TEXT_COLOR_VARIANT],
    fontWeight: FONT_WEIGHT,
    borderRadius: theme.spacing(1),
  },
}));

export default pure(CommunicationInformationOpenChip);
