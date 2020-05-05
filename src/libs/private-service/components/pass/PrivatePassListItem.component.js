// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { PrivatePass } from '../../types';
import { getValidityInfo } from '../../utils';

type Props = {
  pass: PrivatePass,
  t: TFunction,
  onClick: ?() => void,
  onDelete: ?() => void,
  divider?: boolean,
};

export const PrivatePassListItem = (props: Props) => {
  const dateInfo = getValidityInfo(props.pass, props.t);
  return (
    <ListItem
      divider={props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
    >
      <ListItemText
        primary={props.pass.name}
        secondary={`${props.t('privatePass.parameters.nbCredits', {
          credits: props.pass.credits,
        })} - ${dateInfo}`}
      />
      <ListItemSecondaryAction>
        {props.onClick ? (
          <IconButton
            color="primary"
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              props.onClick();
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        ) : null}
        {props.onDelete ? (
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const styles = () => ({
  container: {},
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivatePassListItem);
