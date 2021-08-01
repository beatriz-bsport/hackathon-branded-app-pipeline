// @flow

import React from 'react';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { Theme } from '@material-ui/core';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  vaccinationStatus?: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const EmergencyContactItem = (props: Props) => {
  const { classes, t } = props;
  let vaccinationStatusLabel = t('vaccinationStatus.done');
  if (props.vaccinationStatus === false) {
    vaccinationStatusLabel = t('vaccinationStatus.notDone');
  }
  if (props.vaccinationStatus === null) {
    vaccinationStatusLabel = t('vaccinationStatus.unknown');
  }
  return (
    <ListItem>
      <LocalHospitalIcon
        color={props.vaccinationStatus ? 'primary' : 'error'}
      />
      <ListItemText
        primary={vaccinationStatusLabel}
        className={classes.listItemText}
      />
    </ListItem>
  );
};
const styles = (theme: Theme) => ({
  listItemText: {
    marginLeft: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['member']),
)(EmergencyContactItem);
