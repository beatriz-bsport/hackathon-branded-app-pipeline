import React from 'react';

import { compose } from 'recompose';
import clsx from 'clsx';
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
  disableGutters?: boolean;
  denseListItem?: string;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const EmergencyContactItem = (props: Props) => {
  const { emergency_contact, disableGutters, classes, t, denseListItem } =
    props;
  return (
    <div>
      <FormLabel
        className={clsx(classes.label, {
          [classes.labelWithMarginLeft]: !disableGutters,
        })}
        component="legend"
      >
        {t('common.emergencyContact')}
      </FormLabel>
      <ListItem
        classes={{ root: denseListItem }}
        disableGutters={disableGutters}
      >
        <AssignmentIndIcon />
        <ListItemText
          className={classes.listItemText}
          primary={(emergency_contact !== 'null' && emergency_contact) || ' - '}
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  labelWithMarginLeft: {
    marginLeft: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(EmergencyContactItem);
