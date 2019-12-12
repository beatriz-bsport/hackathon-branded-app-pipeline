// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

type Props = {
  t: TFunction,
  smartlist: ?SmartList,
  classes: Object,
  onEdit: () => void,
  onConfigure: () => void,
};

export const SmartlistCard = (props: Props) => {
  if (!props.smartlist) {
    return null;
  }
  return (
    <div>
      <div className={props.classes.header}>
        <Typography variant="h5" component="h2">
          {props.t('smart_list.card.description')}
        </Typography>
        <IconButton color="primary" onClick={props.onEdit}>
          <EditIcon />
        </IconButton>
      </div>
      <Paper className={props.classes.paper}>
        <TypographyMultiline>{props.smartlist.description}</TypographyMultiline>
      </Paper>
      <div className={props.classes.configureButtonContainer}>
        <Button onClick={props.onConfigure} variant="outlined" color="primary">
          <SettingsIcon className={props.classes.leftIcon} />
          {props.t('smart_list.actions.configure')}
        </Button>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  configureButtonContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(SmartlistCard);
