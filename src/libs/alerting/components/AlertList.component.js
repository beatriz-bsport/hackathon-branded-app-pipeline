// @flow

import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import type { Alerting } from '../types';
import AlertListItem from './AlertListItem.component';

type Props = {
  alertings: Array<Alerting>,
  pushRouter: (path: string) => void,
  onClose?: () => void,
  t: TFunction,
  classes: Object,
};

export function AlertList(props: Props) {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader disableGutters component="h2" style={{ margin: 0 }}>
          <div className={props.classes.title}>
            <span>{props.t('list.title')}</span>
            <span>
              {props.onClose ? (
                <IconButton onClick={props.onClose} color="secondary">
                  <CloseIcon />
                </IconButton>
              ) : null}
            </span>
          </div>
          <Divider />
        </ListSubheader>
      }
    >
      {props.alertings.length === 0 ? (
        <div className={props.classes.emptyText}>
          <Typography color="textSecondary">
            {props.t('list.emptyAlerting')}
          </Typography>
        </div>
      ) : (
        props.alertings.map((al) => (
          <AlertListItem
            alerting={al}
            key={al.id}
            pushRouter={props.pushRouter}
          />
        ))
      )}
    </List>
  );
}

const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    backgroundColor: 'white',
    margin: 0,
  },
  emptyText: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['alerting']),
  withStyles(styles),
)(AlertList);
