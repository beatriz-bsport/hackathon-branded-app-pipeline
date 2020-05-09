// @flow
import React from 'react';
import { compose } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import withConfirm from '../../../../hocs/with-confirm.hoc';

import type { PrivateService } from '../../types';

type Props = {
  privateService: PrivateService,
  onClick: () => void,
  onCancel: () => void,
  onEdit: () => void,
  dense?: boolean,
  selected: boolean,
  hideSecondary: boolean,
  onDelete: () => void,
};

const DeleteButton = withConfirm(
  (props: { onClick: () => void }) => (
    <IconButton onClick={props.onClick}>
      <DeleteIcon color="secondary" />
    </IconButton>
  ),
  'onClick',
  {
    title: 'privateService:service.form.delete.title',
    cancel: 'privateService:service.form.delete.cancel',
    confirm: 'privateService:service.form.delete.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('privateService:service.form.delete.content')}</p>
    ),
  },
);

export const PrivateServiceListItem = (props: Props) => {
  const { privateService, onClick } = props;
  return (
    <ListItem
      button={!!onClick}
      divider
      selected={props.selected}
      onClick={onClick ? () => onClick(privateService.id) : null}
      alignItems="center"
      dense={props.dense}
      style={{
        borderLeft: privateService.color !== '' ? '5px solid' : '0px',
        borderLeftColor: privateService.color,
      }}
    >
      <ListItemText
        primary={privateService.name}
        secondary={
          props.hideSecondary
            ? null
            : privateService.coaches
                .map((c) => (c && c.name) || '')
                .join(', ') || null
        }
      />
      <ListItemSecondaryAction>
        {props.onEdit ? (
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              props.onEdit();
            }}
          >
            <EditIcon />
          </IconButton>
        ) : null}
        {props.onDelete ? <DeleteButton onClick={props.onDelete} /> : null}
        {props.onCancel ? (
          <IconButton onClick={props.onCancel} color="secondary">
            <DeleteIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const styles = (theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['privateService']),
)(PrivateServiceListItem);
