// @flow

import React from 'react';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormLabel from '@material-ui/core/FormLabel';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { Theme } from '@material-ui/core';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  emergency_contact?: string;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const EmergencyContactItem = (props: Props) => {
  const { emergency_contact, classes, t } = props;
  return (
    <div>
      <FormLabel className={classes.label} component="legend">
        {t('common.emergencyContact')}
      </FormLabel>
      <ListItem>
        <AssignmentIndIcon />
        <ListItemText
          primary={emergency_contact || ' - '}
          className={classes.listItemText}
        />
      </ListItem>
    </div>
  );
};
const styles = (theme: Theme) => ({
  listItemText: {
    marginLeft: theme.spacing(2),
  },
  label: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(EmergencyContactItem);
